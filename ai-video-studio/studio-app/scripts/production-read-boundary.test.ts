import assert from "node:assert/strict";
import { GET as getJobRoute } from "../app/api/jobs/[jobId]/route";
import { GET as listProjectsRoute } from "../app/api/projects/route";
import { GET as getProjectRoute } from "../app/api/projects/[projectId]/route";
import { GET as listAssetsRoute } from "../app/api/projects/[projectId]/assets/route";
import { POST as previewRenderRoute } from "../app/api/projects/[projectId]/render-preview/route";
import { GET as queueRoute } from "../app/api/system/queue/route";
import { GET as workerDispatchRoute } from "../app/api/system/worker-dispatch/route";
import { GET as workerCompletionsRoute } from "../app/api/system/worker-completions/route";
import { GET as workerLeasesRoute } from "../app/api/system/worker-leases/route";
import { GET as workerRetriesRoute } from "../app/api/system/worker-retries/route";
import { getMockState, resetMockState } from "../src/server/mock-service";

const managedEnvNames = ["CUTPILOT_RUNTIME_MODE", "CUTPILOT_ENABLE_LIVE_READS", "DATABASE_URL", "CUTPILOT_ADMIN_TOKEN"];

function request(method: string, body?: unknown) {
  return new Request("http://cutpilot.local/api/test", {
    method,
    body: typeof body === "undefined" ? undefined : JSON.stringify(body),
    headers: typeof body === "undefined" ? undefined : { "content-type": "application/json" }
  });
}

function context<T extends Record<string, string>>(params: T) {
  return { params: Promise.resolve(params) };
}

function systemRequest() {
  return new Request("http://cutpilot.local/api/system/queue", {
    headers: { authorization: "Bearer test-admin-token" }
  });
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
    renderJobs: state.renderJobs.length
  });
}

