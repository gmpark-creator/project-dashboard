import type { RuntimeReadiness } from "../domain/types";

const providerEnv = ["RUNWAY_API_KEY", "LUMA_API_KEY", "GOOGLE_VERTEX_PROJECT"];
const storageEnv = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"];
const queueEnv = ["CUTPILOT_QUEUE_URL"];
const adminEnv = ["CUTPILOT_ADMIN_TOKEN"];

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

function validEnvValue(name: string) {
  const current = value(name);
  if (!current) return false;
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
  const missingStorageEnv = missing(storageEnv);
  const missingQueueEnv = missing(queueEnv);
  const missingAdminEnv = missing(adminEnv);
  const invalidProviderEnv = invalid(providerEnv);
  const invalidStorageEnv = invalid(storageEnv);
  const invalidQueueEnv = invalid(queueEnv);
  const invalidAdminEnv = invalid(adminEnv);
  const missingEnv = [...missingProviderEnv, ...missingStorageEnv, ...missingQueueEnv, ...missingAdminEnv];
  const invalidEnv = [...invalidProviderEnv, ...invalidStorageEnv, ...invalidQueueEnv, ...invalidAdminEnv];
  const production = mode === "production";

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
      process.env.CUTPILOT_MOCK_PERSIST === "0" ? "warn" : "pass",
      process.env.CUTPILOT_MOCK_PERSIST === "0" ? "File-backed mock state is disabled." : "File-backed mock state is enabled by default."
    ),
    check(
      "provider_credentials",
      "Provider credentials",
      envStatus(missingProviderEnv, invalidProviderEnv, production),
      envDetail("provider", missingProviderEnv, invalidProviderEnv, "Provider credential env is present and format-checked.")
    ),
    check(
      "object_storage",
      "Object storage",
      envStatus(missingStorageEnv, invalidStorageEnv, production),
      envDetail("storage", missingStorageEnv, invalidStorageEnv, "Object storage env is present and format-checked.")
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
