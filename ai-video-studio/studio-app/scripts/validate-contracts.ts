import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "..");
const codexDir = join(root, "codex");
const appApiDir = join(process.cwd(), "app", "api");
const appDir = join(process.cwd(), "app");
const featureDir = join(process.cwd(), "src", "features");
const serverDir = join(process.cwd(), "src", "server");
const domainTypesPath = join(process.cwd(), "src", "domain", "types.ts");
const scriptsDir = join(process.cwd(), "scripts");
const workflowPath = join(root, "..", ".github", "workflows", "ai-video-studio.yml");
const httpMethods = ["get", "post", "put", "patch", "delete"] as const;

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

type HttpMethod = (typeof httpMethods)[number];
type OpenApiParameter = { name?: string; in?: string; required?: boolean; schema?: { type?: string; pattern?: string } };
type OpenApiOperation = {
  operationId?: string;
  parameters?: OpenApiParameter[];
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
const packageJson = readJson<{ scripts?: Record<string, string> }>(join(process.cwd(), "package.json"));
const openApiPath = join(codexDir, "api", "openapi.json");
const allowedSchemaOnlyDomainDefs = new Set([
  "Character",
  "CreditSummary",
  "EditAudioPatch",
  "EditCommandInput",
  "RenderSourceHash",
  "StoryboardDirectionPatch",
  "StoryboardSaecPatch",
  "StoryboardScenePatch",
  "StoryboardShotPatch",
  "StoryboardShotRequirementsPatch",
  "StoryboardUpdateInput",
  "StudioCredits"
]);
assertNoDuplicateOpenApiResponseCodes(openApiPath);
assertUserUiHidesProviderNames();
assertMockTestsAreScripted();
assertVerificationChainIsComplete();
const openApi = readJson<{ paths: Record<string, OpenApiPathItem> }>(openApiPath);
assertStorageCleanupObjectStorageBoundary();
assertMockTickProductionBoundary();
assertProductionAutoTickIsDisabled();
assertProductionMockPersistenceIsDisabled();
assertPersistenceSchemaBoundary();
assertProductionPersistenceReadinessBoundary();
assertProductionProviderReadinessBoundary();
assertProductionQueueReadinessBoundary();
assertProductionProjectCreateBoundary();
assertProductionWorkRequestBoundary();
assertProductionStateMutationBoundary();
assertProductionReadBoundary();

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

function openApiPathForRouteFile(routeFile: string) {
  const routePath = routeFile.slice(appApiDir.length + 1).replace(/\\/g, "/").replace(/\/route\.ts$/, "");
  return `/${routePath
    .split("/")
    .map((segment) => {
      const parameter = segment.match(/^\[(.+)\]$/);
      return parameter ? `{${parameter[1]}}` : segment;
    })
    .join("/")}`;
}

function routeFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return routeFiles(path);
    return entry.name === "route.ts" ? [path] : [];
  });
}

function exportedRouteMethods(routeFile: string) {
  if (!existsSync(routeFile)) return new Set<HttpMethod>();
  const source = readFileSync(routeFile, "utf8");
  return new Set(
    httpMethods.filter((method) => new RegExp(`export\\s+(async\\s+)?function\\s+${method.toUpperCase()}\\b`).test(source))
  );
}

function routeMethodSource(routeSource: string, method: HttpMethod) {
  const match = new RegExp(`export\\s+(async\\s+)?function\\s+${method.toUpperCase()}\\b`).exec(routeSource);
  if (!match) return "";
  const parameterStart = routeSource.indexOf("(", match.index);
  assert.notEqual(parameterStart, -1, `route method ${method.toUpperCase()} missing parameter list`);
  let parameterDepth = 0;
  let parameterEnd = -1;
  for (let index = parameterStart; index < routeSource.length; index += 1) {
    const char = routeSource[index];
    if (char === "(") parameterDepth += 1;
    if (char === ")") parameterDepth -= 1;
    if (parameterDepth === 0) {
      parameterEnd = index;
      break;
    }
  }
  assert.notEqual(parameterEnd, -1, `route method ${method.toUpperCase()} parameter list did not close`);
  const bodyStart = routeSource.indexOf("{", parameterEnd);
  assert.notEqual(bodyStart, -1, `route method ${method.toUpperCase()} missing body`);
  let depth = 0;
  for (let index = bodyStart; index < routeSource.length; index += 1) {
    const char = routeSource[index];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return routeSource.slice(match.index, index + 1);
  }
  return routeSource.slice(match.index);
}

function routeSuccessStatuses(methodSource: string) {
  const statuses = new Set<string>();
  for (const [, expression] of methodSource.matchAll(/\bstatus\s*[:=]\s*([^;\n}]*)/g)) {
    for (const [, status] of expression.matchAll(/\b(20[0124])\b/g)) {
      statuses.add(status);
    }
  }
  if (methodSource.includes("NextResponse.json(") && statuses.size === 0) statuses.add("200");
  return statuses;
}

function routeExplicitResponseStatuses(methodSource: string) {
  const statuses = new Set<string>();
  for (const [, expression] of methodSource.matchAll(/\bstatus\s*[:=]\s*([^;\n}]*)/g)) {
    for (const [, status] of expression.matchAll(/\b([1-5]\d\d)\b/g)) {
      statuses.add(status);
    }
  }
  for (const [, status] of methodSource.matchAll(/apiError\([^\n;]*,\s*(\d{3})\s*\)/g)) {
    statuses.add(status);
  }
  return statuses;
}

