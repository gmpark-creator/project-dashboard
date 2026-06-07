import assert from "node:assert/strict";
import { getRuntimeReadiness } from "../src/server/readiness";

const managedEnvNames = ["CUTPILOT_RUNTIME_MODE", "DATABASE_URL"];

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
    delete process.env.DATABASE_URL;
    const missingReadiness = getRuntimeReadiness();
    assert.ok(missingReadiness.missingEnv.includes("DATABASE_URL"), "production readiness should require DATABASE_URL");
    assert.ok(
      missingReadiness.checks.some((check) => check.id === "persistence" && check.status === "fail"),
      "missing production persistence env should fail the persistence check"
    );

    process.env.DATABASE_URL = "not-a-database-url";
    const invalidReadiness = getRuntimeReadiness();
    assert.ok(invalidReadiness.invalidEnv.includes("DATABASE_URL"), "production readiness should report invalid DATABASE_URL");

    process.env.DATABASE_URL = "postgresql://cutpilot:secret@db.internal:5432/cutpilot";
    const configuredReadiness = getRuntimeReadiness();
    const persistenceCheck = configuredReadiness.checks.find((check) => check.id === "persistence");
    assert.equal(persistenceCheck?.status, "fail", "production readiness should fail until live persistence is implemented");
    assert.equal(configuredReadiness.invalidEnv.includes("DATABASE_URL"), false, "valid-shaped DATABASE_URL should not be invalid");
    assert.equal(configuredReadiness.missingEnv.includes("DATABASE_URL"), false, "valid-shaped DATABASE_URL should not be missing");

    delete process.env.CUTPILOT_RUNTIME_MODE;
    delete process.env.DATABASE_URL;
    const mockReadiness = getRuntimeReadiness();
    assert.ok(
      mockReadiness.checks.some((check) => check.id === "persistence" && check.status === "warn"),
      "mock readiness should warn about missing persistence env without blocking preview"
    );
    assert.equal(mockReadiness.ready, true, "mock readiness should remain usable without DATABASE_URL");
  } finally {
    restoreEnv(originalEnv);
  }

  console.log("production-persistence-readiness.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
