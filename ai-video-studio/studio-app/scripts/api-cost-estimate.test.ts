import assert from "node:assert/strict";
import { POST as estimateCostRoute } from "../app/api/cost/estimate/route";
import { resetMockState } from "../src/server/mock-service";

// /api/cost/estimate 라우트의 입력 검증과 프로덕션 fail-closed를 HTTP 레벨로 검증한다.
// (비용/정산 경계라 라우트 표면에서 직접 막는지 확인한다.)

function request(body: unknown) {
  return new Request("http://cutpilot.local/api/cost/estimate", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

const originalPersist = process.env.CUTPILOT_MOCK_PERSIST;
const originalLiveReads = process.env.CUTPILOT_ENABLE_LIVE_READS;
const originalRuntimeMode = process.env.CUTPILOT_RUNTIME_MODE;
process.env.CUTPILOT_MOCK_PERSIST = "0";
delete process.env.CUTPILOT_ENABLE_LIVE_READS;
delete process.env.CUTPILOT_RUNTIME_MODE;

function restore() {
  if (typeof originalPersist === "undefined") delete process.env.CUTPILOT_MOCK_PERSIST;
  else process.env.CUTPILOT_MOCK_PERSIST = originalPersist;
  if (typeof originalLiveReads === "undefined") delete process.env.CUTPILOT_ENABLE_LIVE_READS;
  else process.env.CUTPILOT_ENABLE_LIVE_READS = originalLiveReads;
  if (typeof originalRuntimeMode === "undefined") delete process.env.CUTPILOT_RUNTIME_MODE;
  else process.env.CUTPILOT_RUNTIME_MODE = originalRuntimeMode;
}

async function main() {
  resetMockState();

  // 정상 mock 견적 — 정책값과 일치.
  const ok = await estimateCostRoute(request({ action: "generateShot", params: { takeCount: 3 } }));
  assert.equal(ok.status, 200, "valid mock cost estimate returns 200");
  const okBody = (await ok.json()) as { credits: number; availableCredits: number };
  assert.equal(okBody.credits, 18, "generateShot 3 takes estimate = 18");
  assert.equal(typeof okBody.availableCredits, "number", "estimate exposes available credits");

  const all = await estimateCostRoute(request({ action: "generateAll", params: { shotCount: 10 } }));
  assert.equal(((await all.json()) as { credits: number }).credits, 180, "generateAll 10 shots estimate = 180");

  const render = await estimateCostRoute(request({ action: "startRender", params: { renderCount: 3 } }));
  assert.equal(((await render.json()) as { credits: number }).credits, 48, "startRender 3 renders estimate = 48");

  // 입력 검증 — 전부 400.
  assert.equal((await estimateCostRoute(request({ action: "nope" }))).status, 400, "invalid action returns 400");
  assert.equal((await estimateCostRoute(request({}))).status, 400, "missing action returns 400");
  assert.equal((await estimateCostRoute(request({ action: "generateShot", params: { takeCount: 0 } }))).status, 400, "non-positive count returns 400");
  assert.equal((await estimateCostRoute(request({ action: "generateShot", params: { takeCount: 1.5 } }))).status, 400, "non-integer count returns 400");
  assert.equal((await estimateCostRoute(request({ action: "generateShot", params: [] }))).status, 400, "non-object params returns 400");
  assert.equal((await estimateCostRoute(request({ action: "generateShot", projectId: 123 }))).status, 400, "non-string projectId returns 400");

  // 프로덕션 fail-closed: live reads ON + projectId 없음 -> 400 PROJECT_REQUIRED.
  process.env.CUTPILOT_ENABLE_LIVE_READS = "1";
  const liveNoPid = await estimateCostRoute(request({ action: "generateShot", params: { takeCount: 3 } }));
  assert.equal(liveNoPid.status, 400, "live estimate without projectId fails closed (400)");
  assert.equal(((await liveNoPid.json()) as { code: string }).code, "PROJECT_REQUIRED", "live estimate without projectId returns PROJECT_REQUIRED");
  delete process.env.CUTPILOT_ENABLE_LIVE_READS;

  // production runtime + live reads OFF -> 503 LIVE_PERSISTENCE_REQUIRED (mock 폴백 금지).
  process.env.CUTPILOT_RUNTIME_MODE = "production";
  const prodNoLive = await estimateCostRoute(request({ action: "generateShot", params: { takeCount: 3 } }));
  assert.equal(prodNoLive.status, 503, "production estimate without live persistence fails closed (503)");
  assert.equal(((await prodNoLive.json()) as { code: string }).code, "LIVE_PERSISTENCE_REQUIRED", "production estimate without live persistence returns LIVE_PERSISTENCE_REQUIRED");
  delete process.env.CUTPILOT_RUNTIME_MODE;

  restore();
  console.log("api-cost-estimate.test OK");
}

main().catch((error) => {
  restore();
  console.error(error);
  process.exit(1);
});