function routeBooleanQueryParams(methodSource: string) {
  return new Set([...methodSource.matchAll(/booleanQueryParam\([^,]+,\s*"([^"]+)"/g)].map((match) => match[1]));
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

function assertMockTestsAreScripted() {
  const testMock = packageJson.scripts?.["test:mock"] || "";
  const testFiles = readdirSync(scriptsDir).filter((name) => name.endsWith(".test.ts"));
  for (const file of testFiles) {
    assert.ok(testMock.includes(`scripts/${file}`), `test:mock missing scripts/${file}`);
  }
}

function assertVerificationChainIsComplete() {
  const expectedVerify = "npm run typecheck && npm run validate:contracts && npm run test:mock && npm audit --omit=dev && npm run build";
  assert.equal(packageJson.scripts?.verify, expectedVerify, "verify script must run the full local validation chain");
  const workflow = readFileSync(workflowPath, "utf8");
  assert.ok(workflow.includes("working-directory: ai-video-studio/studio-app"), "AI Video Studio workflow must run from studio-app");
  assert.ok(workflow.includes('node-version: "24"'), "AI Video Studio workflow must use Node 24");
  assert.ok(workflow.includes("cache-dependency-path: ai-video-studio/studio-app/package-lock.json"), "AI Video Studio workflow must cache the app lockfile");
  assert.ok(workflow.includes("run: npm ci"), "AI Video Studio workflow must install with npm ci");
  assert.ok(workflow.includes("run: npm run verify"), "AI Video Studio workflow must run npm run verify");
}

function assertStorageCleanupObjectStorageBoundary() {
  const objectStorageSource = readFileSync(join(serverDir, "object-storage.ts"), "utf8");
  const cleanupSource = readFileSync(join(serverDir, "storage-cleanup.ts"), "utf8");
  const readinessSource = readFileSync(join(serverDir, "readiness.ts"), "utf8");
  const routeSource = readFileSync(join(appApiDir, "system", "storage-cleanup", "route.ts"), "utf8");
  const objectDeleteCall = cleanupSource.indexOf("deleteStoredObject(item.storageKey)");
  const metadataDelete = cleanupSource.indexOf("current.mediaArtifacts = current.mediaArtifacts.filter");
  const executeCleanup = openApi.paths["/system/storage-cleanup"]?.post;
  const executeCleanup503 = executeCleanup?.responses?.["503"];

  assert.ok(objectStorageSource.includes('objectStorageProviders = ["mock", "r2"]'), "object storage boundary must declare supported providers");
  assert.ok(objectStorageSource.includes("ObjectStorageUnavailableError"), "object storage boundary must expose an unavailable error");
  assert.ok(objectStorageSource.includes("ingestStoredObject"), "object storage boundary must expose an ingest port");
  assert.ok(objectStorageSource.includes("StoredObjectIngestInput"), "object storage boundary must type ingest inputs");
  assert.ok(objectStorageSource.includes('process.env.CUTPILOT_RUNTIME_MODE === "production"'), "object storage boundary must branch on production mode");
  assert.notEqual(objectDeleteCall, -1, "storage cleanup must call deleteStoredObject before deleting metadata");
  assert.notEqual(metadataDelete, -1, "storage cleanup must keep an explicit media artifact metadata deletion step");
  assert.ok(objectDeleteCall < metadataDelete, "storage cleanup must confirm object deletion before metadata deletion");
  assert.ok(routeSource.includes("ObjectStorageUnavailableError"), "storage cleanup route must catch object storage unavailable errors");
  assert.ok(routeSource.includes('apiError("OBJECT_STORAGE_UNAVAILABLE"'), "storage cleanup route must return the object storage unavailable code");
  assert.ok(JSON.stringify(executeCleanup503).includes("object storage deletion is unavailable"), "executeStorageCleanup 503 must document object storage unavailability");
  assert.ok(readinessSource.includes("liveObjectStorageDeleteImplemented = false"), "readiness must expose the missing live object storage delete adapter");
  assert.ok(readinessSource.includes("liveObjectStorageIngestImplemented = false"), "readiness must expose the missing live object storage ingest adapter");
  assert.ok((packageJson.scripts?.["test:mock"] || "").includes("scripts/object-storage-ingest-boundary.test.ts"), "test:mock must include object storage ingest boundary coverage");
  assert.ok(readinessSource.includes("objectStorageStatus"), "readiness must derive object storage status from the adapter boundary");
}

function assertMockTickProductionBoundary() {
  const routeSource = readFileSync(join(appApiDir, "jobs", "tick", "route.ts"), "utf8");
  const studioSource = readFileSync(join(featureDir, "studio", "StudioApp.tsx"), "utf8");
  const tickPost = openApi.paths["/jobs/tick"]?.post;
  const tick503 = tickPost?.responses?.["503"];

  assert.ok(routeSource.includes('CUTPILOT_RUNTIME_MODE === "production"'), "mock tick route must branch on production mode");
  assert.ok(routeSource.includes('apiError("MOCK_TICK_UNAVAILABLE"'), "mock tick route must return a stable production unavailable code");
  assert.ok(JSON.stringify(tick503).includes("Mock job ticking is unavailable"), "tickJobs 503 must document mock tick production unavailability");
  assert.ok(studioSource.includes("await studioApi.tick()"), "studio interval must still use the mock tick endpoint for local preview");
  assert.ok(studioSource.includes("Production does not expose the mock tick endpoint."), "studio interval must catch production mock tick failures");
}

function assertProductionAutoTickIsDisabled() {
  const mockServiceSource = readFileSync(join(serverDir, "mock-service.ts"), "utf8");
  const tickStart = mockServiceSource.indexOf("export function tickJobs()");
  const productionReturn = mockServiceSource.indexOf('process.env.CUTPILOT_RUNTIME_MODE === "production"', tickStart);
  const firstImageLoop = mockServiceSource.indexOf("for (const job of current.imageJobs)", tickStart);
  const testMock = packageJson.scripts?.["test:mock"] || "";

  assert.notEqual(tickStart, -1, "mock service must export tickJobs");
  assert.notEqual(productionReturn, -1, "tickJobs must check production mode");
  assert.notEqual(firstImageLoop, -1, "tickJobs must still contain the mock image job advancement loop");
  assert.ok(productionReturn < firstImageLoop, "tickJobs must return before auto-advancing mock jobs in production mode");
  assert.ok(testMock.includes("scripts/production-auto-tick-boundary.test.ts"), "test:mock must include production auto-tick boundary coverage");
}

function assertProductionMockPersistenceIsDisabled() {
  const mockServiceSource = readFileSync(join(serverDir, "mock-service.ts"), "utf8");
  const mockStateStoreSource = readFileSync(join(serverDir, "mock-state-store.ts"), "utf8");
  const readinessSource = readFileSync(join(serverDir, "readiness.ts"), "utf8");
  const persistStart = mockStateStoreSource.indexOf("function shouldPersistMockState()");
  const productionReturn = mockStateStoreSource.indexOf('process.env.CUTPILOT_RUNTIME_MODE === "production"', persistStart);
  const envPersistReturn = mockStateStoreSource.indexOf("process.env.CUTPILOT_MOCK_PERSIST", persistStart);
  const testMock = packageJson.scripts?.["test:mock"] || "";

  assert.ok(mockStateStoreSource.includes("export interface MockStateStore"), "mock state persistence must expose a replaceable store port");
  assert.ok(mockStateStoreSource.includes("fileBackedMockStateStore"), "mock state persistence must keep the file-backed mock store explicit");
  assert.ok(mockServiceSource.includes("fileBackedMockStateStore"), "mock service must use the mock state store port");
  assert.notEqual(persistStart, -1, "mock state store must define shouldPersistMockState");
  assert.notEqual(productionReturn, -1, "shouldPersistMockState must check production mode");
  assert.notEqual(envPersistReturn, -1, "shouldPersistMockState must still honor CUTPILOT_MOCK_PERSIST in mock mode");
  assert.ok(productionReturn < envPersistReturn, "production mode must disable mock persistence before CUTPILOT_MOCK_PERSIST is considered");
  assert.ok(readinessSource.includes("File-backed mock state is disabled in production mode."), "readiness must state mock persistence is disabled in production");
  assert.ok(testMock.includes("scripts/production-mock-persistence-boundary.test.ts"), "test:mock must include production mock persistence boundary coverage");
  assert.ok(testMock.includes("scripts/mock-state-store-boundary.test.ts"), "test:mock must include mock state store boundary coverage");
}

function assertPersistenceSchemaBoundary() {
  const schemaSource = readFileSync(join(codexDir, "persistence", "postgres-schema.sql"), "utf8");
  const manifestSource = readFileSync(join(serverDir, "live-persistence-contract.ts"), "utf8");
  const migrationSource = readFileSync(join(serverDir, "live-persistence-migrations.ts"), "utf8");
  const readAdapterSource = readFileSync(join(serverDir, "live-persistence-read-adapter.ts"), "utf8");
  const migrationRunnerSource = readFileSync(join(scriptsDir, "apply-persistence-migrations.ts"), "utf8");
  const readinessSource = readFileSync(join(serverDir, "readiness.ts"), "utf8");
  const testMock = packageJson.scripts?.["test:mock"] || "";
  const requiredTables = [
    "cutpilot_projects",
    "cutpilot_scenes",
    "cutpilot_shots",
    "cutpilot_takes",
    "cutpilot_generation_jobs",
    "cutpilot_provider_attempts",
    "cutpilot_image_assets",
    "cutpilot_image_jobs",
    "cutpilot_render_jobs",
    "cutpilot_credit_transactions",
    "cutpilot_media_artifacts",
    "cutpilot_worker_leases",
    "cutpilot_worker_retry_records"
  ];

  for (const table of requiredTables) {
    assert.ok(schemaSource.includes(`CREATE TABLE ${table}`), `persistence schema missing ${table}`);
    assert.ok(manifestSource.includes(`"${table}"`), `live persistence manifest missing ${table}`);
  }
  assert.ok(manifestSource.includes('livePersistenceSchemaVersion = "cutpilot_postgres_v1"'), "live persistence manifest must expose the schema version");
  assert.ok(readinessSource.includes("livePersistenceSchemaVersion"), "readiness must name the live persistence schema version while the adapter is unavailable");
  assert.equal(schemaSource.includes("CREATE TABLE cutpilot_studio_state"), false, "persistence schema must not collapse live state into a single blob table");
  assert.ok(schemaSource.includes("REFERENCES cutpilot_projects(id) ON DELETE CASCADE"), "persistence schema must anchor child tables to projects");
  assert.ok(schemaSource.includes("cutpilot_provider_attempts"), "persistence schema must preserve provider attempt telemetry");
  assert.ok(schemaSource.includes("provider_cost_usd numeric"), "persistence schema must preserve provider cost ledger fields");
  assert.ok(schemaSource.includes("storage_key text NOT NULL"), "persistence schema must preserve storage artifact keys");
  assert.ok(migrationSource.includes("cutpilot_schema_migrations"), "persistence migrations must record applied schema versions");
  assert.ok(migrationSource.includes("applyLivePersistenceMigration"), "persistence migrations must expose an apply function");
  assert.ok(migrationSource.includes("ROLLBACK"), "persistence migration apply must roll back failed migrations");
  assert.ok(readAdapterSource.includes("PostgresLivePersistenceReadAdapter"), "live persistence must expose a Postgres read adapter");
  assert.ok(readAdapterSource.includes("async listProjects()"), "live persistence read adapter must support project list reads");
  assert.ok(readAdapterSource.includes("async listImageAssets(projectId: string)"), "live persistence read adapter must support image asset list reads");
  assert.ok(readAdapterSource.includes("async getJob(jobId: string)"), "live persistence read adapter must support job reads");
  assert.ok(readAdapterSource.includes("async getProjectBundle(projectId: string)"), "live persistence read adapter must support project bundle reads");
  assert.ok(readAdapterSource.includes("buildLiveRenderSourceHash"), "live persistence read adapter must compute render source hashes");
  assert.ok(migrationRunnerSource.includes("DATABASE_URL"), "persistence migration runner must require DATABASE_URL for live execution");
  assert.ok(migrationRunnerSource.includes("--dry-run"), "persistence migration runner must support dry-run inspection");
  assert.ok(packageJson.scripts?.["db:migrate"]?.includes("scripts/apply-persistence-migrations.ts"), "package scripts must expose db:migrate");
  assert.ok(packageJson.scripts?.["db:migrate:dry-run"]?.includes("--dry-run"), "package scripts must expose db:migrate:dry-run");
  assert.ok(testMock.includes("scripts/persistence-schema-boundary.test.ts"), "test:mock must include persistence schema boundary coverage");
  assert.ok(testMock.includes("scripts/persistence-contract-manifest.test.ts"), "test:mock must include persistence manifest coverage");
  assert.ok(testMock.includes("scripts/persistence-migration-runner.test.ts"), "test:mock must include persistence migration runner coverage");
  assert.ok(testMock.includes("scripts/live-persistence-read-adapter.test.ts"), "test:mock must include live persistence read adapter coverage");
}

function assertProductionPersistenceReadinessBoundary() {
  const readinessSource = readFileSync(join(serverDir, "readiness.ts"), "utf8");
  const testMock = packageJson.scripts?.["test:mock"] || "";

  assert.ok(readinessSource.includes('persistenceEnv = ["DATABASE_URL"]'), "readiness must require DATABASE_URL for persistence");
  assert.ok(readinessSource.includes("validDatabaseUrl("), "readiness must validate DATABASE_URL shape");
  assert.ok(readinessSource.includes("livePersistenceImplemented = false"), "readiness must expose the missing live persistence adapter");
  assert.ok(readinessSource.includes('check("persistence", "Persistence"'), "readiness must include a persistence check");
  assert.ok(testMock.includes("scripts/production-persistence-readiness.test.ts"), "test:mock must include production persistence readiness coverage");
}

function assertProductionProviderReadinessBoundary() {
  const readinessSource = readFileSync(join(serverDir, "readiness.ts"), "utf8");
  const providerExecutionContractSource = readFileSync(join(serverDir, "provider-execution-contract.ts"), "utf8");
  const testMock = packageJson.scripts?.["test:mock"] || "";

  assert.ok(readinessSource.includes('providerEnv = ["RUNWAY_API_KEY", "LUMA_API_KEY", "GOOGLE_VERTEX_PROJECT"]'), "readiness must require provider execution env");
  assert.ok(readinessSource.includes("liveProviderExecutionImplemented = false"), "readiness must expose the missing live provider execution adapter");
  assert.ok(readinessSource.includes("providerExecutionContractVersion"), "readiness must name the provider execution contract version");
  assert.ok(providerExecutionContractSource.includes('providerExecutionContractVersion = "provider_execution_v1"'), "provider execution contract must expose a stable version");
  assert.ok(providerExecutionContractSource.includes("PROVIDER_UNAVAILABLE"), "provider execution contract must define the unavailable error code");
  assert.ok(providerExecutionContractSource.includes("validateProviderExecutionResult"), "provider execution contract must expose result validation");
  assert.ok(readinessSource.includes("providerExecutionStatus"), "readiness must derive provider execution status from the adapter boundary");
  assert.ok(readinessSource.includes('check("provider_execution", "Provider execution"'), "readiness must include a provider execution check");
  assert.ok(testMock.includes("scripts/production-provider-readiness.test.ts"), "test:mock must include production provider readiness coverage");
  assert.ok(testMock.includes("scripts/provider-execution-contract.test.ts"), "test:mock must include provider execution contract coverage");
}

function assertProductionQueueReadinessBoundary() {
  const readinessSource = readFileSync(join(serverDir, "readiness.ts"), "utf8");
  const queueWorkerContractSource = readFileSync(join(serverDir, "queue-worker-contract.ts"), "utf8");
  const testMock = packageJson.scripts?.["test:mock"] || "";

  assert.ok(readinessSource.includes('queueEnv = ["CUTPILOT_QUEUE_URL"]'), "readiness must require CUTPILOT_QUEUE_URL for queue workers");
  assert.ok(readinessSource.includes("validQueueUrl("), "readiness must validate queue URL shape");
  assert.ok(readinessSource.includes("liveQueueWorkerImplemented = false"), "readiness must expose the missing live queue worker adapter");
  assert.ok(readinessSource.includes("queueWorkerContractVersion"), "readiness must name the queue worker contract version");
  assert.ok(queueWorkerContractSource.includes('queueWorkerContractVersion = "queue_worker_v1"'), "queue worker contract must expose a stable version");
  assert.ok(queueWorkerContractSource.includes("buildQueueWorkerEnvelope"), "queue worker contract must expose envelope construction");
  assert.ok(queueWorkerContractSource.includes("validateQueueWorkerEnvelope"), "queue worker contract must expose envelope validation");
  assert.ok(readinessSource.includes("queueStatus"), "readiness must derive queue worker status from the adapter boundary");
  assert.ok(testMock.includes("scripts/production-queue-readiness.test.ts"), "test:mock must include production queue readiness coverage");
  assert.ok(testMock.includes("scripts/queue-worker-contract.test.ts"), "test:mock must include queue worker contract coverage");
}

function assertProductionProjectCreateBoundary() {
  const routeSource = readFileSync(join(appApiDir, "projects", "route.ts"), "utf8");
  const liveRuntimeSource = readFileSync(join(serverDir, "live-persistence-runtime.ts"), "utf8");
  const writeAdapterSource = readFileSync(join(serverDir, "live-persistence-write-adapter.ts"), "utf8");
  const projectBuilderSource = readFileSync(join(serverDir, "live-project-builder.ts"), "utf8");
  const testMock = packageJson.scripts?.["test:mock"] || "";
  const createProjectPost = openApi.paths["/projects"]?.post;
  const createProject503 = createProjectPost?.responses?.["503"];
  const productionCheck = routeSource.indexOf('CUTPILOT_RUNTIME_MODE === "production"');
  const createCall = routeSource.indexOf("createProject({");

  assert.notEqual(productionCheck, -1, "project creation route must branch on production mode");
  assert.notEqual(createCall, -1, "project creation route must still call createProject in mock mode");
  assert.ok(productionCheck < createCall, "project creation route must reject production mock mutation before createProject");
  assert.ok(routeSource.includes('apiError("MOCK_MUTATION_UNAVAILABLE"'), "project creation route must return a stable production unavailable code");
  assert.ok(routeSource.includes("createLiveProject({"), "project creation route must support live project writes behind a switch");
  assert.ok(routeSource.includes("liveProjectWritesEnabled()"), "project creation route must require the live write switch");
  assert.ok(routeSource.includes('apiError("LIVE_PERSISTENCE_UNAVAILABLE"'), "project creation route must fail closed when live persistence is unavailable");
  assert.ok(liveRuntimeSource.includes("CUTPILOT_ENABLE_LIVE_WRITES"), "live persistence runtime must require an explicit live write switch");
  assert.ok(liveRuntimeSource.includes("PostgresLivePersistenceWriteAdapter"), "live persistence runtime must use the Postgres write adapter");
  assert.ok(writeAdapterSource.includes("INSERT INTO cutpilot_projects"), "live write adapter must insert projects");
  assert.ok(writeAdapterSource.includes("ROLLBACK"), "live write adapter must roll back failed project creation");
  assert.ok(projectBuilderSource.includes("buildLiveProjectCreateRecords"), "live project builder must expose project creation records");
  assert.ok(JSON.stringify(createProject503).includes("Mock-backed project creation is unavailable"), "createProject 503 must document mock mutation production unavailability");
  assert.ok(testMock.includes("scripts/production-project-create-boundary.test.ts"), "test:mock must include production project creation boundary coverage");
  assert.ok(testMock.includes("scripts/live-persistence-write-adapter.test.ts"), "test:mock must include live persistence write adapter coverage");
}

function assertProductionWorkRequestBoundary() {
  const guardedRoutes = [
    {
      route: join(appApiDir, "projects", "[projectId]", "generate-all", "route.ts"),
      path: "/projects/{projectId}/generate-all",
      operationId: "generateAll",
      serviceCall: "generateAll(projectId"
    },
    {
      route: join(appApiDir, "shots", "[shotId]", "generate", "route.ts"),
      path: "/shots/{shotId}/generate",
      operationId: "generateShot",
      serviceCall: "generateShot(shotId"
    },
    {
      route: join(appApiDir, "shots", "[shotId]", "regenerate", "route.ts"),
      path: "/shots/{shotId}/regenerate",
      operationId: "regenerate",
      serviceCall: "regenerate(shotId"
    },
    {
      route: join(appApiDir, "takes", "[takeId]", "upgrade", "route.ts"),
      path: "/takes/{takeId}/upgrade",
      operationId: "upgradeTake",
      serviceCall: "upgradeTake(takeId"
    },
    {
      route: join(appApiDir, "projects", "[projectId]", "image-jobs", "route.ts"),
      path: "/projects/{projectId}/image-jobs",
      operationId: "createImageJob",
      serviceCall: "createImageJob({"
    },
    {
      route: join(appApiDir, "projects", "[projectId]", "renders", "route.ts"),
      path: "/projects/{projectId}/renders",
      operationId: "startRender",
      serviceCall: "startRender(projectId"
    }
  ];
  const testMock = packageJson.scripts?.["test:mock"] || "";

  for (const item of guardedRoutes) {
    const routeSource = readFileSync(item.route, "utf8");
    const operation = openApi.paths[item.path]?.post;
    const productionCheck = routeSource.indexOf('CUTPILOT_RUNTIME_MODE === "production"');
    const serviceCall = routeSource.indexOf(item.serviceCall);

    assert.equal(operation?.operationId, item.operationId, `${item.path} must keep the expected operation id`);
    assert.notEqual(productionCheck, -1, `${item.operationId} route must branch on production mode`);
    assert.notEqual(serviceCall, -1, `${item.operationId} route must still call its mock service in mock mode`);
    assert.ok(productionCheck < serviceCall, `${item.operationId} route must reject production mock mutation before service call`);
    assert.ok(routeSource.includes('apiError("MOCK_MUTATION_UNAVAILABLE"'), `${item.operationId} route must return a stable production unavailable code`);
    assert.ok(JSON.stringify(operation?.responses?.["503"]).includes("Mock-backed work requests are unavailable"), `${item.operationId} 503 must document mock work request production unavailability`);
  }

  assert.ok(testMock.includes("scripts/production-work-request-boundary.test.ts"), "test:mock must include production work request boundary coverage");
}

function assertProductionStateMutationBoundary() {
  const guardedRoutes = [
    {
      route: join(appApiDir, "jobs", "[jobId]", "cancel", "route.ts"),
      path: "/jobs/{jobId}/cancel",
      method: "post" as const,
      operationId: "cancelJob",
      serviceCall: "cancelJob(jobId"
    },
    {
      route: join(appApiDir, "shots", "[shotId]", "direction", "route.ts"),
      path: "/shots/{shotId}/direction",
      method: "patch" as const,
      operationId: "updateShotDirection",
      serviceCall: "updateShotDirection(shotId"
    },
    {
      route: join(appApiDir, "projects", "[projectId]", "storyboard", "route.ts"),
      path: "/projects/{projectId}/storyboard",
      method: "put" as const,
      operationId: "updateStoryboard",
      serviceCall: "updateStoryboard(projectId"
    },
    {
      route: join(appApiDir, "shots", "[shotId]", "select-take", "route.ts"),
      path: "/shots/{shotId}/select-take",
      method: "post" as const,
      operationId: "selectTake",
      serviceCall: "selectTake(shotId"
    },
    {
      route: join(appApiDir, "projects", "[projectId]", "assets", "route.ts"),
      path: "/projects/{projectId}/assets",
      method: "post" as const,
      operationId: "registerExternalImage",
      serviceCall: "registerExternalImage({"
    },
    {
      route: join(appApiDir, "projects", "[projectId]", "assets", "[assetId]", "route.ts"),
      path: "/projects/{projectId}/assets/{assetId}",
      method: "delete" as const,
      operationId: "deleteImageAsset",
      serviceCall: "deleteImageAsset(projectId"
    },
    {
      route: join(appApiDir, "shots", "[shotId]", "references", "route.ts"),
      path: "/shots/{shotId}/references",
      method: "post" as const,
      operationId: "attachImageToShot",
      serviceCall: "attachImageToShot(shotId"
    },
    {
      route: join(appApiDir, "shots", "[shotId]", "references", "[assetId]", "route.ts"),
      path: "/shots/{shotId}/references/{assetId}",
      method: "delete" as const,
      operationId: "detachImageFromShot",
      serviceCall: "detachImageFromShot(shotId"
    },
    {
      route: join(appApiDir, "projects", "[projectId]", "edits", "route.ts"),
      path: "/projects/{projectId}/edits",
      method: "post" as const,
      operationId: "applyEdit",
      serviceCall: "applyEdit(projectId"
    },
    {
      route: join(appApiDir, "projects", "[projectId]", "audio", "route.ts"),
      path: "/projects/{projectId}/audio",
      method: "put" as const,
      operationId: "setAudio",
      serviceCall: "setAudio(projectId"
    },
    {
      route: join(appApiDir, "projects", "[projectId]", "default-render", "route.ts"),
      path: "/projects/{projectId}/default-render",
      method: "post" as const,
      operationId: "setDefaultRender",
      serviceCall: "setDefaultRender(projectId"
    }
  ];
  const testMock = packageJson.scripts?.["test:mock"] || "";

  for (const item of guardedRoutes) {
    const routeSource = readFileSync(item.route, "utf8");
    const operation = openApi.paths[item.path]?.[item.method];
    const productionCheck = routeSource.indexOf('CUTPILOT_RUNTIME_MODE === "production"');
    const serviceCall = routeSource.indexOf(item.serviceCall);

    assert.equal(operation?.operationId, item.operationId, `${item.path} must keep the expected operation id`);
    assert.notEqual(productionCheck, -1, `${item.operationId} route must branch on production mode`);
    assert.notEqual(serviceCall, -1, `${item.operationId} route must still call its mock service in mock mode`);
    assert.ok(productionCheck < serviceCall, `${item.operationId} route must reject production mock mutation before service call`);
    assert.ok(routeSource.includes('apiError("MOCK_MUTATION_UNAVAILABLE"'), `${item.operationId} route must return a stable production unavailable code`);
    assert.ok(JSON.stringify(operation?.responses?.["503"]).includes("Mock-backed state changes are unavailable"), `${item.operationId} 503 must document mock state mutation production unavailability`);
  }

  assert.ok(testMock.includes("scripts/production-state-mutation-boundary.test.ts"), "test:mock must include production state mutation boundary coverage");
}

function assertProductionReadBoundary() {
  const liveRuntimeSource = readFileSync(join(serverDir, "live-persistence-runtime.ts"), "utf8");
  const liveRenderPreviewSource = readFileSync(join(serverDir, "live-render-preview.ts"), "utf8");
  const guardedRoutes = [
    {
      route: join(appApiDir, "projects", "route.ts"),
      path: "/projects",
      method: "get" as const,
      operationId: "listProjects",
      serviceCall: "listProjects()"
    },
    {
      route: join(appApiDir, "projects", "[projectId]", "route.ts"),
      path: "/projects/{projectId}",
      method: "get" as const,
      operationId: "getProjectBundle",
      serviceCall: "getProjectBundle(projectId"
    },
    {
      route: join(appApiDir, "jobs", "[jobId]", "route.ts"),
      path: "/jobs/{jobId}",
      method: "get" as const,
      operationId: "getJob",
      serviceCall: "getJob(jobId"
    },
    {
      route: join(appApiDir, "projects", "[projectId]", "assets", "route.ts"),
      path: "/projects/{projectId}/assets",
      method: "get" as const,
      operationId: "listImageAssets",
      serviceCall: "listImageAssets(projectId"
    },
    {
      route: join(appApiDir, "projects", "[projectId]", "render-preview", "route.ts"),
      path: "/projects/{projectId}/render-preview",
      method: "post" as const,
      operationId: "previewRender",
      serviceCall: "previewRender(projectId"
    }
  ];
  const testMock = packageJson.scripts?.["test:mock"] || "";

  for (const item of guardedRoutes) {
    const routeSource = readFileSync(item.route, "utf8");
    const operation = openApi.paths[item.path]?.[item.method];
    const productionCheck = routeSource.indexOf('CUTPILOT_RUNTIME_MODE === "production"');
    const serviceCall = routeSource.indexOf(item.serviceCall);

    assert.equal(operation?.operationId, item.operationId, `${item.path} must keep the expected operation id`);
    assert.notEqual(productionCheck, -1, `${item.operationId} route must branch on production mode`);
    assert.notEqual(serviceCall, -1, `${item.operationId} route must still call its mock read in mock mode`);
    assert.ok(productionCheck < serviceCall, `${item.operationId} route must reject production mock reads before service call`);
    assert.ok(routeSource.includes('apiError("MOCK_READ_UNAVAILABLE"'), `${item.operationId} route must return a stable production read unavailable code`);
    assert.ok(JSON.stringify(operation?.responses?.["503"]).includes("Mock-backed reads are unavailable"), `${item.operationId} 503 must document mock read production unavailability`);
  }

  const projectListRoute = readFileSync(join(appApiDir, "projects", "route.ts"), "utf8");
  const projectBundleRoute = readFileSync(join(appApiDir, "projects", "[projectId]", "route.ts"), "utf8");
  const projectAssetsRoute = readFileSync(join(appApiDir, "projects", "[projectId]", "assets", "route.ts"), "utf8");
  const jobRoute = readFileSync(join(appApiDir, "jobs", "[jobId]", "route.ts"), "utf8");
  const renderPreviewRoute = readFileSync(join(appApiDir, "projects", "[projectId]", "render-preview", "route.ts"), "utf8");
  assert.ok(liveRuntimeSource.includes("CUTPILOT_ENABLE_LIVE_READS"), "live persistence runtime must require an explicit live read switch");
  assert.ok(liveRuntimeSource.includes("DATABASE_URL"), "live persistence runtime must require DATABASE_URL");
  assert.ok(liveRuntimeSource.includes("PostgresLivePersistenceReadAdapter"), "live persistence runtime must return the Postgres read adapter");
  assert.ok(liveRenderPreviewSource.includes("buildLiveRenderPreview"), "live render preview must expose a pure builder");
  assert.ok(liveRenderPreviewSource.includes("buildLiveRenderPlan"), "live render preview must build render plans from live bundles");
  assert.ok(projectListRoute.includes("listLiveProjects()"), "project list route must support live project reads behind the switch");
  assert.ok(projectBundleRoute.includes("getLiveProjectBundle(projectId)"), "project bundle route must support live project reads behind the switch");
  assert.ok(projectAssetsRoute.includes("listLiveImageAssets(projectId)"), "project asset list route must support live asset reads behind the switch");
  assert.ok(jobRoute.includes("getLiveJob(jobId)"), "job route must support live job reads behind the switch");
  assert.ok(renderPreviewRoute.includes("previewLiveRender(projectId"), "render preview route must support live render preview behind the switch");
  assert.ok(projectListRoute.includes('apiError("LIVE_PERSISTENCE_UNAVAILABLE"'), "project list route must fail closed when live persistence is unavailable");
  assert.ok(projectBundleRoute.includes('apiError("LIVE_PERSISTENCE_UNAVAILABLE"'), "project bundle route must fail closed when live persistence is unavailable");
  assert.ok(projectAssetsRoute.includes('apiError("LIVE_PERSISTENCE_UNAVAILABLE"'), "project asset list route must fail closed when live persistence is unavailable");
  assert.ok(jobRoute.includes('apiError("LIVE_PERSISTENCE_UNAVAILABLE"'), "job route must fail closed when live persistence is unavailable");
  assert.ok(renderPreviewRoute.includes('apiError("LIVE_PERSISTENCE_UNAVAILABLE"'), "render preview route must fail closed when live persistence is unavailable");
  assert.ok(testMock.includes("scripts/production-read-boundary.test.ts"), "test:mock must include production read boundary coverage");
  assert.ok(testMock.includes("scripts/live-persistence-runtime.test.ts"), "test:mock must include live persistence runtime coverage");
  assert.ok(testMock.includes("scripts/live-render-preview.test.ts"), "test:mock must include live render preview coverage");
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

function assertOnlyJsonContent(value: unknown, owner: string) {
  assert.ok(value && typeof value === "object", `${owner} must be an object`);
  const content = (value as { content?: unknown }).content;
  assert.ok(content && typeof content === "object" && !Array.isArray(content), `${owner} must declare content`);
  assert.deepEqual(Object.keys(content), ["application/json"], `${owner} content must only declare application/json`);
}

function assertOpenApiResponseDescription(response: unknown, owner: string) {
  assert.ok(response && typeof response === "object", `${owner} response must be an object`);
  const description = (response as { description?: unknown }).description;
  assert.equal(typeof description, "string", `${owner} response must declare a description`);
  assert.ok((description as string).trim(), `${owner} response description must not be empty`);
}

function assertClosedObjectSchemas(schema: unknown, owner: string, path: string[] = []) {
  if (!schema || typeof schema !== "object") return;
  const objectSchema = schema as { type?: string; additionalProperties?: unknown; properties?: Record<string, unknown>; required?: unknown; items?: unknown };
  if (objectSchema.type === "object") {
    const typedMap = !objectSchema.properties && objectSchema.additionalProperties && typeof objectSchema.additionalProperties === "object";
    assert.ok(
      typedMap || objectSchema.additionalProperties === false,
      `${owner} object schema ${path.join(".") || "<root>"} must set additionalProperties false or a typed map schema`
    );
    if (typeof objectSchema.required !== "undefined") {
      assert.ok(Array.isArray(objectSchema.required), `${owner} object schema ${path.join(".") || "<root>"} required must be an array`);
      const requiredProperties = new Set<string>();
      for (const property of objectSchema.required) {
        assert.equal(typeof property, "string", `${owner} object schema ${path.join(".") || "<root>"} required entries must be strings`);
        assert.ok(!requiredProperties.has(property), `${owner} object schema ${path.join(".") || "<root>"} has duplicate required property ${property}`);
        requiredProperties.add(property);
        assert.ok(objectSchema.properties?.[property], `${owner} object schema ${path.join(".") || "<root>"} required property ${property} missing from properties`);
      }
    }
  }
  if (objectSchema.properties) {
    for (const [property, propertySchema] of Object.entries(objectSchema.properties)) {
      assertClosedObjectSchemas(propertySchema, owner, [...path, property]);
    }
  }
  if (objectSchema.items) assertClosedObjectSchemas(objectSchema.items, owner, [...path, "[]"]);
  if (objectSchema.additionalProperties && typeof objectSchema.additionalProperties === "object") {
    assertClosedObjectSchemas(objectSchema.additionalProperties, owner, [...path, "*"]);
  }
}

function assertUniqueEnumValues(value: unknown, owner: string, path: string[] = []) {
  if (!value || typeof value !== "object") return;
  const schema = value as { enum?: unknown };
  if (typeof schema.enum !== "undefined") {
    assert.ok(Array.isArray(schema.enum), `${owner} schema ${path.join(".") || "<root>"} enum must be an array`);
    assert.ok(schema.enum.length > 0, `${owner} schema ${path.join(".") || "<root>"} enum must not be empty`);
    const enumValues = new Set<string>();
    for (const item of schema.enum) {
      const key = JSON.stringify(item);
      assert.ok(!enumValues.has(key), `${owner} schema ${path.join(".") || "<root>"} has duplicate enum value ${key}`);
      enumValues.add(key);
    }
  }
  for (const [key, child] of Object.entries(value)) {
    assertUniqueEnumValues(child, owner, [...path, key]);
  }
}

function assertExportedDomainTypesHaveSchemas() {
  for (const typeName of exportedDomainTypeNames()) {
    assert.ok(domainSchema.$defs[typeName], `domain schema missing exported TypeScript type ${typeName}`);
  }
}

function exportedDomainTypeNames() {
  const source = readFileSync(domainTypesPath, "utf8");
  return [...source.matchAll(/^export type (\w+)/gm)].map((match) => match[1]);
}

function parseStringLiteralUnionTypes(source: string) {
  const unions = new Map<string, string[]>();
  for (const [, typeName, expression] of source.matchAll(/^export type (\w+) = ([^;]+);/gm)) {
    const values = expression.split("|").map((part) => part.trim());
    if (!values.length || !values.every((value) => /^"[^"]*"$/.test(value))) continue;
    unions.set(
      typeName,
      values.map((value) => value.slice(1, -1))
    );
  }
  return unions;
}

function assertDomainStringLiteralUnionsMatchSchemaEnums() {
  const unions = parseStringLiteralUnionTypes(readFileSync(domainTypesPath, "utf8"));
  for (const [typeName, values] of unions) {
    const schema = domainSchema.$defs[typeName] as { type?: unknown; enum?: unknown };
    assert.ok(schema, `domain schema missing exported TypeScript type ${typeName}`);
    assert.equal(schema.type, "string", `domain schema ${typeName} must use type string for TypeScript string literal union`);
    assert.ok(Array.isArray(schema.enum), `domain schema ${typeName} must declare an enum for TypeScript string literal union`);
    assert.deepEqual(schema.enum, values, `domain schema ${typeName} enum must match TypeScript string literal union`);
  }
}

function collectDomainRefDefNames(value: unknown, refs = new Set<string>()) {
  if (!value || typeof value !== "object") return refs;
  const ref = (value as { $ref?: unknown }).$ref;
  if (typeof ref === "string") {
    const localPrefix = "#/$defs/";
    const domainPrefix = "../schemas/domain.schema.json#/$defs/";
    if (ref.startsWith(localPrefix)) refs.add(ref.slice(localPrefix.length));
    if (ref.startsWith(domainPrefix)) refs.add(ref.slice(domainPrefix.length));
  }
  for (const child of Object.values(value)) {
    collectDomainRefDefNames(child, refs);
  }
  return refs;
}

function assertSchemaOnlyDomainDefsAreAllowed() {
  const exportedTypes = new Set(exportedDomainTypeNames());
  const referencedDefs = collectDomainRefDefNames(openApi, collectDomainRefDefNames(domainSchema));
  for (const defName of Object.keys(domainSchema.$defs)) {
    if (exportedTypes.has(defName)) continue;
    assert.ok(allowedSchemaOnlyDomainDefs.has(defName), `domain schema-only def ${defName} must be added to the allowlist`);
  }
  for (const defName of allowedSchemaOnlyDomainDefs) {
    assert.ok(domainSchema.$defs[defName], `allowed schema-only domain def ${defName} is missing`);
    assert.ok(referencedDefs.has(defName), `allowed schema-only domain def ${defName} must be referenced by schema or OpenAPI`);
  }
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
assertUniqueEnumValues(domainSchema, "domain schema", ["domainSchema"]);
assertUniqueEnumValues(openApi, "openapi", ["openapi"]);
assertExportedDomainTypesHaveSchemas();
assertDomainStringLiteralUnionsMatchSchemaEnums();
assertSchemaOnlyDomainDefsAreAllowed();

assertClosedObjectSchemas(domainSchema, "domain schema root");
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
  "Saec",
  "ImageAsset",
  "ImageJob",
  "AssetKind",
  "AssetSource",
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
  "StudioState",
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
  "tickJobs",
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
const errorResponseRef = "../schemas/domain.schema.json#/$defs/ErrorResponse";
const insufficientCreditsResponseRef = "../schemas/domain.schema.json#/$defs/InsufficientCreditsResponse";
const parameterLocations = new Set(["path", "query", "header", "cookie"]);
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
  ["deleteImageAsset:409", "../schemas/domain.schema.json#/$defs/AssetDeleteResult"],
  ["releaseWorkerLease:404", "../schemas/domain.schema.json#/$defs/WorkerLeaseReleaseResult"],
  ["releaseWorkerLease:409", "../schemas/domain.schema.json#/$defs/WorkerLeaseReleaseResult"],
  ["renewWorkerLease:404", "../schemas/domain.schema.json#/$defs/WorkerLeaseRenewResult"],
  ["renewWorkerLease:409", "../schemas/domain.schema.json#/$defs/WorkerLeaseRenewResult"],
  ["completeWorkerLease:404", "../schemas/domain.schema.json#/$defs/WorkerLeaseCompletionResult"],
  ["completeWorkerLease:409", "../schemas/domain.schema.json#/$defs/WorkerLeaseCompletionResult"],
  ["completeWorkerLease:422", "../schemas/domain.schema.json#/$defs/WorkerLeaseCompletionResult"],
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

for (const routeFile of routeFiles(appApiDir)) {
  const pathName = openApiPathForRouteFile(routeFile);
  const pathItem = openApi.paths[pathName];
  const routeMethods = exportedRouteMethods(routeFile);
  assert.ok(routeMethods.size > 0, `Next route ${routeFile} must export at least one HTTP method`);
  assert.ok(pathItem, `Next route ${routeFile} missing OpenAPI path ${pathName}`);
  for (const method of routeMethods) {
    assert.ok(pathItem?.[method], `Next route ${routeFile} ${method.toUpperCase()} missing OpenAPI operation for ${pathName}`);
  }
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
      const methodSource = routeMethodSource(routeSource, method);
      assert.ok(methodSource, `openapi path ${pathName} ${method.toUpperCase()} missing route method source in ${routeFile}`);
      const documentedResponseStatuses = new Set(Object.keys(operation.responses || {}));
      const documentedSuccessStatuses = new Set(Object.keys(operation.responses || {}).filter((code) => documentedJsonSuccessStatuses.has(code)));
      const implementedSuccessStatuses = routeSuccessStatuses(methodSource);
      for (const status of routeExplicitResponseStatuses(methodSource)) {
        assert.ok(
          documentedResponseStatuses.has(status),
          `route ${operation.operationId} returns explicit status ${status} but OpenAPI does not document it`
        );
      }
      for (const status of implementedSuccessStatuses) {
        assert.ok(
          documentedSuccessStatuses.has(status),
          `route ${operation.operationId} returns success status ${status} but OpenAPI does not document it`
        );
      }
      for (const status of documentedSuccessStatuses) {
        assert.ok(
          implementedSuccessStatuses.has(status),
          `openapi ${operation.operationId} documents success status ${status} but route does not return it`
        );
      }
      const operationParameters = operation.parameters || [];
      const operationParameterKeys = new Set<string>();
      const documentedPathParameters = new Set([...pathName.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]));
      const documentedBooleanQueryParameters = new Map<string, OpenApiParameter>();
      const implementedBooleanQueryParameters = routeBooleanQueryParams(methodSource);
      for (const parameter of operationParameters) {
        assert.ok(parameter.name, `openapi path ${pathName} ${method.toUpperCase()} parameter missing name`);
        assert.ok(parameter.in, `openapi path ${pathName} ${method.toUpperCase()} parameter ${parameter.name} missing location`);
        assert.ok(parameterLocations.has(parameter.in), `openapi path ${pathName} ${method.toUpperCase()} parameter ${parameter.name} has unsupported location ${parameter.in}`);
        assert.ok(parameter.schema, `openapi path ${pathName} ${method.toUpperCase()} parameter ${parameter.name} missing schema`);
        if (parameter.in === "path") {
          assert.ok(
            documentedPathParameters.has(parameter.name),
            `openapi path ${pathName} ${method.toUpperCase()} documents extra path parameter ${parameter.name}`
          );
        }
        if (parameter.in === "query" && parameter.schema.type === "boolean") {
          documentedBooleanQueryParameters.set(parameter.name, parameter);
        }
        const parameterKey = `${parameter.in}:${parameter.name}`;
        assert.ok(!operationParameterKeys.has(parameterKey), `openapi path ${pathName} ${method.toUpperCase()} has duplicate parameter ${parameterKey}`);
        operationParameterKeys.add(parameterKey);
      }
      for (const parameterName of implementedBooleanQueryParameters) {
        const parameter = documentedBooleanQueryParameters.get(parameterName);
        assert.ok(parameter, `route ${operation.operationId} reads boolean query parameter ${parameterName} but OpenAPI does not document it`);
        assert.equal(
          parameter.schema?.type,
          "boolean",
          `route ${operation.operationId} boolean query parameter ${parameterName} must be documented as boolean`
        );
      }
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
      const requestBody = operation.requestBody as { required?: unknown };
      const requestSchema = requestJsonSchema(operation);
      assert.equal(typeof requestBody.required, "boolean", `openapi path ${pathName} ${method.toUpperCase()} requestBody.required must be boolean`);
      assertOnlyJsonContent(requestBody, `openapi path ${pathName} ${method.toUpperCase()} requestBody`);
      assert.ok(operation.responses?.["400"], `openapi path ${pathName} ${method.toUpperCase()} requestBody missing 400 response`);
      assert.ok(routeSource.includes("readJsonObject("), `request body route ${operation.operationId} missing readJsonObject parser`);
      assert.ok(requestSchema, `openapi path ${pathName} ${method.toUpperCase()} requestBody missing application/json schema`);
      assertClosedObjectSchemas(requestSchema, `${operation.operationId || method.toUpperCase()} ${pathName}`);
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
    for (const parameter of operation.parameters || []) {
      if (parameter.in === "query" && parameter.schema?.type === "boolean") {
        assert.ok(implementedBooleanQueryParameters.has(parameter.name || ""), `boolean query route ${operation.operationId} missing booleanQueryParam guard`);
        assert.ok(operation.responses?.["400"], `boolean query route ${operation.operationId} missing 400 response`);
      }
    }
    if (operation.operationId && creditGuardedOperations.has(operation.operationId)) {
      assert.ok(routeSource.includes("creditReservationResponse("), `credit guarded operation ${operation.operationId} missing route credit handler`);
      assert.ok(operation.responses?.["402"], `credit guarded operation ${operation.operationId} missing 402 response`);
    }
    if (operation.operationId) {
      for (const [code, response] of Object.entries(operation.responses || {})) {
        assertOpenApiResponseDescription(response, `${operation.operationId} ${code}`);
        if (documentedJsonSuccessStatuses.has(code) || documentedJsonErrorStatuses.has(code)) {
          assertOnlyJsonContent(response, `${operation.operationId} ${code} response`);
          assert.ok(jsonSchema(response), `${operation.operationId} ${code} response must declare an application/json schema`);
        }
        assertClosedObjectSchemas(responseJsonSchema(response), `${operation.operationId || method.toUpperCase()} ${code} response`);
        const expectedRef = resultShapedErrorResponses.get(`${operation.operationId}:${code}`);
        if (expectedRef) {
          assert.equal(jsonSchemaRef(response), expectedRef, `${operation.operationId} ${code} must reference ${expectedRef}`);
        }
        if (documentedJsonErrorStatuses.has(code)) {
          const expectedErrorRef = expectedRef || (code === "402" ? insufficientCreditsResponseRef : errorResponseRef);
          assert.equal(jsonSchemaRef(response), expectedErrorRef, `${operation.operationId} ${code} error response must reference ${expectedErrorRef}`);
        }
      }
    }
    if (pathName.startsWith("/system/")) {
      assert.ok(operation.responses?.["401"], `system path ${pathName} ${method.toUpperCase()} missing 401 response`);
      assert.ok(operation.responses?.["503"], `system path ${pathName} ${method.toUpperCase()} missing 503 response`);
      assert.equal(
        jsonSchemaRef(operation.responses["401"]),
        errorResponseRef,
        `system path ${pathName} ${method.toUpperCase()} 401 must reference ErrorResponse`
      );
      assert.equal(
        jsonSchemaRef(operation.responses["503"]),
        errorResponseRef,
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
