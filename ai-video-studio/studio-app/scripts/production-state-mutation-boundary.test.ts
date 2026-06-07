import assert from "node:assert/strict";
import { POST as cancelJobRoute } from "../app/api/jobs/[jobId]/cancel/route";
import { PUT as setAudioRoute } from "../app/api/projects/[projectId]/audio/route";
import { POST as setDefaultRenderRoute } from "../app/api/projects/[projectId]/default-render/route";
import { POST as applyEditRoute } from "../app/api/projects/[projectId]/edits/route";
import { POST as registerExternalImageRoute } from "../app/api/projects/[projectId]/assets/route";
import { DELETE as deleteImageAssetRoute } from "../app/api/projects/[projectId]/assets/[assetId]/route";
import { PUT as updateStoryboardRoute } from "../app/api/projects/[projectId]/storyboard/route";
import { PATCH as updateShotDirectionRoute } from "../app/api/shots/[shotId]/direction/route";
import { POST as attachImageToShotRoute } from "../app/api/shots/[shotId]/references/route";
import { DELETE as detachImageFromShotRoute } from "../app/api/shots/[shotId]/references/[assetId]/route";
import { POST as selectTakeRoute } from "../app/api/shots/[shotId]/select-take/route";
import { getMockState, resetMockState } from "../src/server/mock-service";

const managedEnvNames = ["CUTPILOT_RUNTIME_MODE", "CUTPILOT_ENABLE_LIVE_WRITES", "DATABASE_URL"];

function request(method: string, body?: unknown, url = "http://cutpilot.local/api/test") {
  return new Request(url, {
    method,
    body: typeof body === "undefined" ? undefined : JSON.stringify(body),
    headers: typeof body === "undefined" ? undefined : { "content-type": "application/json" }
  });
}

function context<T extends Record<string, string>>(params: T) {
  return { params: Promise.resolve(params) };
}

function stateFingerprint() {
  const state = getMockState();
  return JSON.stringify({
    projects: state.projects.length,
    shots: state.shots.length,
    takes: state.takes.length,
    imageAssets: state.imageAssets.length,
    generationJobs: state.generationJobs.length,
    imageJobs: state.imageJobs.length,
    renderJobs: state.renderJobs.length,
    creditTransactions: state.creditTransactions.length
  });
}

async function assertUnavailable(label: string, response: Response) {
  const body = (await response.json()) as { code?: string };
  assert.equal(response.status, 503, `${label} should fail closed in production mode`);
  assert.equal(body.code, "MOCK_MUTATION_UNAVAILABLE", `${label} should return the stable mock mutation unavailable code`);
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
    const before = stateFingerprint();

    await assertUnavailable("job cancellation", await cancelJobRoute(request("POST"), context({ jobId: "gen_production" })));
    await assertUnavailable("shot direction update", await updateShotDirectionRoute(request("PATCH", { camera: "locked" }), context({ shotId: "sht_production" })));
    await assertUnavailable("storyboard update", await updateStoryboardRoute(request("PUT", { scenes: [], shots: [] }), context({ projectId: "prj_production" })));
    await assertUnavailable("take selection", await selectTakeRoute(request("POST", { takeId: "tak_selected" }), context({ shotId: "sht_production" })));
    await assertUnavailable(
      "asset registration",
      await registerExternalImageRoute(
        request("POST", { label: "Reference", url: "https://assets.cutpilot.local/reference.png", role: "product", aspect: "9:16", rightsConfirmed: true }),
        context({ projectId: "prj_production" })
      )
    );
    await assertUnavailable(
      "asset deletion",
      await deleteImageAssetRoute(request("DELETE", undefined, "http://cutpilot.local/api/projects/prj_production/assets/img_production?force=true"), context({ projectId: "prj_production", assetId: "img_production" }))
    );
    await assertUnavailable(
      "shot reference attach",
      await attachImageToShotRoute(request("POST", { assetId: "img_reference", mode: "first_frame" }), context({ shotId: "sht_production" }))
    );
    await assertUnavailable(
      "shot reference detach",
      await detachImageFromShotRoute(request("DELETE"), context({ shotId: "sht_production", assetId: "img_reference" }))
    );
    await assertUnavailable("edit command", await applyEditRoute(request("POST", { command: "trim opening" }), context({ projectId: "prj_production" })));
    await assertUnavailable("audio settings", await setAudioRoute(request("PUT", { transitions: "none" }), context({ projectId: "prj_production" })));
    await assertUnavailable("default render selection", await setDefaultRenderRoute(request("POST", { renderJobId: "rnd_default" }), context({ projectId: "prj_production" })));

    process.env.CUTPILOT_ENABLE_LIVE_WRITES = "1";
    const liveDirectionWithoutDb = await updateShotDirectionRoute(request("PATCH", { camera: "locked" }), context({ shotId: "sht_production" }));
    const liveDirectionWithoutDbBody = (await liveDirectionWithoutDb.json()) as { code?: string };
    assert.equal(liveDirectionWithoutDb.status, 503, "live shot direction update should fail closed without DATABASE_URL");
    assert.equal(liveDirectionWithoutDbBody.code, "LIVE_PERSISTENCE_UNAVAILABLE", "live shot direction update should report live persistence unavailability");

    const liveEditWithoutDb = await applyEditRoute(request("POST", { command: "trim opening" }), context({ projectId: "prj_production" }));
    const liveEditWithoutDbBody = (await liveEditWithoutDb.json()) as { code?: string };
    assert.equal(liveEditWithoutDb.status, 503, "live edit update should fail closed without DATABASE_URL");
    assert.equal(liveEditWithoutDbBody.code, "LIVE_PERSISTENCE_UNAVAILABLE", "live edit update should report live persistence unavailability");

    const liveAudioWithoutDb = await setAudioRoute(request("PUT", { transitions: "none" }), context({ projectId: "prj_production" }));
    const liveAudioWithoutDbBody = (await liveAudioWithoutDb.json()) as { code?: string };
    assert.equal(liveAudioWithoutDb.status, 503, "live audio update should fail closed without DATABASE_URL");
    assert.equal(liveAudioWithoutDbBody.code, "LIVE_PERSISTENCE_UNAVAILABLE", "live audio update should report live persistence unavailability");

    assert.equal(stateFingerprint(), before, "failed production state changes should not mutate mock state");
  } finally {
    restoreEnv(originalEnv);
    resetMockState();
  }

  console.log("production-state-mutation-boundary.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
