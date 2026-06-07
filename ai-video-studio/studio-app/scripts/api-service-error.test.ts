import assert from "node:assert/strict";
import { POST as generateAll } from "../app/api/projects/[projectId]/generate-all/route";
import { GET as listAssets } from "../app/api/projects/[projectId]/assets/route";
import { POST as setDefaultRender } from "../app/api/projects/[projectId]/default-render/route";
import { POST as startRender } from "../app/api/projects/[projectId]/renders/route";
import { POST as selectTake } from "../app/api/shots/[shotId]/select-take/route";
import { PATCH as updateShotDirection } from "../app/api/shots/[shotId]/direction/route";
import { createProject, resetMockState } from "../src/server/mock-service";

function request(method: string, body?: unknown) {
  return new Request("http://cutpilot.local/api/test", {
    method,
    body: typeof body === "undefined" ? undefined : JSON.stringify(body)
  });
}

function context<T extends Record<string, string>>(params: T) {
  return { params: Promise.resolve(params) };
}

async function json(response: Response) {
  return response.json() as Promise<{ code?: string }>;
}

process.env.CUTPILOT_MOCK_PERSIST = "0";

async function main() {
  resetMockState();

  const missingProjectGenerate = await generateAll(request("POST", { tier: "fast" }), context({ projectId: "prj_missing" }));
  assert.equal(missingProjectGenerate.status, 404, "generate-all should normalize missing projects to 404");
  assert.equal((await json(missingProjectGenerate)).code, "NOT_FOUND", "missing project generation should return NOT_FOUND");

  const missingProjectAssets = await listAssets(request("GET"), context({ projectId: "prj_missing" }));
  assert.equal(missingProjectAssets.status, 404, "asset listing should normalize missing projects to 404");

  const missingShotDirection = await updateShotDirection(request("PATCH", { camera: "locked" }), context({ shotId: "sht_missing" }));
  assert.equal(missingShotDirection.status, 404, "shot direction should normalize missing shots to 404");

  const missingTakeSelection = await selectTake(request("POST", { takeId: "tak_missing" }), context({ shotId: "sht_missing" }));
  assert.equal(missingTakeSelection.status, 404, "take selection should normalize missing or unselectable takes to 404");

  const project = createProject({ idea: "Launch a compact product teaser", intent: "product_ad" });
  const renderSpec = { resolution: "1080p", aspect: project.aspect, cut: "15s", caption: "burn-in" };
  const firstRender = await startRender(request("POST", { specs: [renderSpec] }), context({ projectId: project.id }));
  assert.equal(firstRender.status, 202, "first render request should queue work");
  const duplicateRender = await startRender(request("POST", { specs: [renderSpec] }), context({ projectId: project.id }));
  assert.equal(duplicateRender.status, 409, "duplicate active render requests should normalize to 409");
  assert.equal((await json(duplicateRender)).code, "CONFLICT", "duplicate renders should return CONFLICT");

  const renderPayload = (await firstRender.json()) as { jobs: Array<{ id: string }> };
  const unfinishedDefault = await setDefaultRender(request("POST", { renderJobId: renderPayload.jobs[0].id }), context({ projectId: project.id }));
  assert.equal(unfinishedDefault.status, 409, "unfinished renders should not become the default version");

  console.log("api-service-error.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