async function assertUnavailable(label: string, response: Response) {
  const body = (await response.json()) as { code?: string };
  assert.equal(response.status, 503, `${label} should fail closed in production mode`);
  assert.equal(body.code, "MOCK_READ_UNAVAILABLE", `${label} should return the stable mock read unavailable code`);
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
    process.env.CUTPILOT_ADMIN_TOKEN = "test-admin-token";
    delete process.env.CUTPILOT_ENABLE_LIVE_READS;
    delete process.env.DATABASE_URL;
    const before = stateFingerprint();

    await assertUnavailable("project list", await listProjectsRoute());
    await assertUnavailable("project bundle", await getProjectRoute(request("GET"), context({ projectId: "prj_production" })));
    await assertUnavailable("job read", await getJobRoute(request("GET"), context({ jobId: "gen_production" })));
    await assertUnavailable("asset list", await listAssetsRoute(request("GET"), context({ projectId: "prj_production" })));
    await assertUnavailable("system queue", await queueRoute(systemRequest()));
    await assertUnavailable("worker dispatch", await workerDispatchRoute(systemRequest()));
    await assertUnavailable("worker leases", await workerLeasesRoute(systemRequest()));
    await assertUnavailable("worker completions", await workerCompletionsRoute(systemRequest()));
    await assertUnavailable("worker retries", await workerRetriesRoute(systemRequest()));
    await assertUnavailable(
      "render preview",
      await previewRenderRoute(
        request("POST", { spec: { resolution: "720p", cut: "6s", aspect: "9:16", caption: "none" } }),
        context({ projectId: "prj_production" })
      )
    );

    assert.equal(stateFingerprint(), before, "failed production reads should not advance or mutate mock state");

    process.env.CUTPILOT_ENABLE_LIVE_READS = "1";
    const liveReadWithoutDb = await listProjectsRoute();
    const liveReadBody = (await liveReadWithoutDb.json()) as { code?: string };
    assert.equal(liveReadWithoutDb.status, 503, "live project reads should fail closed without DATABASE_URL");
    assert.equal(liveReadBody.code, "LIVE_PERSISTENCE_UNAVAILABLE", "live project reads should expose live persistence unavailability");
    const liveAssetReadWithoutDb = await listAssetsRoute(request("GET"), context({ projectId: "prj_production" }));
    const liveAssetReadBody = (await liveAssetReadWithoutDb.json()) as { code?: string };
    assert.equal(liveAssetReadWithoutDb.status, 503, "live asset reads should fail closed without DATABASE_URL");
    assert.equal(liveAssetReadBody.code, "LIVE_PERSISTENCE_UNAVAILABLE", "live asset reads should expose live persistence unavailability");
    const liveJobReadWithoutDb = await getJobRoute(request("GET"), context({ jobId: "gen_production" }));
    const liveJobReadBody = (await liveJobReadWithoutDb.json()) as { code?: string };
    assert.equal(liveJobReadWithoutDb.status, 503, "live job reads should fail closed without DATABASE_URL");
    assert.equal(liveJobReadBody.code, "LIVE_PERSISTENCE_UNAVAILABLE", "live job reads should expose live persistence unavailability");
    const liveRenderPreviewWithoutDb = await previewRenderRoute(
      request("POST", { spec: { resolution: "720p", cut: "6s", aspect: "9:16", caption: "none" } }),
      context({ projectId: "prj_production" })
    );
    const liveRenderPreviewBody = (await liveRenderPreviewWithoutDb.json()) as { code?: string };
    assert.equal(liveRenderPreviewWithoutDb.status, 503, "live render preview should fail closed without DATABASE_URL");
    assert.equal(liveRenderPreviewBody.code, "LIVE_PERSISTENCE_UNAVAILABLE", "live render preview should expose live persistence unavailability");
    const liveQueueWithoutDb = await queueRoute(systemRequest());
    const liveQueueBody = (await liveQueueWithoutDb.json()) as { code?: string };
    assert.equal(liveQueueWithoutDb.status, 503, "live queue snapshot should fail closed without DATABASE_URL");
    assert.equal(liveQueueBody.code, "LIVE_PERSISTENCE_UNAVAILABLE", "live queue snapshot should expose live persistence unavailability");
    const liveWorkerDispatchWithoutDb = await workerDispatchRoute(systemRequest());
    const liveWorkerDispatchBody = (await liveWorkerDispatchWithoutDb.json()) as { code?: string };
    assert.equal(liveWorkerDispatchWithoutDb.status, 503, "live worker dispatch should fail closed without DATABASE_URL");
    assert.equal(liveWorkerDispatchBody.code, "LIVE_PERSISTENCE_UNAVAILABLE", "live worker dispatch should expose live persistence unavailability");
    const liveWorkerLeasesWithoutDb = await workerLeasesRoute(systemRequest());
    const liveWorkerLeasesBody = (await liveWorkerLeasesWithoutDb.json()) as { code?: string };
    assert.equal(liveWorkerLeasesWithoutDb.status, 503, "live worker lease snapshot should fail closed without DATABASE_URL");
    assert.equal(liveWorkerLeasesBody.code, "LIVE_PERSISTENCE_UNAVAILABLE", "live worker lease snapshot should expose live persistence unavailability");
    const liveWorkerCompletionsWithoutDb = await workerCompletionsRoute(systemRequest());
    const liveWorkerCompletionsBody = (await liveWorkerCompletionsWithoutDb.json()) as { code?: string };
    assert.equal(liveWorkerCompletionsWithoutDb.status, 503, "live worker completion snapshot should fail closed without DATABASE_URL");
    assert.equal(liveWorkerCompletionsBody.code, "LIVE_PERSISTENCE_UNAVAILABLE", "live worker completion snapshot should expose live persistence unavailability");
    const liveWorkerRetriesWithoutDb = await workerRetriesRoute(systemRequest());
    const liveWorkerRetriesBody = (await liveWorkerRetriesWithoutDb.json()) as { code?: string };
    assert.equal(liveWorkerRetriesWithoutDb.status, 503, "live worker retry plan should fail closed without DATABASE_URL");
    assert.equal(liveWorkerRetriesBody.code, "LIVE_PERSISTENCE_UNAVAILABLE", "live worker retry plan should expose live persistence unavailability");
    assert.equal(stateFingerprint(), before, "failed live production reads should not mutate mock state");
  } finally {
    restoreEnv(originalEnv);
    resetMockState();
  }

  console.log("production-read-boundary.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
