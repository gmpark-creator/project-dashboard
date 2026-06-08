import assert from "node:assert/strict";
import { COST_ACTIONS, creditCostForAction } from "../src/domain/cost-policy";
import {
  createImageJob,
  createProject,
  estimateCost,
  generateAll,
  generateShot,
  getMutableMockState,
  getProjectBundle,
  resetMockState,
  startRender
} from "../src/server/mock-service";
import { CostEstimateError, resolveCostEstimate } from "../src/server/cost-estimate";

// 비용/크레딧 단일 출처(cost-policy)가 estimate·실제 mock reservation과 일치하는지, 그리고 프로덕션
// 비용 견적이 fail-closed 되는지 검증한다. 이 테스트가 깨지면 estimate==reservation 불변식이 무너진 것이다.

const originalPersist = process.env.CUTPILOT_MOCK_PERSIST;
const originalLiveReads = process.env.CUTPILOT_ENABLE_LIVE_READS;
const originalRuntimeMode = process.env.CUTPILOT_RUNTIME_MODE;
process.env.CUTPILOT_MOCK_PERSIST = "0";
delete process.env.CUTPILOT_ENABLE_LIVE_READS;
delete process.env.CUTPILOT_RUNTIME_MODE;

function reservedDelta(fn: () => void): number {
  const before = getMutableMockState().credits.reserved;
  fn();
  const after = getMutableMockState().credits.reserved;
  return after - before;
}

function freshProject(title: string) {
  const project = createProject({ title, idea: "A short product launch teaser used for cost invariants", intent: "product_ad" });
  const bundle = getProjectBundle(project.id);
  assert.ok(bundle && bundle.shots.length > 0, "fresh project should have storyboard shots");
  return { project, bundle: bundle! };
}

function restoreEnv() {
  if (typeof originalPersist === "undefined") delete process.env.CUTPILOT_MOCK_PERSIST;
  else process.env.CUTPILOT_MOCK_PERSIST = originalPersist;
  if (typeof originalLiveReads === "undefined") delete process.env.CUTPILOT_ENABLE_LIVE_READS;
  else process.env.CUTPILOT_ENABLE_LIVE_READS = originalLiveReads;
  if (typeof originalRuntimeMode === "undefined") delete process.env.CUTPILOT_RUNTIME_MODE;
  else process.env.CUTPILOT_RUNTIME_MODE = originalRuntimeMode;
}

