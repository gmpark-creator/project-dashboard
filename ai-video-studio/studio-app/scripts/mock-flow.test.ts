import assert from "node:assert/strict";
import {
  applyEdit,
  attachImageToShot,
  createImageJob,
  createProject,
  deleteImageAsset,
  detachImageFromShot,
  forceDueJobs,
  generateAll,
  getProjectBundle,
  previewRender,
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
const styleAsset = registerExternalImage({
  projectId: project.id,
  label: "권리 확인 전 스타일 참조",
  role: "style",
  url: "https://example.com/mood.png",
  rightsConfirmed: false
});
const unusedAsset = registerExternalImage({
  projectId: project.id,
  label: "미사용 로고",
  role: "logo",
  url: "https://example.com/logo.png",
  rightsConfirmed: true
});
const productAsset = bundle.imageAssets.find((asset) => asset.role === "product");
assert.ok(productAsset, "generated product asset should exist");
attachImageToShot(bundle.shots[0].id, { assetId: productAsset.id, mode: "first_frame" });
attachImageToShot(bundle.shots[0].id, { assetId: externalAsset.id, mode: "character_reference" });
attachImageToShot(bundle.shots[1].id, { assetId: styleAsset.id, mode: "style_reference" });
updateShotDirection(bundle.shots[0].id, { motion: "느린 푸시인", notes: "딸기 과육과 컵 표면 물방울 강조" });
bundle = getProjectBundle(project.id);
assert.ok(bundle, "bundle should exist after attaching references");
assert.equal(bundle.shots[0].referenceImageIds.length, 2, "shot should keep reference image ids");
assert.equal(bundle.shots[0].requirements.imageToVideo, true, "first-frame references should mark shot as image-to-video capable");
assert.equal(bundle.shots[0].requirements.characterLock, true, "character references should request character lock");
assert.ok(bundle.shots[0].requirements.characterId, "character references should create a character id");
assert.equal(bundle.shots[1].requirements.imageToVideo, false, "style-only references should not force image-to-video");
assert.equal(bundle.shots[0].directionSpec.motion, "느린 푸시인", "shot direction should be editable");

generateAll(project.id, { tier: "fast" });
forceDueJobs("generationJobs");
tickJobs();

bundle = getProjectBundle(project.id);
assert.ok(bundle, "bundle should exist after generation");

const failedShots = bundle.shots.filter((shot) => shot.status === "failed");
assert.equal(failedShots.length, 2, "mock generation should inject exactly 2 failed shots");
const firstShotId = bundle.shots[0].id;
const secondShotId = bundle.shots[1].id;

const referencedShotJob = bundle.generationJobs.find((job) => job.shotId === firstShotId);
assert.ok(referencedShotJob, "referenced shot should create a generation job");
assert.equal(referencedShotJob.promptPackage.routingHints.startFrameAssetId, productAsset.id, "first-frame asset should be in generation prompt package");
assert.equal(referencedShotJob.routing.ruleId, "image-to-video-fast", "first-frame fast shots should use image-to-video fast routing");
assert.equal(referencedShotJob.routing.hiddenFromUser, true, "provider routing must remain hidden from user UI");
assert.equal(referencedShotJob.routing.selected.provider, "luma", "first image-to-video fast candidate should be Luma");
assert.equal(referencedShotJob.routing.selected.model, "ray-flash-2", "first image-to-video fast model should be ray-flash-2");
const referencedShotRoutes = bundle.generationJobs
  .filter((job) => job.shotId === firstShotId)
  .map((job) => `${job.routing.selected.provider}:${job.routing.selected.model}`);
assert.deepEqual(
  referencedShotRoutes,
  ["luma:ray-flash-2", "runway:gen4_turbo", "google-vertex:veo-3.1-fast-generate-001"],
  "fast image-to-video takes should split across configured provider candidates"
);
assert.deepEqual(
  referencedShotJob.promptPackage.routingHints.characterReferenceAssetIds,
  [externalAsset.id],
  "character reference should be in generation prompt package"
);
assert.equal(referencedShotJob.promptPackage.requirements.characterLock, true, "prompt package should snapshot character lock");
assert.equal(referencedShotJob.promptPackage.directionSpec.motion, "느린 푸시인", "prompt package should snapshot direction spec");

const styleShotJob = bundle.generationJobs.find((job) => job.shotId === secondShotId);
assert.ok(styleShotJob, "style-referenced shot should create a generation job");
assert.equal(styleShotJob.routing.ruleId, "fast-text-draft", "style-only fast shots should stay on text-draft routing");
assert.deepEqual(styleShotJob.promptPackage.routingHints.styleReferenceAssetIds, [styleAsset.id], "style reference should be routed as style only");
assert.equal(styleShotJob.promptPackage.requirements.imageToVideo, false, "style-only generation package should not request image-to-video");
assert.equal(styleShotJob.promptPackage.routingHints.rightsReviewRequired, true, "unconfirmed reference rights should be visible to the adapter package");

const blockedDelete = deleteImageAsset(project.id, styleAsset.id);
assert.equal(blockedDelete.deleted, false, "used assets should not be deleted without force");
assert.equal(blockedDelete.blockedByUsage, true, "used asset delete should be blocked by usage");

const deletedUnused = deleteImageAsset(project.id, unusedAsset.id);
assert.equal(deletedUnused.deleted, true, "unused assets should be deletable");
assert.equal(deletedUnused.blockedByUsage, false, "unused asset delete should not be blocked");

const shotAfterDetach = detachImageFromShot(firstShotId, externalAsset.id);
assert.equal(shotAfterDetach.referenceImageIds.includes(externalAsset.id), false, "detaching should remove an asset from shot references");
assert.equal(shotAfterDetach.requirements.characterLock, false, "detaching the only character reference should clear character lock for non-character-lock intents");

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

const beforeEditBundle = getProjectBundle(project.id);
assert.ok(beforeEditBundle, "bundle should exist before render source hash check");
const beforeEditSourceHash = beforeEditBundle.renderSourceHash;
applyEdit(project.id, "마지막 컷 CTA를 2초 더 길게 보여줘");
const afterEditBundle = getProjectBundle(project.id);
assert.ok(afterEditBundle, "bundle should exist after render source hash check");
assert.notEqual(afterEditBundle.renderSourceHash, beforeEditSourceHash, "render source hash should change when edit commands change");
const renderSpecs = [
  { resolution: "1080p", cut: "6s", aspect: "9:16", caption: "burn-in" },
  { resolution: "1080p", cut: "15s", aspect: "9:16", caption: "burn-in" },
  { resolution: "1080p", cut: "30s", aspect: "9:16", caption: "burn-in" }
] as const;
const renderPreview = previewRender(project.id, renderSpecs[0]);
assert.equal(renderPreview.sourceHash, afterEditBundle.renderSourceHash, "render preview should match the current bundle render source hash");
assert.equal(renderPreview.renderPlan.sourceHash, renderPreview.sourceHash, "render plan should carry the same source hash as its preview");
assert.equal(renderPreview.rightsReview.required, true, "render preview should expose rights review before creating render jobs");
assert.equal(renderPreview.renderPlan.missingShotIds.length, 1, "render preview should expose missing shots before creating render jobs");
assert.equal(renderPreview.renderPlan.edit.commands.some((command) => command.command.includes("CTA")), true, "render preview should snapshot edit commands");
assert.equal(renderPreview.estimate.credits, 48, "render preview should expose render cost estimate");
startRender(project.id, [...renderSpecs]);
forceDueJobs("renderJobs");
tickJobs();

bundle = getProjectBundle(project.id);
assert.ok(bundle, "bundle should exist after render");
assert.equal(bundle.renderJobs.length, 3, "render should create 3 jobs");
assert.ok(bundle.renderJobs.every((job) => job.status === "done"), "render jobs should complete when forced due");
const renderedBundle = bundle;
assert.ok(
  renderedBundle.renderJobs.every((job) => job.renderPlan.shots.length + job.renderPlan.missingShotIds.length === renderedBundle.shots.length),
  "render plan should account for selected and missing storyboard shots"
);
assert.ok(renderedBundle.renderJobs.every((job) => job.renderPlan.missingShotIds.length === 1), "render plan should preserve known missing failed shots");
assert.ok(bundle.renderJobs.every((job) => job.renderPlan.totalDurationSec > 0), "render plan should include total duration");
assert.ok(
  bundle.renderJobs.every((job) => job.renderPlan.sourceHash === renderPreview.sourceHash),
  "render jobs should snapshot the same render source hash used by the preview"
);
assert.ok(
  bundle.renderJobs.every((job) => job.renderPlan.edit.commands.some((command) => command.command.includes("CTA"))),
  "render plan should snapshot edit commands"
);
assert.deepEqual(
  renderedBundle.renderJobs[0].renderPlan.shots.map((shot) => shot.order),
  renderedBundle.renderJobs[0].renderPlan.shots.map((shot) => shot.order).sort((a, b) => a - b),
  "render plan selected shots should preserve storyboard order"
);
assert.ok(bundle.renderJobs.every((job) => job.rightsReview.required), "render jobs should snapshot rights review when selected shots use unconfirmed references");
assert.ok(
  bundle.renderJobs.every((job) => job.rightsReview.assetIds.includes(styleAsset.id)),
  "render rights review should include the unconfirmed style reference"
);

const forcedDelete = deleteImageAsset(project.id, styleAsset.id, { force: true });
assert.equal(forcedDelete.deleted, true, "force delete should remove a used asset and its references");
bundle = getProjectBundle(project.id);
assert.ok(bundle, "bundle should exist after force deleting an asset");
assert.equal(bundle.shots.some((shot) => shot.referenceImageIds.includes(styleAsset.id)), false, "force delete should remove shot references");

console.log("mock-flow.test OK", {
  shots: bundle.shots.length,
  failed: failedShots.length,
  takes: bundle.takes.length,
  imageAssets: bundle.imageAssets.length,
  renderJobs: bundle.renderJobs.length
});
