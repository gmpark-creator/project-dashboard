import assert from "node:assert/strict";
import { POST as createImageJobRoute } from "../app/api/projects/[projectId]/image-jobs/route";
import { POST as generateAllRoute } from "../app/api/projects/[projectId]/generate-all/route";
import { POST as startRenderRoute } from "../app/api/projects/[projectId]/renders/route";
import { POST as generateShotRoute } from "../app/api/shots/[shotId]/generate/route";
import { POST as regenerateShotRoute } from "../app/api/shots/[shotId]/regenerate/route";
import { POST as upgradeTakeRoute } from "../app/api/takes/[takeId]/upgrade/route";
import { getMockState, resetMockState } from "../src/server/mock-service";

const managedEnvNames = ["CUTPILOT_RUNTIME_MODE", "CUTPILOT_ENABLE_LIVE_WRITES", "DATABASE_URL"];

function request(body: unknown) {
  return new Request("http://cutpilot.local/api/test", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" }
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

async function assertLivePersistenceUnavailable(label: string, response: Response) {
  const body = (await response.json()) as { code?: string };
  assert.equal(response.status, 503, `${label} should fail closed when live persistence is unavailable`);
  assert.equal(body.code, "LIVE_PERSISTENCE_UNAVAILABLE", `${label} should return the stable live persistence unavailable code`);
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
    const before = stateFingerprint();

    await assertUnavailable("generate-all", await generateAllRoute(request({ tier: "fast" }), context({ projectId: "prj_production" })));
    await assertUnavailable("shot generation", await generateShotRoute(request({ tier: "fast", takeCount: 1 }), context({ shotId: "sht_production" })));
    await assertUnavailable(
      "shot regeneration",
      await regenerateShotRoute(request({ scope: "shot", tweaks: "tighten the motion" }), context({ shotId: "sht_production" }))
    );
    await assertUnavailable("take upgrade", await upgradeTakeRoute(request({ mode: "auto" }), context({ takeId: "tak_production" })));
    await assertUnavailable(
      "image generation",
      await createImageJobRoute(
        request({ prompt: "clean product shot", purpose: "product", role: "product", aspect: "9:16", count: 1 }),
        context({ projectId: "prj_production" })
      )
    );
    await assertUnavailable(
      "render start",
      await startRenderRoute(
        request({ specs: [{ resolution: "720p", cut: "6s", aspect: "9:16", caption: "none" }] }),
        context({ projectId: "prj_production" })
      )
    );

    process.env.CUTPILOT_ENABLE_LIVE_WRITES = "1";
    delete process.env.DATABASE_URL;
    await assertLivePersistenceUnavailable(
      "live image generation",
      await createImageJobRoute(
        request({ prompt: "clean product shot", purpose: "product", role: "product", aspect: "9:16", count: 1 }),
        context({ projectId: "prj_production" })
      )
    );
    await assertLivePersistenceUnavailable(
      "live shot generation",
      await generateShotRoute(request({ tier: "fast", takeCount: 1 }), context({ shotId: "sht_production" }))
    );

    assert.equal(stateFingerprint(), before, "failed production work requests should not mutate mock state");
  } finally {
    restoreEnv(originalEnv);
    resetMockState();
  }

  console.log("production-work-request-boundary.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