async function main() {
  resetMockState();

  // 1) 정책 정준값(회귀 가드) — 이 숫자들이 바뀌면 의도된 정책 변경인지 확인해야 한다.
  assert.equal(creditCostForAction("generateShot", { takeCount: 3 }), 18, "generateShot 3 takes = 18");
  assert.equal(creditCostForAction("generateShot", { takeCount: 1 }), 6, "generateShot 1 take = 6");
  assert.equal(creditCostForAction("generateAll", { shotCount: 10 }), 180, "generateAll 10 shots = 180");
  assert.equal(creditCostForAction("regenerate"), 12, "regenerate = 12");
  assert.equal(creditCostForAction("generateImages", { imageCount: 4 }), 16, "generateImages 4 = 16");
  assert.equal(creditCostForAction("generateImages", { imageCount: 2 }), 8, "generateImages 2 = 8");
  assert.equal(creditCostForAction("registerExternalImage"), 0, "registerExternalImage = 0");
  assert.equal(creditCostForAction("upgradeTake"), 22, "upgradeTake = 22");
  assert.equal(creditCostForAction("startRender", { renderCount: 3 }), 48, "startRender 3 renders = 48");
  assert.equal(creditCostForAction("startRender", { renderCount: 1 }), 16, "startRender 1 render = 16");
  // 입력 클램프
  assert.equal(creditCostForAction("generateShot", { takeCount: 9 }), 18, "generateShot take count clamps to 3");
  assert.equal(creditCostForAction("generateImages", { imageCount: 9 }), 16, "generateImages count clamps to 4");

  // 2) estimate가 정책을 그대로 쓴다(단일 출처).
  for (const action of COST_ACTIONS) {
    const params = { takeCount: 3, shotCount: 5, imageCount: 4, renderCount: 3 };
    assert.equal(
      estimateCost(action, params).credits,
      creditCostForAction(action, params),
      `estimate(${action}).credits must equal policy cost`
    );
  }

  // 3) estimate == 실제 mock reservation 차감액 (design/35 의 3중 불일치 회귀 방지).
  {
    const { bundle } = freshProject("inv-generateShot");
    const delta = reservedDelta(() => generateShot(bundle.shots[0].id, { takeCount: 3 }));
    assert.equal(delta, estimateCost("generateShot", { takeCount: 3 }).credits, "generateShot reservation must equal its estimate");
    assert.equal(delta, 18, "generateShot 3 takes reserves 18");
  }
  {
    const { project } = freshProject("inv-generateImages");
    const delta = reservedDelta(() =>
      createImageJob({ projectId: project.id, prompt: "hero product render", purpose: "product", role: "product", aspect: "9:16", count: 4 })
    );
    assert.equal(delta, estimateCost("generateImages", { imageCount: 4 }).credits, "generateImages reservation must equal its estimate");
    assert.equal(delta, 16, "generateImages 4 candidates reserves 16");
  }
  {
    const { project, bundle } = freshProject("inv-generateAll");
    const shotCount = bundle.shots.length;
    const delta = reservedDelta(() => generateAll(project.id));
    assert.equal(delta, estimateCost("generateAll", { shotCount }).credits, "generateAll reservation must equal its estimate");
    assert.equal(delta, shotCount * 18, "generateAll reserves shotCount * 18");
  }
  {
    const { project } = freshProject("inv-startRender");
    const specs = [
      { resolution: "1080p", cut: "6s", aspect: "9:16", caption: "burn-in" },
      { resolution: "1080p", cut: "15s", aspect: "9:16", caption: "burn-in" },
      { resolution: "1080p", cut: "30s", aspect: "9:16", caption: "burn-in" }
    ] as const;
    const delta = reservedDelta(() => startRender(project.id, [...specs]));
    assert.equal(delta, estimateCost("startRender", { renderCount: specs.length }).credits, "startRender reservation must equal its estimate");
    assert.equal(delta, 48, "startRender 3 specs reserves 48");
  }

  // 4) 프로덕션 비용 견적은 fail-closed.
  process.env.CUTPILOT_ENABLE_LIVE_READS = "1";
  await assert.rejects(
    () => resolveCostEstimate("generateShot", { takeCount: 3 }),
    (error: unknown) => error instanceof CostEstimateError && error.code === "PROJECT_REQUIRED" && error.status === 400,
    "live cost estimate without projectId must fail closed (400)"
  );
  delete process.env.CUTPILOT_ENABLE_LIVE_READS;

  process.env.CUTPILOT_RUNTIME_MODE = "production";
  await assert.rejects(
    () => resolveCostEstimate("generateShot", { takeCount: 3 }),
    (error: unknown) => error instanceof CostEstimateError && error.code === "LIVE_PERSISTENCE_REQUIRED" && error.status === 503,
    "production cost estimate without live persistence must fail closed (503)"
  );
  delete process.env.CUTPILOT_RUNTIME_MODE;

  // mock/dev에서는 정상 견적을 돌려준다(정책 비용 + 사용 가능 credit).
  const mockEstimate = await resolveCostEstimate("generateShot", { takeCount: 3 });
  assert.equal(mockEstimate.credits, 18, "mock cost estimate returns policy cost");
  assert.ok(mockEstimate.availableCredits >= 0, "mock cost estimate exposes available credits");

  restoreEnv();
  console.log("cost-policy-invariants.test OK");
}

main().catch((error) => {
  restoreEnv();
  console.error(error);
  process.exit(1);
});
