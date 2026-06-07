import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "..");
const codexDir = join(root, "codex");
const appApiDir = join(process.cwd(), "app", "api");
const httpMethods = ["get", "post", "put", "patch", "delete"] as const;

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

type HttpMethod = (typeof httpMethods)[number];
type OpenApiOperation = { operationId?: string; requestBody?: unknown; responses?: Record<string, unknown> };
type OpenApiPathItem = Partial<Record<HttpMethod, OpenApiOperation>>;

type Capabilities = {
  providers: Array<{
    provider: string;
    models: Array<{ id: string; input?: string[]; routingTags?: string[] }>;
  }>;
};

type Routing = {
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

const knownModels = new Set<string>();
for (const provider of capabilities.providers) {
  for (const model of provider.models) {
    knownModels.add(`${provider.provider}:${model.id}`);
  }
}

for (const rule of routing.rules) {
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
  "getProjectBundle",
  "listImageAssets",
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
const operationIds = new Set<string>();
for (const path of Object.values(openApi.paths)) {
  for (const method of [path.get, path.post, path.put, path.patch, path.delete]) {
    if (method?.operationId) operationIds.add(method.operationId);
  }
}
for (const operation of requiredOperations) {
  assert.ok(operationIds.has(operation), `openapi missing operation ${operation}`);
}

for (const [pathName, pathItem] of Object.entries(openApi.paths)) {
  const routeFile = routeFileForOpenApiPath(pathName);
  assert.ok(existsSync(routeFile), `openapi path ${pathName} missing Next route ${routeFile}`);
  const exportedMethods = exportedRouteMethods(routeFile);
  for (const method of httpMethods) {
    const operation = pathItem[method];
    if (!operation) continue;
    assert.ok(operation.operationId, `openapi path ${pathName} ${method.toUpperCase()} missing operationId`);
    assert.ok(exportedMethods.has(method), `openapi path ${pathName} ${method.toUpperCase()} missing route export in ${routeFile}`);
    if (operation.requestBody) {
      assert.ok(operation.responses?.["400"], `openapi path ${pathName} ${method.toUpperCase()} requestBody missing 400 response`);
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
  visualMakerOps: requiredOperations.size,
  openApiRoutes: Object.keys(openApi.paths).length
});
