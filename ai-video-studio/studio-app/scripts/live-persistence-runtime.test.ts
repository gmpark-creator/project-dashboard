import assert from "node:assert/strict";
import {
  closeLivePersistencePoolForTests,
  getLivePersistenceReadAdapter,
  LivePersistenceUnavailableError,
  liveProjectReadsEnabled
} from "../src/server/live-persistence-runtime";

const managedEnvNames = ["CUTPILOT_ENABLE_LIVE_READS", "DATABASE_URL", "DATABASE_SSL", "DATABASE_SSL_REJECT_UNAUTHORIZED"];

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
    delete process.env.DATABASE_URL;
    assert.equal(liveProjectReadsEnabled(), false, "live project reads should be disabled by default");
    assert.throws(
      () => getLivePersistenceReadAdapter(),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("disabled"),
      "live read adapter should fail closed when the switch is disabled"
    );

    process.env.CUTPILOT_ENABLE_LIVE_READS = "1";
    assert.equal(liveProjectReadsEnabled(), true, "live project reads should be enabled by an explicit switch");
    assert.throws(
      () => getLivePersistenceReadAdapter(),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("DATABASE_URL"),
      "live read adapter should require DATABASE_URL"
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
