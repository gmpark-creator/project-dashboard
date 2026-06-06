import assert from "node:assert/strict";
import {
  attachImageToShot,
  createImageJob,
  createProject,
  forceDueJobs,
  generateAll,
  getProjectBundle,
  registerExternalImage,
  regenerate,
  resetMockState,
  selectTake,
  startRender,
  tickJobs,
  updateShotDirection,
  upgradeTake
} from "../src/server/mock-service";

resetMockState();

assert.throws(
  () =>
    createProject({
      title: "빈 입력",
      idea: "   ",
      intent: "shorts"
    }),
  /아이디어/,
  "blank ideas should be rejected before storyboard generation"
);

const project = createProject({
  title: "테스트 쇼츠",
  idea: "딸기라떼 쇼츠",
  intent: "shorts"
});

let bundle = getProjectBundle(project.id);
assert.ok(bundle, "bundle should exist");
assert.equal(bundle.shots.length, 10, "mock storyboard should create 10 shots");

createImageJob({
  projectId: project.id,
  prompt: "딸기라떼 제품 이미지, 밝은 카페 배경, 손은 나오지 않게",
  purpose: "product",
  role: "product",
  aspect: "9:16",
  style: "프리미엄 광고 사진",
  count: 4
});
forceDueJobs("imageJobs");
tickJobs();

bundle = getProjectBundle(project.id);
assert.ok(bundle, "bundle should exist after image job");
assert.equal(bundle.imageJobs.length, 1, "image maker should create an image job");
assert.equal(bundle.imageAssets.filter((asset) => asset.source === "image_maker").length, 4, "image maker should save 4 assets");

const externalAsset = registerExternalImage({
  projectId: project.id,
  label: "외부 인물 참조",
  role: "character",
  url: "https://example.com/person.png",
  rightsConfirmed: true
});
const productAsset = bundle.imageAssets.find((asset) => asset.role === "product");
assert.ok(productAsset, "generated product asset should exist");
attachImageToShot(bundle.shots[0].id, { assetId: productAsset.id, mode: "first_frame" });
attachImageToShot(bundle.shots[0].id, { assetId: externalAsset.id, mode: "character_reference" });
updateShotDirection(bundle.shots[0].id, { motion: "느린 푸시인", notes: "딸기 과육과 컵 표면 물방울 강조" });
bundle = getProjectBundle(project.id);
assert.ok(bundle, "bundle should exist after attaching references");
assert.equal(bundle.shots[0].referenceImageIds.length, 2, "shot should keep reference image ids");
assert.equal(bundle.shots[0].requirements.imageToVideo, true, "image references should mark shot as image-to-video capable");
assert.equal(bundle.shots[0].directionSpec.motion, "느린 푸시인", "shot direction should be editable");

generateAll(project.id, { tier: "fast" });
forceDueJobs("generationJobs");
tickJobs();

bundle = getProjectBundle(project.id);
assert.ok(bundle, "bundle should exist after generation");

const failedShots = bundle.shots.filter((shot) => shot.status === "failed");
assert.equal(failedShots.length, 2, "mock generation should inject exactly 2 failed shots");

const failedShot = failedShots[0];
const beforeTakes = bundle.takes.filter((take) => take.shotId === failedShot.id).length;
regenerate(failedShot.id, { scope: "segment" });
forceDueJobs("generationJobs");
tickJobs();

bundle = getProjectBundle(project.id);
assert.ok(bundle, "bundle should exist after regenerate");
const afterTakes = bundle.takes.filter((take) => take.shotId === failedShot.id).length;
assert.ok(afterTakes > beforeTakes, "regenerate should preserve old takes and add new takes");

const doneTake = bundle.takes.find((take) => take.shotId === failedShot.id && take.status === "done");
assert.ok(doneTake, "regenerated shot should have a done take");
selectTake(failedShot.id, doneTake.id);

upgradeTake(doneTake.id, { mode: "final_regenerate" });
forceDueJobs("generationJobs");
tickJobs();

startRender(project.id, [
  { resolution: "1080p", cut: "6s", aspect: "9:16", caption: "burn-in" },
  { resolution: "1080p", cut: "15s", aspect: "9:16", caption: "burn-in" },
  { resolution: "1080p", cut: "30s", aspect: "9:16", caption: "burn-in" }
]);
forceDueJobs("renderJobs");
tickJobs();

bundle = getProjectBundle(project.id);
assert.ok(bundle, "bundle should exist after render");
assert.equal(bundle.renderJobs.length, 3, "render should create 3 jobs");
assert.ok(bundle.renderJobs.every((job) => job.status === "done"), "render jobs should complete when forced due");

console.log("mock-flow.test OK", {
  shots: bundle.shots.length,
  failed: failedShots.length,
  takes: bundle.takes.length,
  imageAssets: bundle.imageAssets.length,
  renderJobs: bundle.renderJobs.length
});
