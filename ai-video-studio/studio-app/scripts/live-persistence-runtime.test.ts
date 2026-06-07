import assert from "node:assert/strict";
import {
  closeLivePersistencePoolForTests,
  createLiveProject,
  getLivePersistenceReadAdapter,
  LivePersistenceUnavailableError,
  liveProjectReadsEnabled,
  liveProjectWritesEnabled,
  updateLiveShotDirection
} from "../src/server/live-persistence-runtime";

const managedEnvNames = ["CUTPILOT_ENABLE_LIVE_READS", "CUTPILOT_ENABLE_LIVE_WRITES", "DATABASE_URL", "DATABASE_SSL", "DATABASE_SSL_REJECT_UNAUTHORIZED"];

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
    delete process.env.CUTPILOT_ENABLE_LIVE_READS;
    delete process.env.CUTPILOT_ENABLE_LIVE_WRITES;
    delete process.env.DATABASE_URL;
    assert.equal(liveProjectReadsEnabled(), false, "live project reads should be disabled by default");
    assert.equal(liveProjectWritesEnabled(), false, "live project writes should be disabled by default");
    assert.throws(
      () => getLivePersistenceReadAdapter(),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("disabled"),
      "live read adapter should fail closed when the switch is disabled"
    );
    await assert.rejects(
      () => createLiveProject({ idea: "Disabled live write", intent: "product_ad" }),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("disabled"),
      "live project writes should fail closed when the switch is disabled"
    );
    await assert.rejects(
      () => updateLiveShotDirection("sht_disabled", { camera: "locked" }),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("disabled"),
      "live shot direction writes should fail closed when the switch is disabled"
    );

    process.env.CUTPILOT_ENABLE_LIVE_READS = "1";
    assert.equal(liveProjectReadsEnabled(), true, "live project reads should be enabled by an explicit switch");
    assert.throws(
      () => getLivePersistenceReadAdapter(),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("DATABASE_URL"),
      "live read adapter should require DATABASE_URL"
    );
    process.env.CUTPILOT_ENABLE_LIVE_WRITES = "1";
    assert.equal(liveProjectWritesEnabled(), true, "live project writes should be enabled by an explicit switch");
    await assert.rejects(
      () => createLiveProject({ idea: "Missing DB live write", intent: "product_ad" }),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("DATABASE_URL"),
      "live project writes should require DATABASE_URL"
    );
    await assert.rejects(
      () => updateLiveShotDirection("sht_missing_db", { camera: "locked" }),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("DATABASE_URL"),
      "live shot direction writes should require DATABASE_URL"
    );

    process.env.DATABASE_URL = "postgresql://cutpilot:secret@db.internal:5432/cutpilot";
    const adapter = getLivePersistenceReadAdapter();
    assert.equal(typeof adapter.listProjects, "function", "runtime should return a Postgres read adapter when configured");
  } finally {
    await closeLivePersistencePoolForTests();
    restoreEnv(originalEnv);
  }

  console.log("live-persistence-runtime.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
