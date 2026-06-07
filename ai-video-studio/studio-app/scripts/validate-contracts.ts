import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "..");
const codexDir = join(root, "codex");
const appApiDir = join(process.cwd(), "app", "api");
const appDir = join(process.cwd(), "app");
const featureDir = join(process.cwd(), "src", "features");
const httpMethods = ["get", "post", "put", "patch", "delete"] as const;

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

type HttpMethod = (typeof httpMethods)[number];
type OpenApiOperation = {
  operationId?: string;
  parameters?: Array<{ name?: string; in?: string; required?: boolean; schema?: { type?: string; pattern?: string } }>;
  requestBody?: unknown;
  responses?: Record<string, unknown>;
};
type OpenApiPathItem = Partial<Record<HttpMethod, OpenApiOperation>>;

type Capabilities = {
  providers: Array<{
    provider: string;
    models: Array<{ id: string; input?: string[]; routingTags?: string[] }>;
  }>;
};

type Routing = {
  hideEngineFromUser: boolean;
  fallbackOnError: boolean;
  defaultTakePolicy: Record<string, { takeCount?: number; splitAcrossProviders?: boolean | string }>;
  filters: string[];
  rules: Array<{
    id: string;
    use: Array<{ provider: string; model: string }>;
  }>;
};

const capabilities = readJson<Capabilities>(join(codexDir, "config", "provider-capabilities.json"));
const routing = readJson<Routing>(join(codexDir, "config", "routing.config.json"));
const domainSchema = readJson<{ $defs: Record<string, unknown> }>(join(codexDir, "schemas", "domain.schema.json"));
const openApiPath = join(codexDir, "api", "openapi.json");
assertNoDuplicateOpenApiResponseCodes(openApiPath);
assertUserUiHidesProviderNames();
const openApi = readJson<{ paths: Record<string, OpenApiPathItem> }>(openApiPath);

function countChar(input: string, char: string) {
  return [...input].filter((item) => item === char).length;
}

function assertNoDuplicateOpenApiResponseCodes(path: string) {
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  let inResponses = false;
  let depth = 0;
  let startLine = 0;
  let responseCodes = new Set<string>();

  for (const [index, line] of lines.entries()) {
    if (!inResponses && line.includes('"responses": {')) {
      inResponses = true;
      depth = 0;
      startLine = index + 1;
      responseCodes = new Set<string>();
    }
    if (!inResponses) continue;

    if (depth === 1) {
      const match = line.trim().match(/^"(\d{3})":\s*\{/);
      if (match) {
        assert.ok(!responseCodes.has(match[1]), `openapi duplicate response ${match[1]} near line ${startLine}`);
        responseCodes.add(match[1]);
      }
    }

    depth += countChar(line, "{") - countChar(line, "}");
    if (depth === 0) inResponses = false;
  }
}

function routeFileForOpenApiPath(pathName: string) {
  const segments = pathName
    .slice(1)
    .split("/")
    .map((segment) => {
      const parameter = segment.match(/^\{(.+)\}$/);
      return parameter ? `[${parameter[1]}]` : segment;
    });
  return join(appApiDir, ...segments, "route.ts");
}

function exportedRouteMethods(routeFile: string) {
  if (!existsSync(routeFile)) return new Set<HttpMethod>();
  const source = readFileSync(routeFile, "utf8");
  return new Set(
    httpMethods.filter((method) => new RegExp(`export\\s+(async\\s+)?function\\s+${method.toUpperCase()}\\b`).test(source))
  );
}

function sourceFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx|css|mjs)$/.test(entry.name) ? [path] : [];
  });
}

function assertUserUiHidesProviderNames() {
  const bannedTerms = ["Runway", "Veo", "VEO", "Luma", "Vertex", "Firefly", "Gen-4", "Gen4", "gen4", "ray-2", "veo-3", "veo3"];
  for (const file of [...sourceFiles(appDir), ...sourceFiles(featureDir)]) {
    const source = readFileSync(file, "utf8");
    for (const term of bannedTerms) {
      assert.ok(!source.includes(term), `user UI source ${file} exposes provider/model term ${term}`);
    }
  }
}

function jsonSchema(response: unknown) {
  if (!response || typeof response !== "object") return null;
  const content = (response as { content?: Record<string, { schema?: { $ref?: string } }> }).content;
  return content?.["application/json"]?.schema || null;
}

function jsonSchemaRef(response: unknown) {
  return jsonSchema(response)?.$ref || null;
}

