import assert from "node:assert/strict";
import {
  attachLiveImageToShot,
  applyLiveEdit,
  cancelLiveJob,
  closeLivePersistencePoolForTests,
  createLiveImageJob,
  createLiveProject,
  deleteLiveImageAsset,
  detachLiveImageFromShot,
  getLivePersistenceReadAdapter,
  LivePersistenceUnavailableError,
  liveProjectReadsEnabled,
  liveProjectWritesEnabled,
  registerLiveExternalImage,
  selectLiveTake,
  setLiveAudio,
  setLiveDefaultRender,
  updateLiveStoryboard,
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
    await assert.rejects(
      () => selectLiveTake("sht_disabled", "tak_disabled"),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("disabled"),
      "live take selection writes should fail closed when the switch is disabled"
    );
    await assert.rejects(
      () => updateLiveStoryboard("prj_disabled", { scenes: [], shots: [] }),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("disabled"),
      "live storyboard writes should fail closed when the switch is disabled"
    );
    await assert.rejects(
      () => applyLiveEdit("prj_disabled", "trim opening"),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("disabled"),
      "live edit writes should fail closed when the switch is disabled"
    );
    await assert.rejects(
      () => setLiveAudio("prj_disabled", { transitions: "none" }),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("disabled"),
      "live audio writes should fail closed when the switch is disabled"
    );
    await assert.rejects(
      () => setLiveDefaultRender("prj_disabled", "rnd_disabled"),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("disabled"),
      "live default render writes should fail closed when the switch is disabled"
    );
    await assert.rejects(
      () =>
        registerLiveExternalImage({
          projectId: "prj_disabled",
          label: "Disabled image",
          role: "product",
          url: "https://assets.cutpilot.local/disabled.png"
        }),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("disabled"),
      "live external image writes should fail closed when the switch is disabled"
    );
    await assert.rejects(
      () =>
        createLiveImageJob({
          projectId: "prj_disabled",
          prompt: "Disabled image",
          purpose: "product",
          role: "product",
          aspect: "9:16",
          count: 1
        }),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("disabled"),
      "live image job writes should fail closed when the switch is disabled"
    );
    await assert.rejects(
      () => attachLiveImageToShot("sht_disabled", { assetId: "img_disabled", mode: "first_frame" }),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("disabled"),
      "live reference attachment writes should fail closed when the switch is disabled"
    );
    await assert.rejects(
      () => detachLiveImageFromShot("sht_disabled", "img_disabled"),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("disabled"),
      "live reference detach writes should fail closed when the switch is disabled"
    );
    await assert.rejects(
      () => deleteLiveImageAsset("prj_disabled", "img_disabled"),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("disabled"),
      "live asset delete writes should fail closed when the switch is disabled"
    );
    await assert.rejects(
      () => cancelLiveJob("gen_disabled"),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("disabled"),
      "live job cancellation writes should fail closed when the switch is disabled"
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
    await assert.rejects(
      () => selectLiveTake("sht_missing_db", "tak_missing_db"),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("DATABASE_URL"),
      "live take selection writes should require DATABASE_URL"
    );
    await assert.rejects(
      () => updateLiveStoryboard("prj_missing_db", { scenes: [], shots: [] }),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("DATABASE_URL"),
      "live storyboard writes should require DATABASE_URL"
    );
    await assert.rejects(
      () => applyLiveEdit("prj_missing_db", "trim opening"),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("DATABASE_URL"),
      "live edit writes should require DATABASE_URL"
    );
    await assert.rejects(
      () => setLiveAudio("prj_missing_db", { transitions: "none" }),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("DATABASE_URL"),
      "live audio writes should require DATABASE_URL"
    );
    await assert.rejects(
      () => setLiveDefaultRender("prj_missing_db", "rnd_missing_db"),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("DATABASE_URL"),
      "live default render writes should require DATABASE_URL"
    );
    await assert.rejects(
      () =>
        registerLiveExternalImage({
          projectId: "prj_missing_db",
          label: "Missing DB image",
          role: "product",
          url: "https://assets.cutpilot.local/missing-db.png"
        }),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("DATABASE_URL"),
      "live external image writes should require DATABASE_URL"
    );
    await assert.rejects(
      () =>
        createLiveImageJob({
          projectId: "prj_missing_db",
          prompt: "Missing DB image",
          purpose: "product",
          role: "product",
          aspect: "9:16",
          count: 1
        }),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("DATABASE_URL"),
      "live image job writes should require DATABASE_URL"
    );
    await assert.rejects(
      () => attachLiveImageToShot("sht_missing_db", { assetId: "img_missing_db", mode: "first_frame" }),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("DATABASE_URL"),
      "live reference attachment writes should require DATABASE_URL"
    );
    await assert.rejects(
      () => detachLiveImageFromShot("sht_missing_db", "img_missing_db"),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("DATABASE_URL"),
      "live reference detach writes should require DATABASE_URL"
    );
    await assert.rejects(
      () => deleteLiveImageAsset("prj_missing_db", "img_missing_db"),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("DATABASE_URL"),
      "live asset delete writes should require DATABASE_URL"
    );
    await assert.rejects(
      () => cancelLiveJob("gen_missing_db"),
      (error) => error instanceof LivePersistenceUnavailableError && error.message.includes("DATABASE_URL"),
      "live job cancellation writes should require DATABASE_URL"
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
