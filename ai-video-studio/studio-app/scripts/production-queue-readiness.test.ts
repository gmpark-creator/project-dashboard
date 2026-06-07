import assert from "node:assert/strict";
import { getRuntimeReadiness } from "../src/server/readiness";

const managedEnvNames = ["CUTPILOT_RUNTIME_MODE", "CUTPILOT_QUEUE_URL"];

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
    delete process.env.CUTPILOT_QUEUE_URL;
    const missingReadiness = getRuntimeReadiness();
    assert.ok(missingReadiness.missingEnv.includes("CUTPILOT_QUEUE_URL"), "production readiness should require CUTPILOT_QUEUE_URL");
    assert.ok(
      missingReadiness.checks.some((check) => check.id === "queue_worker" && check.status === "fail"),
      "missing production queue env should fail the queue worker check"
    );

    process.env.CUTPILOT_QUEUE_URL = "not-a-url";
    const invalidReadiness = getRuntimeReadiness();
    assert.ok(invalidReadiness.invalidEnv.includes("CUTPILOT_QUEUE_URL"), "production readiness should report invalid queue URL");

    process.env.CUTPILOT_QUEUE_URL = "https://queue.cutpilot.local/workers";
    const configuredReadiness = getRuntimeReadiness();
    const queueCheck = configuredReadiness.checks.find((check) => check.id === "queue_worker");
    assert.equal(queueCheck?.status, "fail", "production readiness should fail until live queue worker is implemented");
    assert.equal(configuredReadiness.invalidEnv.includes("CUTPILOT_QUEUE_URL"), false, "valid-shaped queue URL should not be invalid");
    assert.equal(configuredReadiness.missingEnv.includes("CUTPILOT_QUEUE_URL"), false, "valid-shaped queue URL should not be missing");

    delete process.env.CUTPILOT_RUNTIME_MODE;
    delete process.env.CUTPILOT_QUEUE_URL;
    const mockReadiness = getRuntimeReadiness();
    assert.ok(
      mockReadiness.checks.some((check) => check.id === "queue_worker" && check.status === "warn"),
      "mock readiness should warn about missing queue env without blocking preview"
    );
    assert.equal(mockReadiness.ready, true, "mock readiness should remain usable without CUTPILOT_QUEUE_URL");
  } finally {
    restoreEnv(originalEnv);
  }

  console.log("production-queue-readiness.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