function requestJsonSchema(operation: OpenApiOperation) {
  const requestBody = operation.requestBody as
    | { content?: Record<string, { schema?: unknown }> }
    | undefined;
  return requestBody?.content?.["application/json"]?.schema || null;
}

function responseJsonSchema(response: unknown) {
  if (!response || typeof response !== "object") return null;
  return (response as { content?: Record<string, { schema?: unknown }> }).content?.["application/json"]?.schema || null;
}

function assertClosedObjectSchemas(schema: unknown, owner: string, path: string[] = []) {
  if (!schema || typeof schema !== "object") return;
  const objectSchema = schema as { type?: string; additionalProperties?: unknown; properties?: Record<string, unknown>; items?: unknown };
  if (objectSchema.type === "object") {
    assert.equal(objectSchema.additionalProperties, false, `${owner} object schema ${path.join(".") || "<root>"} must set additionalProperties false`);
  }
  if (objectSchema.properties) {
    for (const [property, propertySchema] of Object.entries(objectSchema.properties)) {
      assertClosedObjectSchemas(propertySchema, owner, [...path, property]);
    }
  }
  if (objectSchema.items) assertClosedObjectSchemas(objectSchema.items, owner, [...path, "[]"]);
}

function assertKnownDomainSchemaRefs(value: unknown, path: string[] = []) {
  if (!value || typeof value !== "object") return;
  const ref = (value as { $ref?: unknown }).$ref;
  const domainRefPrefix = "../schemas/domain.schema.json#/$defs/";
  if (typeof ref === "string" && ref.startsWith(domainRefPrefix)) {
    const defName = ref.slice(domainRefPrefix.length);
    assert.ok(domainSchema.$defs[defName], `openapi ref ${ref} at ${path.join(".")} missing domain schema`);
  }
  for (const [key, child] of Object.entries(value)) {
    assertKnownDomainSchemaRefs(child, [...path, key]);
  }
}

assertKnownDomainSchemaRefs(openApi, ["openapi"]);

function resolveJsonPointer(root: unknown, pointer: string) {
  if (pointer === "#") return root;
  if (!pointer.startsWith("#/")) return undefined;
  return pointer
    .slice(2)
    .split("/")
    .reduce<unknown>((value, segment) => {
      if (!value || typeof value !== "object") return undefined;
      const key = segment.replace(/~1/g, "/").replace(/~0/g, "~");
      return (value as Record<string, unknown>)[key];
    }, root);
}

function assertKnownLocalSchemaRefs(value: unknown, root: unknown, path: string[] = []) {
  if (!value || typeof value !== "object") return;
  const ref = (value as { $ref?: unknown }).$ref;
  if (typeof ref === "string" && ref.startsWith("#/")) {
    assert.notEqual(resolveJsonPointer(root, ref), undefined, `domain schema ref ${ref} at ${path.join(".")} does not resolve`);
  }
  for (const [key, child] of Object.entries(value)) {
    assertKnownLocalSchemaRefs(child, root, [...path, key]);
  }
}

assertKnownLocalSchemaRefs(domainSchema, domainSchema, ["domainSchema"]);

for (const [defName, defSchema] of Object.entries(domainSchema.$defs)) {
  assertClosedObjectSchemas(defSchema, `domain schema ${defName}`);
}

const knownModels = new Set<string>();
for (const provider of capabilities.providers) {
  assert.ok(provider.provider.trim(), "provider capability entry missing provider id");
  const providerModels = new Set<string>();
  for (const model of provider.models) {
    assert.ok(model.id.trim(), `provider ${provider.provider} has a model without id`);
    assert.ok(!providerModels.has(model.id), `provider ${provider.provider} has duplicate model ${model.id}`);
    providerModels.add(model.id);
    knownModels.add(`${provider.provider}:${model.id}`);
  }
}
assert.equal(knownModels.size, capabilities.providers.reduce((total, provider) => total + provider.models.length, 0), "provider capability model keys should be unique");
assert.equal(routing.hideEngineFromUser, true, "routing must keep engine names hidden from users");
assert.equal(routing.fallbackOnError, true, "routing fallback policy should remain enabled");
for (const tier of ["economy", "fast", "final"]) {
  assert.ok(routing.defaultTakePolicy[tier], `routing defaultTakePolicy missing ${tier}`);
}
for (const filter of ["inputType", "aspectRatio", "durationSec", "resolution", "regionPolicy", "audioCapability", "providerHealth", "budget"]) {
  assert.ok(routing.filters.includes(filter), `routing filters missing ${filter}`);
}

