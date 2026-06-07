import assert from "node:assert/strict";
import { GET as getMetrics } from "../app/api/system/metrics/route";
import { POST as createWorkerLease } from "../app/api/system/worker-leases/route";
import { POST as completeWorkerLease } from "../app/api/system/worker-leases/[leaseId]/complete/route";

function request(body?: unknown, headers?: Record<string, string>) {
  return new Request("http://cutpilot.local/api/system/test", {
    method: "POST",
    headers,
    body: typeof body === "undefined" ? undefined : JSON.stringify(body)
  });
}

function context<T extends Record<string, string>>(params: T) {
  return { params: Promise.resolve(params) };
}

async function json(response: Response) {
  return response.json() as Promise<{ code?: string }>;
}

async function main() {
  const originalRuntimeMode = process.env.CUTPILOT_RUNTIME_MODE;
  const originalAdminToken = process.env.CUTPILOT_ADMIN_TOKEN;
  try {
    process.env.CUTPILOT_RUNTIME_MODE = "production";
    delete process.env.CUTPILOT_ADMIN_TOKEN;

    const unconfigured = getMetrics(request());
    assert.equal(unconfigured.status, 503, "production system routes should fail closed when admin access is not configured");
    assert.equal((await json(unconfigured)).code, "ADMIN_TOKEN_NOT_CONFIGURED", "unconfigured system access should return the configured code");

    process.env.CUTPILOT_ADMIN_TOKEN = "test-admin-token";
    const missingAccess = getMetrics(request());
    assert.equal(missingAccess.status, 401, "production system routes should reject missing admin credentials");
    assert.equal((await json(missingAccess)).code, "ADMIN_ACCESS_REQUIRED", "missing system access should return the configured code");

    const acceptedAccess = await createWorkerLease(request({ workerId: 1 }, { "x-cutpilot-admin-token": "test-admin-token" }));
    assert.equal(acceptedAccess.status, 400, "authorized system routes should continue to route body validation");

    const pathDenied = await completeWorkerLease(request({ token: "lease-token", status: "succeeded" }), context({ leaseId: "bad_lease" }));
    assert.equal(pathDenied.status, 401, "system path routes should enforce admin access before path validation");
  } finally {
    if (typeof originalRuntimeMode === "undefined") delete process.env.CUTPILOT_RUNTIME_MODE;
    else process.env.CUTPILOT_RUNTIME_MODE = originalRuntimeMode;
    if (typeof originalAdminToken === "undefined") delete process.env.CUTPILOT_ADMIN_TOKEN;
    else process.env.CUTPILOT_ADMIN_TOKEN = originalAdminToken;
  }

  console.log("api-system-access.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
