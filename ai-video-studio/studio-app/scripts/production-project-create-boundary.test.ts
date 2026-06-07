import assert from "node:assert/strict";
import { POST as createProjectRoute } from "../app/api/projects/route";
import { listProjects, resetMockState } from "../src/server/mock-service";

const managedEnvNames = ["CUTPILOT_RUNTIME_MODE", "CUTPILOT_ENABLE_LIVE_WRITES", "DATABASE_URL"];

function request(body: unknown) {
  return new Request("http://cutpilot.local/api/projects", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" }
  });
}

function restoreEnv(originalEnv: Map<string, string | undefined>) {
  for (const name of managedEnvNames) {
    const value = originalEnv.get(name);
    if (typeof value === "undefined") delete process.env[name];
    else process.env[name] = value;
  }
}

async function main() {
  const originalEnv = new Map(managedEnvNames.map((name) => [name, process.env[name]] as const));
  resetMockState();
  try {
    process.env.CUTPILOT_RUNTIME_MODE = "production";
    delete process.env.CUTPILOT_ENABLE_LIVE_WRITES;
    delete process.env.DATABASE_URL;
    const beforeCount = listProjects().length;
    const response = await createProjectRoute(request({ idea: "A production project should not mutate mock state", intent: "product_ad" }));
    const body = (await response.json()) as { code?: string };

    assert.equal(response.status, 503, "production project creation should fail closed while persistence is mock-backed");
    assert.equal(body.code, "MOCK_MUTATION_UNAVAILABLE", "production project creation should return a stable unavailable code");
    assert.equal(listProjects().length, beforeCount, "failed production project creation should not mutate mock project state");

    process.env.CUTPILOT_ENABLE_LIVE_WRITES = "1";
    const liveWithoutDbResponse = await createProjectRoute(request({ idea: "A live write without DB should fail closed", intent: "product_ad" }));
    const liveWithoutDbBody = (await liveWithoutDbResponse.json()) as { code?: string };
    assert.equal(liveWithoutDbResponse.status, 503, "live project creation should fail closed without DATABASE_URL");
    assert.equal(liveWithoutDbBody.code, "LIVE_PERSISTENCE_UNAVAILABLE", "live project creation should report live persistence unavailability");
    assert.equal(listProjects().length, beforeCount, "failed live project creation should not mutate mock project state");

    delete process.env.CUTPILOT_RUNTIME_MODE;
    delete process.env.CUTPILOT_ENABLE_LIVE_WRITES;
    const mockResponse = await createProjectRoute(request({ idea: "A mock project should still be creatable", intent: "product_ad" }));
    assert.equal(mockResponse.status, 201, "mock mode project creation should remain available");
    assert.equal(listProjects().length, beforeCount + 1, "mock mode project creation should mutate local mock state");
  } finally {
    restoreEnv(originalEnv);
    resetMockState();
  }

  console.log("production-project-create-boundary.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
