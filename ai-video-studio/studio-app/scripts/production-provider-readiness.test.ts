import assert from "node:assert/strict";
import { getRuntimeReadiness } from "../src/server/readiness";

const managedEnvNames = ["CUTPILOT_RUNTIME_MODE", "RUNWAY_API_KEY", "LUMA_API_KEY", "GOOGLE_VERTEX_PROJECT"];

function restoreEnv(originalEnv: Map<string, string | undefined>) {
  for (const name of managedEnvNames) {
    const value = originalEnv.get(name);
    if (typeof value === "undefined") delete process.env[name];
    else process.env[name] = value;
  }
}

async function main() {
  const originalEnv = new Map(managedEnvNames.map((name) => [name, process.env[name]] as const));
  try {
    process.env.CUTPILOT_RUNTIME_MODE = "production";
    delete process.env.RUNWAY_API_KEY;
    delete process.env.LUMA_API_KEY;
    delete process.env.GOOGLE_VERTEX_PROJECT;
    const missingReadiness = getRuntimeReadiness();
    assert.ok(missingReadiness.missingEnv.includes("RUNWAY_API_KEY"), "production readiness should require RUNWAY_API_KEY");
    assert.ok(missingReadiness.missingEnv.includes("LUMA_API_KEY"), "production readiness should require LUMA_API_KEY");
    assert.ok(missingReadiness.missingEnv.includes("GOOGLE_VERTEX_PROJECT"), "production readiness should require GOOGLE_VERTEX_PROJECT");
    assert.ok(
      missingReadiness.checks.some((check) => check.id === "provider_execution" && check.status === "fail"),
      "missing production provider env should fail the provider execution check"
    );

    process.env.RUNWAY_API_KEY = "your_runway_key";
    process.env.LUMA_API_KEY = "luma_live_key_123456";
    process.env.GOOGLE_VERTEX_PROJECT = "x";
    const invalidReadiness = getRuntimeReadiness();
    assert.ok(invalidReadiness.invalidEnv.includes("RUNWAY_API_KEY"), "production readiness should report placeholder provider keys");
    assert.ok(invalidReadiness.invalidEnv.includes("GOOGLE_VERTEX_PROJECT"), "production readiness should report invalid Vertex project IDs");

    process.env.RUNWAY_API_KEY = "runway_live_key_123456";
    process.env.LUMA_API_KEY = "luma_live_key_123456";
    process.env.GOOGLE_VERTEX_PROJECT = "cutpilot-prod";
    const configuredReadiness = getRuntimeReadiness();
    const credentialsCheck = configuredReadiness.checks.find((check) => check.id === "provider_credentials");
    const executionCheck = configuredReadiness.checks.find((check) => check.id === "provider_execution");
    assert.equal(credentialsCheck?.status, "pass", "valid-shaped provider env should pass the credential check");
    assert.equal(executionCheck?.status, "fail", "production readiness should fail until live provider execution is implemented");
    assert.equal(configuredReadiness.invalidEnv.includes("RUNWAY_API_KEY"), false, "valid-shaped RUNWAY_API_KEY should not be invalid");
    assert.equal(configuredReadiness.invalidEnv.includes("LUMA_API_KEY"), false, "valid-shaped LUMA_API_KEY should not be invalid");
    assert.equal(configuredReadiness.invalidEnv.includes("GOOGLE_VERTEX_PROJECT"), false, "valid-shaped GOOGLE_VERTEX_PROJECT should not be invalid");

    delete process.env.CUTPILOT_RUNTIME_MODE;
    delete process.env.RUNWAY_API_KEY;
    delete process.env.LUMA_API_KEY;
    delete process.env.GOOGLE_VERTEX_PROJECT;
    const mockReadiness = getRuntimeReadiness();
    assert.ok(
      mockReadiness.checks.some((check) => check.id === "provider_execution" && check.status === "warn"),
      "mock readiness should warn about missing provider env without blocking preview"
    );
    assert.equal(mockReadiness.ready, true, "mock readiness should remain usable without provider env");
  } finally {
    restoreEnv(originalEnv);
  }

  console.log("production-provider-readiness.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