const routingRuleIds = new Set<string>();
for (const rule of routing.rules) {
  assert.ok(rule.id.trim(), "routing rule missing id");
  assert.ok(!routingRuleIds.has(rule.id), `routing rule duplicate id ${rule.id}`);
  assert.ok(rule.use.length > 0, `routing rule ${rule.id} has no targets`);
  routingRuleIds.add(rule.id);
  for (const target of rule.use) {
    assert.ok(
      knownModels.has(`${target.provider}:${target.model}`),
      `routing rule ${rule.id} references unknown model ${target.provider}:${target.model}`
    );
  }
}

for (const defName of [
  "ImageAsset",
  "ImageJob",
  "AssetKind",
  "AssetUsageMode",
  "CancelJobResult",
  "CreditTransaction",
  "MediaArtifact",
  "MediaArtifactCleanup",
  "MediaArtifactInventoryItem",
  "MediaArtifactInventory",
  "StorageCleanupAction",
  "StorageCleanupPlanItem",
  "StorageCleanupPlan",
  "StorageCleanupExecutionRecord",
  "StorageCleanupExecutionResult",
  "StorageCleanupExecutionSnapshot",
  "QueueJobKind",
  "QueueJobSnapshot",
  "JobQueueSnapshot",
  "WorkerDispatchKind",
  "WorkerDispatchItem",
  "WorkerDispatchSnapshot",
  "WorkerLeaseStatus",
  "WorkerLease",
  "WorkerLeaseRequest",
  "WorkerLeaseResult",
  "WorkerLeaseReleaseResult",
  "WorkerLeaseRenewResult",
  "WorkerLeaseCompletionOutput",
  "WorkerLeaseCompletionInput",
  "WorkerLeaseCompletionResult",
  "WorkerLeaseSnapshot",
  "WorkerCompletionStatus",
  "WorkerCompletionReceipt",
  "WorkerCompletionSnapshot",
  "WorkerRetryAction",
  "WorkerRetryPlanItem",
  "WorkerRetryPlan",
  "WorkerRetryRecord",
  "WorkerRetryExecutionResult",
  "WorkerRetryExecutionSnapshotItem",
  "WorkerRetryExecutionSnapshot",
  "ImageWorkerInvocation",
  "DirectionSpec",
  "EditAudioPatch",
  "EditCommandInput",
  "GenerationPromptPackage",
  "ProviderHealthStatus",
  "ProviderHealthTarget",
  "ProviderHealthSnapshot",
  "ProviderInvocation",
  "ProviderInvocationInputKind",
  "ProviderAttempt",
  "ProviderRoutingDecision",
  "ProjectBundle",
  "RuntimeReadiness",
  "SystemMetrics",
  "RenderSourceHash",
  "CostEstimate",
  "InsufficientCreditsResponse",
  "RenderPreview",
  "RenderPlan",
  "RenderWorkerInvocation",
  "RenderRightsReview",
  "StoryboardScenePatch",
  "StoryboardSaecPatch",
  "StoryboardShotRequirementsPatch",
  "StoryboardDirectionPatch",
  "StoryboardShotPatch",
  "StoryboardUpdateInput",
  "AssetDeleteResult"
]) {
  assert.ok(domainSchema.$defs[defName], `domain schema missing ${defName}`);
}

