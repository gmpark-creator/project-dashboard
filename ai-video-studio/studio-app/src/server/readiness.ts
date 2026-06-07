import type { RuntimeReadiness } from "../domain/types";
import { configuredObjectStorageProvider, isObjectStorageProvider } from "./object-storage";
import { configuredStoryDecomposerProvider, isStoryDecomposerProvider } from "./story-decomposer-config";

const providerEnv = ["RUNWAY_API_KEY", "LUMA_API_KEY", "GOOGLE_VERTEX_PROJECT"];
const persistenceEnv = ["DATABASE_URL"];
const storageEnv = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"];
const queueEnv = ["CUTPILOT_QUEUE_URL"];
const adminEnv = ["CUTPILOT_ADMIN_TOKEN"];
const decomposerProviderEnv = ["DECOMPOSER_PROVIDER"];

function value(name: string) {
  return process.env[name]?.trim() || "";
}

function present(name: string) {
  return value(name).length > 0;
}

function missing(names: string[]) {
  return names.filter((name) => !present(name));
}

function looksPlaceholder(input: string) {
  const normalized = input.toLowerCase();
  if (["changeme", "change-me", "placeholder", "dummy", "example", "mock", "test", "todo"].includes(normalized)) return true;
  return normalized.startsWith("your_") || normalized.startsWith("your-") || normalized.includes("changeme") || normalized.includes("placeholder");
}

function hasMinimumLength(input: string, length: number) {
  return input.length >= length && !looksPlaceholder(input);
}

function validProjectId(input: string) {
  return hasMinimumLength(input, 3) && /^[A-Za-z0-9][A-Za-z0-9._-]{1,126}[A-Za-z0-9]$/.test(input);
}

function validBucketName(input: string) {
  return hasMinimumLength(input, 3) && /^[A-Za-z0-9][A-Za-z0-9.-]{1,61}[A-Za-z0-9]$/.test(input);
}

