import type { RuntimeReadiness } from "../domain/types";

const providerEnv = ["RUNWAY_API_KEY", "LUMA_API_KEY", "GOOGLE_VERTEX_PROJECT"];
const storageEnv = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"];
const queueEnv = ["CUTPILOT_QUEUE_URL"];
const adminEnv = ["CUTPILOT_ADMIN_TOKEN"];

function present(name: string) {
  return Boolean(process.env[name]);
}

function missing(names: string[]) {
  return names.filter((name) => !present(name));
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
  const missingEnv = [...missingProviderEnv, ...missingStorageEnv, ...missingQueueEnv, ...missingAdminEnv];
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
      missingProviderEnv.length ? (production ? "fail" : "warn") : "pass",
      missingProviderEnv.length
        ? `Missing provider env: ${missingProviderEnv.join(", ")}.`
        : "Provider credential env is present."
    ),
    check(
      "object_storage",
      "Object storage",
      missingStorageEnv.length ? (production ? "fail" : "warn") : "pass",
      missingStorageEnv.length
        ? `Missing storage env: ${missingStorageEnv.join(", ")}.`
        : "Object storage env is present."
    ),
    check(
      "queue_worker",
      "Queue worker",
      missingQueueEnv.length ? (production ? "fail" : "warn") : "pass",
      missingQueueEnv.length
        ? `Missing queue env: ${missingQueueEnv.join(", ")}.`
        : "Queue worker env is present."
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
      missingAdminEnv.length ? (production ? "fail" : "warn") : "pass",
      missingAdminEnv.length
        ? `Missing admin access env: ${missingAdminEnv.join(", ")}.`
        : "Admin access env is present."
    )
  ];

  return {
    mode,
    generatedAt: new Date().toISOString(),
    ready: production ? checks.every((item) => item.status !== "fail") : true,
    missingEnv,
    checks
  };
}
