import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  applyEdit,
  attachImageToShot,
  cancelJob,
  createImageJob,
  createProject,
  deleteImageAsset,
  detachImageFromShot,
  forceDueJobs,
  generateAll,
  generateShot,
  getProjectBundle,
  previewRender,
  registerExternalImage,
  regenerate,
  reloadMockStateFromDisk,
  resetMockState,
  selectTake,
  setAudio,
  setDefaultRender,
  startRender,
  tickJobs,
  updateShotDirection,
  updateStoryboard,
  upgradeTake
} from "../src/server/mock-service";
import { getMediaArtifactInventory } from "../src/server/artifact-inventory";
import { getSystemMetrics } from "../src/server/metrics";
import { chooseProviderRoute, resetProviderHealth, setProviderHealth } from "../src/server/provider-routing";
import { getRuntimeReadiness } from "../src/server/readiness";

const originalPersist = process.env.CUTPILOT_MOCK_PERSIST;
const originalRuntimeMode = process.env.CUTPILOT_RUNTIME_MODE;
const readinessEnvNames = ["RUNWAY_API_KEY", "LUMA_API_KEY", "GOOGLE_VERTEX_PROJECT", "R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "CUTPILOT_QUEUE_URL"];
const originalReadinessEnv = new Map(readinessEnvNames.map((name) => [name, process.env[name]] as const));
const defaultStateFile = join(process.cwd(), "data", "cutpilot-mock-state.json");
const originalStateFile = existsSync(defaultStateFile) ? readFileSync(defaultStateFile, "utf8") : null;
process.env.CUTPILOT_MOCK_PERSIST = "1";
const persistedProject = createProject({
  title: "Persisted project",
  idea: "A short product reveal that survives restart",
  intent: "product_ad"
});
assert.ok(getProjectBundle(persistedProject.id), "persisted project should exist before reload");
reloadMockStateFromDisk();
assert.ok(getProjectBundle(persistedProject.id), "mock state should reload projects from the persisted state file");
if (originalStateFile === null) {
  rmSync(defaultStateFile, { force: true });
} else {
  mkdirSync(join(process.cwd(), "data"), { recursive: true });
  writeFileSync(defaultStateFile, originalStateFile, "utf8");
}
if (typeof originalPersist === "undefined") delete process.env.CUTPILOT_MOCK_PERSIST;
else process.env.CUTPILOT_MOCK_PERSIST = originalPersist;
process.env.CUTPILOT_MOCK_PERSIST = "0";
delete process.env.CUTPILOT_RUNTIME_MODE;
for (const name of readinessEnvNames) delete process.env[name];

const readiness = getRuntimeReadiness();
assert.equal(readiness.mode, "mock", "readiness should default to mock mode");
assert.equal(readiness.ready, true, "mock readiness should be usable without production credentials");
assert.ok(readiness.checks.some((check) => check.id === "provider_credentials" && check.status === "warn"), "mock readiness should warn about missing provider credentials");
if (typeof originalRuntimeMode === "undefined") delete process.env.CUTPILOT_RUNTIME_MODE;
else process.env.CUTPILOT_RUNTIME_MODE = originalRuntimeMode;
for (const name of readinessEnvNames) {
  const value = originalReadinessEnv.get(name);
  if (typeof value === "undefined") delete process.env[name];
  else process.env[name] = value;
}

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

const cancelProject = createProject({
  title: "Cancellation contract",
  idea: "A queued job that should be cancelled before the worker completes",
  intent: "shorts"
});
let cancelBundle = getProjectBundle(cancelProject.id);
assert.ok(cancelBundle, "cancel project bundle should exist");
const cancelShot = cancelBundle.shots[0];
const cancelQueued = generateShot(cancelShot.id, { takeCount: 1 });
const cancelResult = cancelJob(cancelQueued.jobs[0].id);
assert.equal(cancelResult.cancelled, true, "active generation jobs should be cancellable");
assert.equal(cancelResult.kind, "generationJob", "cancel result should identify generation jobs");
assert.equal(cancelResult.refundedCredits, 6, "cancelled generation jobs should refund reserved credits");
cancelBundle = getProjectBundle(cancelProject.id);
assert.ok(cancelBundle, "cancel bundle should reload after cancellation");
const cancelledGenerationJob = cancelBundle.generationJobs.find((job) => job.id === cancelQueued.jobs[0].id);
assert.ok(cancelledGenerationJob, "cancelled generation job should remain inspectable");
assert.equal(cancelledGenerationJob.status, "cancelled", "cancelled generation jobs should keep cancelled status");
assert.equal(cancelledGenerationJob.providerAttempts[0].status, "cancelled", "provider attempt should record cancellation");
assert.equal(cancelledGenerationJob.providerAttempts[0].errorCode, "JOB_CANCELLED", "cancelled attempt should keep normalized cancel code");
const cancelledTake = cancelBundle.takes.find((take) => take.id === cancelQueued.takes[0].id);
assert.equal(cancelledTake?.status, "cancelled", "cancelled generation jobs should cancel their take");
assert.ok(
  cancelBundle.creditTransactions.some((transaction) => transaction.kind === "refund" && transaction.jobId === cancelQueued.jobs[0].id),
  "cancelled generation jobs should write a refund ledger entry"
);

const project = createProject({
  title: "테스트 쇼츠",
  idea: "딸기라떼 쇼츠",
  intent: "shorts"
});

let bundle = getProjectBundle(project.id);
assert.ok(bundle, "bundle should exist");
assert.equal(bundle.shots.length, 10, "mock storyboard should create 10 shots");
const initialRenderSourceHash = bundle.renderSourceHash;
const storyboardBundle = updateStoryboard(project.id, {
  scenes: [{ ...bundle.scenes[0], title: "Opening product beat" }],
  shots: [
    {
      ...bundle.shots[0],
      title: "Hero product push-in",
      saec: { ...bundle.shots[0].saec, action: "Slow push toward the product hero angle" },
      directionSpec: { ...bundle.shots[0].directionSpec, motion: "Slow controlled push-in" }
    }
  ]
});
assert.ok(storyboardBundle, "storyboard update should return a project bundle");
bundle = storyboardBundle;
assert.equal(bundle.scenes[0].title, "Opening product beat", "storyboard update should persist scene changes");
assert.equal(bundle.shots[0].title, "Hero product push-in", "storyboard update should persist shot title changes");
assert.equal(bundle.shots[0].saec.action, "Slow push toward the product hero angle", "storyboard update should persist SAEC changes");
assert.notEqual(bundle.renderSourceHash, initialRenderSourceHash, "storyboard edits should change render source hash");

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
assert.equal(bundle.mediaArtifacts.filter((artifact) => artifact.role === "image_asset").length, 4, "image maker should register image asset artifacts");
assert.equal(bundle.mediaArtifacts.filter((artifact) => artifact.role === "image_thumbnail").length, 4, "image maker should register image thumbnail artifacts");

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
const doneTakes = bundle.takes.filter((take) => take.status === "done");
assert.ok(doneTakes.length > 0, "mock generation should produce playable done takes");
assert.ok(doneTakes.every((take) => take.videoUrl?.startsWith("https://interactive-examples.mdn.mozilla.net/")), "done takes should expose browser-playable video URLs");
assert.ok(doneTakes.every((take) => take.posterUrl?.startsWith("data:image/svg+xml")), "done takes should expose inline SVG poster URLs");
assert.equal(bundle.mediaArtifacts.filter((artifact) => artifact.role === "take_video").length, doneTakes.length, "done takes should register video artifacts");
assert.equal(bundle.mediaArtifacts.filter((artifact) => artifact.role === "take_poster").length, doneTakes.length, "done takes should register poster artifacts");
assert.ok(bundle.generationJobs.every((job) => job.providerAttempts.length === 1), "each generation job should keep one provider attempt record");
const succeededAttempt = bundle.generationJobs.find((job) => job.status === "done")?.providerAttempts[0];
assert.ok(succeededAttempt, "completed generation jobs should keep provider attempt telemetry");
assert.equal(succeededAttempt.status, "succeeded", "successful generation attempts should be marked succeeded");
assert.ok(succeededAttempt.requestId?.startsWith("mock_"), "successful attempts should retain a provider request id");
assert.ok((succeededAttempt.latencyMs || 0) >= 0, "successful attempts should retain non-negative latency");
const failedAttempt = bundle.generationJobs.find((job) => job.status === "failed")?.providerAttempts[0];
assert.ok(failedAttempt, "failed generation jobs should keep provider attempt telemetry");
assert.equal(failedAttempt.status, "failed", "failed generation attempts should be marked failed");
assert.equal(failedAttempt.errorCode, "MOCK_PROVIDER_FAILED", "failed attempts should keep the normalized provider error code");
assert.equal(failedAttempt.retryable, true, "failed attempts should retain retryability");
assert.equal(failedAttempt.fallbackSuggested, true, "failed attempts should retain fallback suggestion");
const firstShotId = bundle.shots[0].id;
const secondShotId = bundle.shots[1].id;

const referencedShotJob = bundle.generationJobs.find((job) => job.shotId === firstShotId);
assert.ok(referencedShotJob, "referenced shot should create a generation job");
assert.equal(referencedShotJob.providerAttempts[0].provider, referencedShotJob.routing.selected.provider, "attempt provider should match the selected route");
assert.equal(referencedShotJob.providerAttempts[0].model, referencedShotJob.routing.selected.model, "attempt model should match the selected route");
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
const referencedShot = bundle.shots.find((shot) => shot.id === firstShotId);
assert.ok(referencedShot, "referenced shot should exist for provider health routing checks");
setProviderHealth({ provider: "luma", model: "ray-flash-2" }, "down", "synthetic outage");
const reroutedForHealth = chooseProviderRoute(referencedShot, referencedShotJob.promptPackage, 0);
assert.equal(reroutedForHealth.selected.provider, "runway", "down provider candidates should be skipped before route selection");
assert.ok(
  reroutedForHealth.rejected.some((target) => target.provider === "luma" && target.model === "ray-flash-2" && target.reason === "provider_health"),
  "provider health exclusions should be recorded in routing rejections"
);
setProviderHealth({ provider: "runway", model: "gen4_turbo" }, "down", "synthetic outage");
setProviderHealth({ provider: "google-vertex", model: "veo-3.1-fast-generate-001" }, "down", "synthetic outage");
const allDownFallbackRoute = chooseProviderRoute(referencedShot, referencedShotJob.promptPackage, 0);
assert.equal(allDownFallbackRoute.selected.provider, "mock", "all-down provider sets should fall back to the mock adapter target");
assert.equal(allDownFallbackRoute.selected.model, "fallback", "all-down provider sets should use the mock fallback model");
assert.equal(
  allDownFallbackRoute.rejected.filter((target) => target.reason === "provider_health").length,
  3,
  "all configured image-to-video candidates should be rejected for provider health before mock fallback"
);
resetProviderHealth();
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
const audioState = setAudio(project.id, { captions: { ...afterEditBundle.editState.captions, enabled: false, mode: "srt" } });
assert.equal(audioState.captions.enabled, false, "setAudio should persist caption enabled state");
assert.equal(audioState.captions.mode, "srt", "setAudio should persist caption mode");
const afterAudioBundle = getProjectBundle(project.id);
assert.ok(afterAudioBundle, "bundle should exist after audio state update");
assert.notEqual(afterAudioBundle.renderSourceHash, afterEditBundle.renderSourceHash, "render source hash should change when audio state changes");
const renderSpecs = [
  { resolution: "1080p", cut: "6s", aspect: "9:16", caption: "burn-in" },
  { resolution: "1080p", cut: "15s", aspect: "9:16", caption: "burn-in" },
  { resolution: "1080p", cut: "30s", aspect: "9:16", caption: "burn-in" }
] as const;
const renderPreview = previewRender(project.id, renderSpecs[0]);
assert.equal(renderPreview.sourceHash, afterAudioBundle.renderSourceHash, "render preview should match the current bundle render source hash");
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
assert.ok(bundle.renderJobs.every((job) => job.outputUrl?.startsWith("https://interactive-examples.mdn.mozilla.net/")), "done render jobs should expose browser-playable output URLs");
assert.ok(bundle.renderJobs.every((job) => job.shareUrl?.startsWith("https://cutpilot.local/share/")), "done render jobs should expose share URLs");
assert.equal(bundle.mediaArtifacts.filter((artifact) => artifact.role === "render_output").length, bundle.renderJobs.length, "done renders should register output artifacts");
assert.ok(bundle.project.thumbUrl?.startsWith("data:image/svg+xml"), "done projects should keep a poster thumbnail");
assert.ok(bundle.project.defaultRenderJobId, "completed projects should auto-select a default render version");
const fifteenSecondRender = bundle.renderJobs.find((job) => job.spec.cut === "15s");
assert.ok(fifteenSecondRender, "15s render should exist for default version selection");
bundle = setDefaultRender(project.id, fifteenSecondRender.id) || bundle;
assert.equal(bundle.project.defaultRenderJobId, fifteenSecondRender.id, "setDefaultRender should persist the selected render version");
assert.ok(bundle.creditTransactions.some((transaction) => transaction.kind === "reserve" && transaction.action === "generateImages"), "credit ledger should record image generation reservations");
assert.ok(bundle.creditTransactions.some((transaction) => transaction.kind === "refund" && transaction.action === "generateShot"), "credit ledger should refund failed video generations");
assert.ok(bundle.creditTransactions.some((transaction) => transaction.kind === "capture" && transaction.action === "upgradeTake"), "credit ledger should capture publishing upgrades");
assert.ok(bundle.creditTransactions.some((transaction) => transaction.kind === "capture" && transaction.action === "startRender"), "credit ledger should capture completed renders");
const capturedCredits = bundle.creditTransactions
  .filter((transaction) => transaction.kind === "capture")
  .reduce((total, transaction) => total + transaction.credits, 0);
const openReservedCredits = bundle.creditTransactions.reduce((total, transaction) => {
  if (transaction.kind === "reserve") return total + transaction.credits;
  if (transaction.kind === "capture" || transaction.kind === "refund") return total - transaction.credits;
  return total;
}, 0);
assert.equal(bundle.credits.spent, capturedCredits, "spent credits should match captured ledger entries");
assert.equal(bundle.credits.reserved, Math.max(0, openReservedCredits), "reserved credits should match open ledger reservations");
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
assert.equal(bundle.mediaArtifacts.some((artifact) => artifact.ownerId === styleAsset.id), false, "force delete should remove image asset artifacts");

const metrics = getSystemMetrics();
assert.ok(metrics.projects.total >= 2, "system metrics should count all mock projects");
assert.equal(metrics.jobs.render.done, 3, "system metrics should count completed render jobs");
assert.ok(metrics.jobs.generation.cancelled >= 1, "system metrics should count cancelled generation jobs");
assert.ok(metrics.providerAttempts.cancelled >= 1, "system metrics should count cancelled provider attempts");
assert.ok(metrics.providerAttempts.succeeded > 0, "system metrics should count successful provider attempts");
assert.ok(metrics.providerAttempts.failed > 0, "system metrics should count failed provider attempts");
assert.equal(metrics.credits.spent, metrics.credits.captured, "system metrics spent credits should match captured credit ledger");
assert.ok(metrics.credits.refunded > 0, "system metrics should include refunded credits");
assert.ok(metrics.mediaArtifacts.videos >= bundle.renderJobs.length, "system metrics should count video artifacts");

const inventory = getMediaArtifactInventory();
assert.equal(inventory.summary.total, metrics.mediaArtifacts.total, "artifact inventory should match system metrics artifact total");
assert.equal(inventory.summary.images, metrics.mediaArtifacts.images, "artifact inventory should match image artifact count");
assert.equal(inventory.summary.videos, metrics.mediaArtifacts.videos, "artifact inventory should match video artifact count");
assert.equal(inventory.summary.external, metrics.mediaArtifacts.external, "artifact inventory should match external artifact count");
assert.ok(inventory.summary.stored > 0, "artifact inventory should count stored artifacts");
assert.ok(inventory.summary.reviewExternal > 0, "artifact inventory should flag external artifacts for review");
assert.equal(inventory.summary.orphaned, 0, "mock flow should not leave orphaned artifacts after asset deletion");
assert.ok(inventory.artifacts.every((item) => item.artifact.storageKey.startsWith(`projects/${item.artifact.projectId}/`)), "artifact inventory should expose production-shaped storage keys");
assert.ok(inventory.artifacts.some((item) => item.artifact.role === "render_output" && item.cleanup === "retain"), "render outputs should be retained while their jobs exist");
assert.ok(inventory.artifacts.some((item) => item.artifact.status === "external" && item.cleanup === "review_external"), "external artifacts should be marked for review instead of deletion");

console.log("mock-flow.test OK", {
  shots: bundle.shots.length,
  failed: failedShots.length,
  takes: bundle.takes.length,
  imageAssets: bundle.imageAssets.length,
  renderJobs: bundle.renderJobs.length
});