function validQueueUrl(input: string) {
  try {
    const parsed = new URL(input);
    return ["https:", "http:", "amqp:", "amqps:", "redis:", "rediss:", "sqs:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function validDatabaseUrl(input: string) {
  try {
    const parsed = new URL(input);
    return ["postgres:", "postgresql:", "mysql:", "sqlserver:"].includes(parsed.protocol) && hasMinimumLength(input, 16);
  } catch {
    return false;
  }
}

function validEnvValue(name: string) {
  const current = value(name);
  if (!current) return false;
  if (name === "DATABASE_URL") return validDatabaseUrl(current);
  if (name === "GOOGLE_VERTEX_PROJECT") return validProjectId(current);
  if (name === "R2_BUCKET") return validBucketName(current);
  if (name === "CUTPILOT_QUEUE_URL") return validQueueUrl(current);
  if (name === "CUTPILOT_ADMIN_TOKEN") return hasMinimumLength(current, 16);
  if (name === "R2_SECRET_ACCESS_KEY") return hasMinimumLength(current, 12);
  return hasMinimumLength(current, 8);
}

function invalid(names: string[]) {
  return names.filter((name) => present(name) && !validEnvValue(name));
}

function decomposerCredentialEnv(provider: string) {
  if (provider === "openai") return ["OPENAI_API_KEY"];
  if (provider === "anthropic") return ["ANTHROPIC_API_KEY"];
  return [];
}

function envStatus(missingNames: string[], invalidNames: string[], production: boolean) {
  return missingNames.length || invalidNames.length ? (production ? "fail" : "warn") : "pass";
}

function envDetail(kind: string, missingNames: string[], invalidNames: string[], readyDetail: string) {
  const details: string[] = [];
  if (missingNames.length) details.push(`Missing ${kind} env: ${missingNames.join(", ")}`);
  if (invalidNames.length) details.push(`Invalid ${kind} env: ${invalidNames.join(", ")}`);
  return details.length ? `${details.join(". ")}.` : readyDetail;
}

function check(
  id: string,
  label: string,
  status: RuntimeReadiness["checks"][number]["status"],
  detail: string
): RuntimeReadiness["checks"][number] {
  return { id, label, status, detail };
}

export function getRuntimeReadiness(): RuntimeReadiness {
  const mode: RuntimeReadiness["mode"] = process.env.CUTPILOT_RUNTIME_MODE === "production" ? "production" : "mock";
  const missingProviderEnv = missing(providerEnv);
  const missingPersistenceEnv = missing(persistenceEnv);
  const missingStorageEnv = missing(storageEnv);
  const missingQueueEnv = missing(queueEnv);
  const missingAdminEnv = missing(adminEnv);
  const decomposerProvider = configuredStoryDecomposerProvider();
  const decomposerProviderMissingEnv = present("DECOMPOSER_PROVIDER") ? [] : decomposerProviderEnv;
  const decomposerProviderInvalidEnv = isStoryDecomposerProvider(decomposerProvider) ? [] : decomposerProviderEnv;
  const missingDecomposerCredentialEnv = isStoryDecomposerProvider(decomposerProvider) ? missing(decomposerCredentialEnv(decomposerProvider)) : [];
  const invalidProviderEnv = invalid(providerEnv);
  const invalidPersistenceEnv = invalid(persistenceEnv);
  const objectStorageProvider = configuredObjectStorageProvider();
  const invalidObjectStorageProviderEnv = isObjectStorageProvider(objectStorageProvider) ? [] : ["OBJECT_STORAGE_PROVIDER"];
  const invalidStorageEnv = [...invalid(storageEnv), ...invalidObjectStorageProviderEnv];
  const invalidQueueEnv = invalid(queueEnv);
  const invalidAdminEnv = invalid(adminEnv);
  const invalidDecomposerCredentialEnv = isStoryDecomposerProvider(decomposerProvider) ? invalid(decomposerCredentialEnv(decomposerProvider)) : [];
  const missingDecomposerEnv = [...decomposerProviderMissingEnv, ...missingDecomposerCredentialEnv];
  const invalidDecomposerEnv = [...decomposerProviderInvalidEnv, ...invalidDecomposerCredentialEnv];
  const missingEnv = [...missingProviderEnv, ...missingPersistenceEnv, ...missingStorageEnv, ...missingQueueEnv, ...missingAdminEnv, ...missingDecomposerEnv];
  const invalidEnv = [...invalidProviderEnv, ...invalidPersistenceEnv, ...invalidStorageEnv, ...invalidQueueEnv, ...invalidAdminEnv, ...invalidDecomposerEnv];
  const production = mode === "production";
  const liveDecomposerImplemented = false;
  const livePersistenceImplemented = false;
  const liveObjectStorageDeleteImplemented = false;
  const decomposerConfigured = isStoryDecomposerProvider(decomposerProvider) && decomposerProvider !== "mock";
  const decomposerStatus: RuntimeReadiness["checks"][number]["status"] =
    !isStoryDecomposerProvider(decomposerProvider) || missingDecomposerEnv.length || invalidDecomposerEnv.length
      ? production
        ? "fail"
        : "warn"
      : production && (!decomposerConfigured || !liveDecomposerImplemented)
        ? "fail"
        : "warn";
  const decomposerDetail =
    !isStoryDecomposerProvider(decomposerProvider)
      ? `Invalid story decomposer provider: ${decomposerProvider}.`
      : missingDecomposerEnv.length || invalidDecomposerEnv.length
        ? envDetail("story decomposer", missingDecomposerEnv, invalidDecomposerEnv, "Story decomposer env is present.")
        : production && decomposerProvider === "mock"
          ? "Production mode requires a live story decomposer provider."
          : production && !liveDecomposerImplemented
            ? "Live story decomposer adapter boundary is configured, but the live adapter implementation is not yet available."
            : "Mock story decomposer is active for local preview.";
  const storageBaseStatus = envStatus(missingStorageEnv, invalidStorageEnv, production);
  const objectStorageStatus: RuntimeReadiness["checks"][number]["status"] =
    storageBaseStatus !== "pass" ? storageBaseStatus : production && !liveObjectStorageDeleteImplemented ? "fail" : "pass";
  const objectStorageDetail =
    storageBaseStatus !== "pass"
      ? envDetail("storage", missingStorageEnv, invalidStorageEnv, "Object storage env is present and format-checked.")
      : production && !liveObjectStorageDeleteImplemented
        ? `Object storage provider ${objectStorageProvider} is configured, but live object deletion is not yet implemented.`
        : "Mock object storage is active for local cleanup.";
  const mockPersistenceDisabled = process.env.CUTPILOT_MOCK_PERSIST === "0";
  const mockPersistenceStatus: RuntimeReadiness["checks"][number]["status"] = production ? "pass" : mockPersistenceDisabled ? "warn" : "pass";
  const mockPersistenceDetail = production
    ? "File-backed mock state is disabled in production mode."
    : mockPersistenceDisabled
      ? "File-backed mock state is disabled."
      : "File-backed mock state is enabled by default.";
  const persistenceBaseStatus = envStatus(missingPersistenceEnv, invalidPersistenceEnv, production);
  const persistenceStatus: RuntimeReadiness["checks"][number]["status"] =
    persistenceBaseStatus !== "pass" ? persistenceBaseStatus : production && !livePersistenceImplemented ? "fail" : "pass";
  const persistenceDetail =
    persistenceBaseStatus !== "pass"
      ? envDetail("persistence", missingPersistenceEnv, invalidPersistenceEnv, "Persistence env is present and URL-shaped.")
      : production && !livePersistenceImplemented
        ? "Production persistence env is configured, but the live persistence adapter is not yet available."
        : "Mock in-memory persistence is active for local preview.";

  const checks: RuntimeReadiness["checks"] = [
    check(
      "runtime_mode",
      "Runtime mode",
      production ? "pass" : "warn",
      production ? "Production mode is requested." : "Running in mock mode; external providers are not required."
    ),
    check(
      "mock_persistence",
      "Mock persistence",
      mockPersistenceStatus,
      mockPersistenceDetail
    ),
    check("persistence", "Persistence", persistenceStatus, persistenceDetail),
    check(
      "provider_credentials",
      "Provider credentials",
      envStatus(missingProviderEnv, invalidProviderEnv, production),
      envDetail("provider", missingProviderEnv, invalidProviderEnv, "Provider credential env is present and format-checked.")
    ),
    check("story_decomposer", "Story decomposer", decomposerStatus, decomposerDetail),
    check(
      "object_storage",
      "Object storage",
      objectStorageStatus,
      objectStorageDetail
    ),
    check(
      "queue_worker",
      "Queue worker",
      envStatus(missingQueueEnv, invalidQueueEnv, production),
      envDetail("queue", missingQueueEnv, invalidQueueEnv, "Queue worker env is present and URL-shaped.")
    ),
    check(
      "worker_output_policy",
      "Worker output policy",
      production ? "pass" : "warn",
      production
        ? "Successful worker completions require output payloads."
        : "Mock mode allows successful worker completions without output payloads."
    ),
    check(
      "admin_access",
      "Admin access",
      envStatus(missingAdminEnv, invalidAdminEnv, production),
      envDetail("admin access", missingAdminEnv, invalidAdminEnv, "Admin access env is present and format-checked.")
    )
  ];

  return {
    mode,
    generatedAt: new Date().toISOString(),
    ready: production ? checks.every((item) => item.status !== "fail") : true,
    missingEnv,
    invalidEnv,
    checks
  };
}