const requiredOperations = new Set([
  "applyEdit",
  "createProject",
  "decomposeIdea",
  "estimateCost",
  "generateAll",
  "getJob",
  "getProjectBundle",
  "listImageAssets",
  "listProjects",
  "registerExternalImage",
  "createImageJob",
  "cancelJob",
  "attachImageToShot",
  "detachImageFromShot",
  "deleteImageAsset",
  "previewRender",
  "setAudio",
  "setDefaultRender",
  "updateStoryboard",
  "updateShotDirection",
  "generateShot",
  "regenerate",
  "selectTake",
  "startRender",
  "upgradeTake",
  "getRuntimeReadiness",
  "getSystemMetrics",
  "getProviderHealthSnapshot",
  "getMediaArtifactInventory",
  "getStorageCleanupPlan",
  "executeStorageCleanup",
  "getStorageCleanupExecutionSnapshot",
  "getJobQueueSnapshot",
  "getWorkerDispatchSnapshot",
  "getWorkerLeaseSnapshot",
  "createWorkerLease",
  "releaseWorkerLease",
  "renewWorkerLease",
  "completeWorkerLease",
  "getWorkerCompletionSnapshot",
  "getWorkerRetryPlan",
  "getWorkerRetryExecutionSnapshot",
  "executeWorkerRetry"
]);
const creditGuardedOperations = new Set(["createImageJob", "generateShot", "generateAll", "regenerate", "upgradeTake", "startRender"]);
const documentedJsonSuccessStatuses = new Set(["200", "201", "202"]);
const documentedJsonErrorStatuses = new Set(["400", "401", "402", "404", "409", "422", "503"]);
const serviceConflictOperations = new Set(["setDefaultRender", "startRender"]);
const pathParameterPatterns = new Map([
  ["projectId", "^prj_"],
  ["shotId", "^sht_"],
  ["takeId", "^tak_"],
  ["assetId", "^img_"],
  ["leaseId", "^wlease_"],
  ["jobId", "^(gen_|ijob_|rnd_)"]
]);
const resultShapedErrorResponses = new Map([
  ["cancelJob:404", "../schemas/domain.schema.json#/$defs/CancelJobResult"],
  ["cancelJob:409", "../schemas/domain.schema.json#/$defs/CancelJobResult"],
  ["releaseWorkerLease:404", "../schemas/domain.schema.json#/$defs/WorkerLeaseReleaseResult"],
  ["releaseWorkerLease:409", "../schemas/domain.schema.json#/$defs/WorkerLeaseReleaseResult"],
  ["renewWorkerLease:404", "../schemas/domain.schema.json#/$defs/WorkerLeaseRenewResult"],
  ["renewWorkerLease:409", "../schemas/domain.schema.json#/$defs/WorkerLeaseRenewResult"],
  ["completeWorkerLease:404", "../schemas/domain.schema.json#/$defs/WorkerLeaseCompletionResult"],
  ["completeWorkerLease:409", "../schemas/domain.schema.json#/$defs/WorkerLeaseCompletionResult"],
  ["executeWorkerRetry:404", "../schemas/domain.schema.json#/$defs/WorkerRetryExecutionResult"],
  ["executeWorkerRetry:409", "../schemas/domain.schema.json#/$defs/WorkerRetryExecutionResult"]
]);
const operationIds = new Set<string>();
const operationOwners = new Map<string, string>();
for (const [pathName, pathItem] of Object.entries(openApi.paths)) {
  for (const method of httpMethods) {
    const operation = pathItem[method];
    if (!operation?.operationId) continue;
    const owner = `${method.toUpperCase()} ${pathName}`;
    assert.ok(
      !operationOwners.has(operation.operationId),
      `openapi duplicate operationId ${operation.operationId} at ${owner} and ${operationOwners.get(operation.operationId)}`
    );
    operationOwners.set(operation.operationId, owner);
    operationIds.add(operation.operationId);
  }
}
for (const operation of requiredOperations) {
  assert.ok(operationIds.has(operation), `openapi missing operation ${operation}`);
}
for (const operation of operationIds) {
  assert.ok(requiredOperations.has(operation), `openapi operation ${operation} missing from requiredOperations`);
}

for (const [pathName, pathItem] of Object.entries(openApi.paths)) {
  const routeFile = routeFileForOpenApiPath(pathName);
  assert.ok(existsSync(routeFile), `openapi path ${pathName} missing Next route ${routeFile}`);
  const routeSource = readFileSync(routeFile, "utf8");
  const exportedMethods = exportedRouteMethods(routeFile);
  if (pathName.startsWith("/system/")) {
    assert.ok(routeSource.includes("requireSystemAccess("), `system route ${pathName} missing requireSystemAccess guard`);
  }
  for (const method of httpMethods) {
    const operation = pathItem[method];
    if (!operation) continue;
    assert.ok(operation.operationId, `openapi path ${pathName} ${method.toUpperCase()} missing operationId`);
    assert.ok(exportedMethods.has(method), `openapi path ${pathName} ${method.toUpperCase()} missing route export in ${routeFile}`);
    const pathParameters = new Map((operation.parameters || []).filter((parameter) => parameter.in === "path").map((parameter) => [parameter.name, parameter]));
    for (const [, parameterName] of pathName.matchAll(/\{([^}]+)\}/g)) {
      const parameter = pathParameters.get(parameterName);
      assert.ok(parameter, `openapi path ${pathName} ${method.toUpperCase()} missing path parameter ${parameterName}`);
      assert.equal(parameter.required, true, `openapi path ${pathName} ${method.toUpperCase()} path parameter ${parameterName} must be required`);
      assert.equal(parameter.schema?.type, "string", `openapi path ${pathName} ${method.toUpperCase()} path parameter ${parameterName} must be a string`);
      const expectedPattern = pathParameterPatterns.get(parameterName);
      if (expectedPattern) {
        assert.equal(
          parameter.schema?.pattern,
          expectedPattern,
          `openapi path ${pathName} ${method.toUpperCase()} path parameter ${parameterName} must use pattern ${expectedPattern}`
        );
      }
    }
    if (operation.requestBody) {
      assert.ok(operation.responses?.["400"], `openapi path ${pathName} ${method.toUpperCase()} requestBody missing 400 response`);
      assertClosedObjectSchemas(requestJsonSchema(operation), `${operation.operationId || method.toUpperCase()} ${pathName}`);
    }
    if (routeSource.includes("serviceErrorResponse(")) {
      assert.ok(operation.responses?.["404"], `service error route ${operation.operationId} missing 404 response`);
      if (operation.operationId && serviceConflictOperations.has(operation.operationId)) {
        assert.ok(operation.responses?.["409"], `service conflict route ${operation.operationId} missing 409 response`);
      }
    }
    if (pathName.includes("{")) {
      assert.ok(routeSource.includes("pathParamsError("), `path route ${pathName} ${method.toUpperCase()} missing pathParamsError guard`);
      assert.ok(operation.responses?.["400"], `path route ${pathName} ${method.toUpperCase()} missing 400 response`);
    }
    if (operation.operationId && creditGuardedOperations.has(operation.operationId)) {
      assert.ok(routeSource.includes("creditReservationResponse("), `credit guarded operation ${operation.operationId} missing route credit handler`);
      assert.ok(operation.responses?.["402"], `credit guarded operation ${operation.operationId} missing 402 response`);
    }
    if (operation.operationId) {
      for (const [code, response] of Object.entries(operation.responses || {})) {
        if (documentedJsonSuccessStatuses.has(code) || documentedJsonErrorStatuses.has(code)) {
          assert.ok(jsonSchema(response), `${operation.operationId} ${code} response must declare an application/json schema`);
        }
        assertClosedObjectSchemas(responseJsonSchema(response), `${operation.operationId || method.toUpperCase()} ${code} response`);
        const expectedRef = resultShapedErrorResponses.get(`${operation.operationId}:${code}`);
        if (expectedRef) {
          assert.equal(jsonSchemaRef(response), expectedRef, `${operation.operationId} ${code} must reference ${expectedRef}`);
        }
      }
    }
    if (pathName.startsWith("/system/")) {
      assert.ok(operation.responses?.["401"], `system path ${pathName} ${method.toUpperCase()} missing 401 response`);
      assert.ok(operation.responses?.["503"], `system path ${pathName} ${method.toUpperCase()} missing 503 response`);
      assert.equal(
        jsonSchemaRef(operation.responses["401"]),
        "../schemas/domain.schema.json#/$defs/ErrorResponse",
        `system path ${pathName} ${method.toUpperCase()} 401 must reference ErrorResponse`
      );
      assert.equal(
        jsonSchemaRef(operation.responses["503"]),
        "../schemas/domain.schema.json#/$defs/ErrorResponse",
        `system path ${pathName} ${method.toUpperCase()} 503 must reference ErrorResponse`
      );
    }
  }
}

const templateDir = join(codexDir, "config", "templates");
const templateFiles = readdirSync(templateDir).filter((name) => name.endsWith(".json"));
assert.equal(templateFiles.length, 6, "expected 6 intent templates");

const expectedIntents = new Set(["shorts", "product_ad", "app_intro", "real_estate", "education", "brand"]);
for (const file of templateFiles) {
  const template = readJson<{ intent: string; defaults: { aspect: string; tier: string } }>(join(templateDir, file));
  assert.ok(expectedIntents.has(template.intent), `unknown template intent ${template.intent}`);
  assert.ok(["9:16", "16:9", "1:1", "4:5"].includes(template.defaults.aspect), `invalid aspect in ${file}`);
  assert.ok(["fast", "economy", "final"].includes(template.defaults.tier), `invalid tier in ${file}`);
}

console.log("validate-contracts OK", {
  providers: capabilities.providers.length,
  routingRules: routing.rules.length,
  templates: templateFiles.length,
  requiredOperations: requiredOperations.size,
  openApiRoutes: Object.keys(openApi.paths).length
});
