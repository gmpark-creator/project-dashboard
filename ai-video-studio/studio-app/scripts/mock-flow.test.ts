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
  getMutableMockState,
  getMockState,
  getProjectBundle,
  previewRender,
  registerExternalImage,
  regenerate,
  reloadMockStateFromDisk,
  resetMockState,
  selectTake,
  setAudio,
  setDefaultRender,
  saveMockState,
  startRender,
  tickJobs,
  updateShotDirection,
  updateStoryboard,
  upgradeTake
} from "../src/server/mock-service";
import { getMediaArtifactInventory } from "../src/server/artifact-inventory";
import { getSystemMetrics } from "../src/server/metrics";
import { buildImageWorkerInvocation } from "../src/server/image-worker-invocation";
import { buildProviderInvocation } from "../src/server/provider-invocation";
import { getJobQueueSnapshot } from "../src/server/queue-snapshot";
import { buildRenderWorkerInvocation } from "../src/server/render-worker-invocation";
import { getWorkerCompletionSnapshot } from "../src/server/worker-completions";
import { getWorkerDispatchSnapshot } from "../src/server/worker-dispatch";
import { completeWorkerLease, createWorkerLease, getWorkerLeaseSnapshot, releaseWorkerLease, renewWorkerLease } from "../src/server/worker-leases";
import { executeWorkerRetry, getWorkerRetryExecutionSnapshot, getWorkerRetryPlan } from "../src/server/worker-retries";
import { buildStorageCleanupPlan, executeStorageCleanup, getStorageCleanupExecutionSnapshot, getStorageCleanupPlan } from "../src/server/storage-cleanup";
import { chooseProviderRoute, getProviderHealthSnapshot, resetProviderHealth, setProviderHealth } from "../src/server/provider-routing";
import { getRuntimeReadiness } from "../src/server/readiness";
import { requireSystemAccess } from "../src/server/system-access";

const originalPersist = process.env.CUTPILOT_MOCK_PERSIST;
const originalRuntimeMode = process.env.CUTPILOT_RUNTIME_MODE;
const readinessEnvNames = ["RUNWAY_API_KEY", "LUMA_API_KEY", "GOOGLE_VERTEX_PROJECT", "R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "CUTPILOT_QUEUE_URL", "CUTPILOT_ADMIN_TOKEN"];
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
assert.ok(readiness.checks.some((check) => check.id === "worker_output_policy" && check.status === "warn"), "mock readiness should warn that worker outputs are not required");
assert.ok(readiness.checks.some((check) => check.id === "admin_access" && check.status === "warn"), "mock readiness should warn about missing admin access token");
assert.equal(requireSystemAccess(new Request("http://cutpilot.local/api/system/metrics")), null, "mock system endpoints should not require an admin token");
process.env.CUTPILOT_RUNTIME_MODE = "production";
const productionReadiness = getRuntimeReadiness();
assert.ok(productionReadiness.checks.some((check) => check.id === "worker_output_policy" && check.status === "pass"), "production readiness should enforce worker output payloads");
delete process.env.CUTPILOT_ADMIN_TOKEN;
const unconfiguredAccess = requireSystemAccess(new Request("http://cutpilot.local/api/system/metrics"));
assert.equal(unconfiguredAccess?.status, 503, "production system endpoints should fail closed without a configured admin token");
process.env.CUTPILOT_ADMIN_TOKEN = "test-admin-token";
const missingAccess = requireSystemAccess(new Request("http://cutpilot.local/api/system/metrics"));
assert.equal(missingAccess?.status, 401, "production system endpoints should reject missing admin credentials");
const bearerAccess = requireSystemAccess(new Request("http://cutpilot.local/api/system/metrics", { headers: { authorization: "Bearer test-admin-token" } }));
assert.equal(bearerAccess, null, "production system endpoints should accept the configured bearer token");
const headerAccess = requireSystemAccess(new Request("http://cutpilot.local/api/system/media-artifacts", { headers: { "x-cutpilot-admin-token": "test-admin-token" } }));
assert.equal(headerAccess, null, "production system endpoints should accept the configured admin header");
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

const workerCompletionProject = createProject({
  title: "Worker completion contract",
  idea: "A leased worker job that should complete through the lease API",
  intent: "product_ad"
});
const workerImageJob = createImageJob({
  projectId: workerCompletionProject.id,
  prompt: "Worker-completed product image",
  purpose: "product",
  role: "product",
  aspect: "9:16",
  style: "clean",
  count: 1
});
const completionLease = createWorkerLease({ workerId: "completion-worker-a", kind: "image_generation", ttlSec: 30 });
assert.equal(completionLease.reason, "leased", "worker completion setup should lease an image job");
assert.equal(completionLease.lease?.jobId, workerImageJob.job.id, "worker completion lease should target the image job");
assert.ok(completionLease.lease, "worker completion lease should exist");
const wrongCompletion = completeWorkerLease(completionLease.lease.id, { token: "wrong-token", status: "succeeded" });
assert.equal(wrongCompletion.completed, false, "worker completion should reject token mismatch");
assert.equal(wrongCompletion.reason, "token_mismatch", "worker completion should report token mismatch");
const completedWorkerJob = completeWorkerLease(completionLease.lease.id, { token: completionLease.lease.token, status: "succeeded" });
assert.equal(completedWorkerJob.completed, true, "worker completion should complete an active leased job");
assert.equal(completedWorkerJob.reason, "completed", "worker completion should report completion");
assert.equal(completedWorkerJob.lease?.status, "released", "worker completion should release the lease");
assert.equal(completedWorkerJob.receipt?.kind, "image_generation", "worker completion should return an image completion receipt");
assert.equal(completedWorkerJob.receipt?.status, "succeeded", "worker completion receipt should mark success");
assert.ok(completedWorkerJob.receipt?.artifacts.some((artifact) => artifact.role === "image_asset"), "worker completion receipt should include image artifacts");
assert.ok(completedWorkerJob.receipt?.artifacts.some((artifact) => artifact.role === "image_thumbnail"), "worker completion receipt should include thumbnail artifacts");
assert.equal(completedWorkerJob.receipt?.summary.capturedCredits, 4, "worker completion receipt should capture image credits");
const duplicateCompletion = completeWorkerLease(completionLease.lease.id, { token: completionLease.lease.token, status: "succeeded" });
assert.equal(duplicateCompletion.completed, false, "worker completion should not re-complete released leases");
assert.equal(duplicateCompletion.reason, "not_active", "worker completion should report inactive released leases");

const outputImageJob = createImageJob({
  projectId: workerCompletionProject.id,
  prompt: "Worker output payload product image",
  purpose: "product",
  role: "product",
  aspect: "9:16",
  style: "clean",
  count: 1
});
const outputLease = createWorkerLease({ workerId: "completion-worker-output", kind: "image_generation", ttlSec: 30 });
assert.equal(outputLease.reason, "leased", "worker output setup should lease an image job");
assert.equal(outputLease.lease?.jobId, outputImageJob.job.id, "worker output setup should target the output image job");
assert.ok(outputLease.lease, "worker output lease should exist");
const missingRequiredOutput = completeWorkerLease(outputLease.lease.id, { token: outputLease.lease.token, status: "succeeded", requireOutputs: true });
assert.equal(missingRequiredOutput.completed, false, "worker completion should reject missing required output payloads");
assert.equal(missingRequiredOutput.reason, "invalid_outputs", "worker completion should report invalid output payloads before mutating jobs");
const workerImageOutputUrl = "https://assets.cutpilot.local/worker-output-image.png";
const workerThumbOutputUrl = "https://assets.cutpilot.local/worker-output-thumb.jpg";
const completedOutputJob = completeWorkerLease(outputLease.lease.id, {
  token: outputLease.lease.token,
  status: "succeeded",
  requireOutputs: true,
  outputs: {
    imageVariants: [{ variantId: outputImageJob.job.variants[0].id, imageUrl: workerImageOutputUrl, thumbUrl: workerThumbOutputUrl }]
  }
});
assert.equal(completedOutputJob.completed, true, "worker completion should accept production-shaped output payloads");
assert.ok(completedOutputJob.receipt?.artifacts.some((artifact) => artifact.url === workerImageOutputUrl), "worker completion should preserve supplied image output URLs");
assert.ok(completedOutputJob.receipt?.artifacts.some((artifact) => artifact.url === workerThumbOutputUrl), "worker completion should preserve supplied thumbnail output URLs");

const productionOutputPolicyJob = createImageJob({
  projectId: workerCompletionProject.id,
  prompt: "Production worker output policy image",
  purpose: "product",
  role: "product",
  aspect: "9:16",
  style: "clean",
  count: 1
});
const productionOutputPolicyLease = createWorkerLease({ workerId: "completion-worker-production-policy", kind: "image_generation", ttlSec: 30 });
assert.equal(productionOutputPolicyLease.reason, "leased", "production output policy setup should lease an image job");
assert.equal(productionOutputPolicyLease.lease?.jobId, productionOutputPolicyJob.job.id, "production output policy lease should target the policy image job");
assert.ok(productionOutputPolicyLease.lease, "production output policy lease should exist");
const runtimeModeBeforeOutputPolicy = process.env.CUTPILOT_RUNTIME_MODE;
process.env.CUTPILOT_RUNTIME_MODE = "production";
const productionMissingOutput = completeWorkerLease(productionOutputPolicyLease.lease.id, { token: productionOutputPolicyLease.lease.token, status: "succeeded" });
assert.equal(productionMissingOutput.completed, false, "production worker completion should require successful output payloads");
assert.equal(productionMissingOutput.reason, "invalid_outputs", "production worker completion should reject missing output payloads");
const productionOutputUrl = "https://assets.cutpilot.local/production-output-policy-image.png";
const productionValidOutput = completeWorkerLease(productionOutputPolicyLease.lease.id, {
  token: productionOutputPolicyLease.lease.token,
  status: "succeeded",
  outputs: { imageVariants: [{ variantId: productionOutputPolicyJob.job.variants[0].id, imageUrl: productionOutputUrl }] }
});
assert.equal(productionValidOutput.completed, true, "production worker completion should accept valid output payloads");
if (typeof runtimeModeBeforeOutputPolicy === "undefined") delete process.env.CUTPILOT_RUNTIME_MODE;
else process.env.CUTPILOT_RUNTIME_MODE = runtimeModeBeforeOutputPolicy;

const fullVariantOutputJob = createImageJob({
  projectId: workerCompletionProject.id,
  prompt: "Production worker output coverage image",
  purpose: "product",
  role: "product",
  aspect: "9:16",
  style: "clean",
  count: 2
});
const fullVariantOutputLease = createWorkerLease({ workerId: "completion-worker-full-variant-output", kind: "image_generation", ttlSec: 30 });
assert.equal(fullVariantOutputLease.reason, "leased", "full variant output setup should lease an image job");
assert.equal(fullVariantOutputLease.lease?.jobId, fullVariantOutputJob.job.id, "full variant output lease should target the coverage image job");
assert.ok(fullVariantOutputLease.lease, "full variant output lease should exist");
const partialVariantOutput = completeWorkerLease(fullVariantOutputLease.lease.id, {
  token: fullVariantOutputLease.lease.token,
  status: "succeeded",
  requireOutputs: true,
  outputs: { imageVariants: [{ variantId: fullVariantOutputJob.job.variants[0].id, imageUrl: "https://assets.cutpilot.local/partial-variant-output-a.png" }] }
});
assert.equal(partialVariantOutput.reason, "invalid_outputs", "required image outputs should cover every requested variant");
const fullVariantOutput = completeWorkerLease(fullVariantOutputLease.lease.id, {
  token: fullVariantOutputLease.lease.token,
  status: "succeeded",
  requireOutputs: true,
  outputs: {
    imageVariants: fullVariantOutputJob.job.variants.map((variant, index) => ({
      variantId: variant.id,
      imageUrl: `https://assets.cutpilot.local/full-variant-output-${index}.png`
    }))
  }
});
assert.equal(fullVariantOutput.completed, true, "worker completion should accept required outputs for every requested image variant");

const retryImageJob = createImageJob({
  projectId: workerCompletionProject.id,
  prompt: "Worker-failed retryable product image",
  purpose: "product",
  role: "product",
  aspect: "9:16",
  style: "clean",
  count: 1
});
const retryLease = createWorkerLease({ workerId: "completion-worker-b", kind: "image_generation", ttlSec: 30 });
assert.equal(retryLease.reason, "leased", "worker retry setup should lease an image job");
assert.equal(retryLease.lease?.jobId, retryImageJob.job.id, "worker retry lease should target the failed image job");
assert.ok(retryLease.lease, "worker retry lease should exist");
const failedWorkerJob = completeWorkerLease(retryLease.lease.id, {
  token: retryLease.lease.token,
  status: "failed",
  error: {
    code: "IMAGE_PROVIDER_TIMEOUT",
    userMessage: "이미지 제공자가 시간 초과되었습니다.",
    retryable: true,
    fallbackSuggested: true
  }
});
assert.equal(failedWorkerJob.completed, true, "worker completion should record failed leased jobs");
assert.equal(failedWorkerJob.receipt?.status, "failed", "failed worker completion should return a failed receipt");
assert.equal(failedWorkerJob.receipt?.error?.code, "IMAGE_PROVIDER_TIMEOUT", "failed worker completion should preserve error code");
const workerRetryPlan = getWorkerRetryPlan();
const retryPlanItem = workerRetryPlan.items.find((item) => item.receipt.jobId === retryImageJob.job.id);
assert.ok(retryPlanItem, "worker retry plan should include retryable failed worker completions");
assert.equal(retryPlanItem?.action, "retry_image_generation", "failed image worker completion should become an image retry action");
assert.equal(retryPlanItem?.retryable, true, "retryable failed worker completion should be marked retryable");
assert.equal(retryPlanItem?.fallbackSuggested, true, "retry plan should preserve fallback suggestion");
const retryExecution = executeWorkerRetry(retryImageJob.job.id);
assert.equal(retryExecution.executed, true, "worker retry execution should create replacement jobs for retryable failures");
assert.equal(retryExecution.action, "retry_image_generation", "worker retry execution should preserve the planned retry action");
assert.ok(retryExecution.replacement, "worker retry execution should return the replacement queue snapshot");
assert.equal(retryExecution.retryRecord?.sourceJobId, retryImageJob.job.id, "worker retry execution should create an auditable retry record");
assert.notEqual(retryExecution.replacement?.id, retryImageJob.job.id, "worker retry execution should create a new job id");
const retriedImageJob = getMockState().imageJobs.find((job) => job.id === retryExecution.replacement?.id);
assert.equal(retriedImageJob?.retryOfJobId, retryImageJob.job.id, "replacement image jobs should retain the source failed job id");
assert.ok(["queued", "running"].includes(retriedImageJob?.status || ""), "replacement image jobs should remain active before worker completion");
const imageJobCountAfterRetry = getMockState().imageJobs.length;
const repeatedRetryExecution = executeWorkerRetry(retryImageJob.job.id);
assert.equal(repeatedRetryExecution.reason, "already_executed", "worker retry execution should be idempotent for the same source job");
assert.equal(repeatedRetryExecution.replacement?.id, retryExecution.replacement?.id, "idempotent retry execution should return the original replacement job");
assert.equal(getMockState().imageJobs.length, imageJobCountAfterRetry, "idempotent retry execution should not create duplicate replacement jobs");
assert.equal(getMockState().workerRetryRecords.filter((record) => record.sourceJobId === retryImageJob.job.id).length, 1, "worker retry execution should keep one retry record per source job");
const retryExecutionSnapshot = getWorkerRetryExecutionSnapshot();
const retryExecutionItem = retryExecutionSnapshot.items.find((item) => item.record.sourceJobId === retryImageJob.job.id);
assert.ok(retryExecutionItem, "worker retry execution snapshot should include retry records");
assert.equal(retryExecutionItem?.sourceReceipt?.status, "failed", "worker retry execution snapshot should attach the failed source receipt");
assert.equal(retryExecutionItem?.replacement?.id, retryExecution.replacement?.id, "worker retry execution snapshot should attach the replacement queue job");
assert.equal(retryExecutionItem?.replacementMissing, false, "worker retry execution snapshot should flag existing replacements as present");
assert.ok(retryExecutionSnapshot.summary.withReplacement >= 1, "worker retry execution snapshot should count records with replacement jobs");
forceDueJobs("imageJobs");
tickJobs();
assert.equal(getMockState().imageJobs.find((job) => job.id === retryExecution.replacement?.id)?.status, "done", "replacement image jobs should complete through the normal image job flow");

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

const imageJobResult = createImageJob({
  projectId: project.id,
  prompt: "딸기라떼 제품 이미지, 밝은 카페 배경, 손은 나오지 않게",
  purpose: "product",
  role: "product",
  aspect: "9:16",
  style: "프리미엄 광고 사진",
  count: 4
});
const imageInvocation = buildImageWorkerInvocation(imageJobResult.job);
assert.equal(imageInvocation.jobId, imageJobResult.job.id, "image worker invocation should identify its image job");
assert.equal(imageInvocation.projectId, project.id, "image worker invocation should identify the project");
assert.equal(imageInvocation.request.prompt, imageJobResult.job.prompt, "image worker invocation should carry the image prompt");
assert.equal(imageInvocation.request.style, imageJobResult.job.style, "image worker invocation should carry style guidance");
assert.equal(imageInvocation.request.count, imageJobResult.job.count, "image worker invocation should carry requested variant count");
assert.equal(imageInvocation.outputs.length, imageJobResult.job.variants.length, "image worker invocation should declare one output per variant");
assert.deepEqual(
  imageInvocation.outputs.map((output) => output.variantId),
  imageJobResult.job.variants.map((variant) => variant.id),
  "image worker invocation outputs should preserve variant ids"
);
assert.ok(
  imageInvocation.outputs.every((output) => output.imageStorageKey.includes(`/imageJob/${imageInvocation.jobId}/variants/${output.variantId}/image_asset`)),
  "image worker invocation should expose production-shaped image storage keys"
);
assert.ok(
  imageInvocation.outputs.every((output) => output.thumbnailStorageKey.includes(`/imageJob/${imageInvocation.jobId}/variants/${output.variantId}/image_thumbnail`)),
  "image worker invocation should expose production-shaped thumbnail storage keys"
);
assert.equal(imageInvocation.policy.rightsStatus, "generated", "image worker invocation should mark generated image rights");
assert.equal(imageInvocation.policy.registerAsAssets, true, "image worker invocation should require asset library registration");
assert.equal(imageInvocation.policy.storageIngestRequired, true, "image worker invocation should require storage ingest");
assert.equal(imageInvocation.responseContract.expectedKind, "image", "image worker invocation should declare image outputs");
assert.equal(imageInvocation.responseContract.ingest, "copy_to_storage", "image worker invocation should require storage ingest");
let workerDispatch = getWorkerDispatchSnapshot();
const imageDispatchItem = workerDispatch.items.find((item) => item.jobId === imageJobResult.job.id);
assert.ok(imageDispatchItem, "worker dispatch snapshot should include active image jobs");
assert.equal(imageDispatchItem.kind, "image_generation", "image jobs should dispatch as image generation work");
assert.equal(imageDispatchItem.dispatchKey, `image_generation:${imageJobResult.job.id}`, "worker dispatch item should use a stable image dispatch key");
assert.equal(imageDispatchItem.invocation.jobId, imageJobResult.job.id, "image dispatch item should carry its image worker invocation");
assert.equal(workerDispatch.summary.imageGeneration, 1, "worker dispatch summary should count active image jobs");
assert.equal(workerDispatch.summary.total, workerDispatch.items.length, "worker dispatch total should match item count");
let workerLeases = getWorkerLeaseSnapshot();
assert.equal(workerLeases.summary.active, 0, "worker lease setup should have no active leases before leasing image work");
const releasedLeasesBeforeImage = workerLeases.summary.released;
const imageLease = createWorkerLease({ workerId: "image-worker-a", kind: "image_generation", ttlSec: 30 });
assert.equal(imageLease.reason, "leased", "worker lease should lease active image work");
assert.equal(imageLease.lease?.kind, "image_generation", "image worker lease should preserve dispatch kind");
assert.equal(imageLease.lease?.dispatchKey, imageDispatchItem.dispatchKey, "image worker lease should point to the dispatch item");
assert.equal(imageLease.item?.jobId, imageJobResult.job.id, "image worker lease should return the leased dispatch item");
const duplicateImageLease = createWorkerLease({ workerId: "image-worker-b", kind: "image_generation", ttlSec: 30 });
assert.equal(duplicateImageLease.reason, "no_available_work", "active worker leases should prevent duplicate dispatch leasing");
assert.ok(imageLease.lease, "image lease should exist before release checks");
const wrongImageRenew = renewWorkerLease(imageLease.lease.id, { token: "wrong-token", ttlSec: 60 });
assert.equal(wrongImageRenew.renewed, false, "worker lease renew should reject token mismatch");
assert.equal(wrongImageRenew.reason, "token_mismatch", "worker lease renew should report token mismatch");
const imageLeaseExpiresAt = imageLease.lease.expiresAt;
const imageRenew = renewWorkerLease(imageLease.lease.id, { token: imageLease.lease.token, ttlSec: 120 });
assert.equal(imageRenew.renewed, true, "worker lease should renew with matching token");
assert.equal(imageRenew.reason, "renewed", "worker lease renew should report success");
assert.ok(imageRenew.lease, "worker lease renew should return the renewed lease");
assert.ok(new Date(imageRenew.lease.expiresAt).getTime() > new Date(imageLeaseExpiresAt).getTime(), "worker lease renew should extend expiry");
const wrongImageRelease = releaseWorkerLease(imageLease.lease.id, "wrong-token");
assert.equal(wrongImageRelease.released, false, "worker lease release should reject token mismatch");
assert.equal(wrongImageRelease.reason, "token_mismatch", "worker lease release should report token mismatch");
const imageRelease = releaseWorkerLease(imageLease.lease.id, imageLease.lease.token);
assert.equal(imageRelease.released, true, "worker lease should release with matching token");
assert.equal(imageRelease.reason, "released", "worker lease release should report success");
workerLeases = getWorkerLeaseSnapshot();
assert.equal(workerLeases.summary.released, releasedLeasesBeforeImage + 1, "worker lease snapshot should count newly released leases");
assert.equal(workerLeases.summary.active, 0, "worker lease snapshot should have no active leases after release");
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

const generationResult = generateAll(project.id, { tier: "fast" });
workerDispatch = getWorkerDispatchSnapshot();
const generationDispatchItems = workerDispatch.items.filter((item) => item.kind === "provider_generation" && item.projectId === project.id);
assert.equal(generationDispatchItems.length, generationResult.jobs.length, "worker dispatch snapshot should include active generation jobs");
assert.ok(generationDispatchItems.every((item) => item.dispatchKey === `provider_generation:${item.jobId}`), "generation dispatch keys should be stable");
assert.ok(
  generationDispatchItems.every((item) => "responseContract" in item.invocation && item.invocation.responseContract.expectedKind === "video"),
  "generation dispatch items should carry provider invocations"
);
assert.equal(workerDispatch.summary.providerGeneration, generationResult.jobs.length, "worker dispatch summary should count provider generation jobs");
assert.equal(workerDispatch.summary.total, workerDispatch.items.length, "worker dispatch summary should match generation dispatch item count");
assert.deepEqual(
  workerDispatch.items.map((item) => item.priority),
  workerDispatch.items.map((_, index) => index + 1),
  "worker dispatch priorities should be dense and ordered"
);
const generationLease = createWorkerLease({ workerId: "video-worker-a", kind: "provider_generation", ttlSec: 30 });
assert.equal(generationLease.reason, "leased", "worker lease should lease active provider generation work");
assert.equal(generationLease.lease?.kind, "provider_generation", "provider generation lease should preserve dispatch kind");
assert.ok(generationDispatchItems.some((item) => item.dispatchKey === generationLease.lease?.dispatchKey), "provider generation lease should reference a dispatch item");
assert.ok(generationLease.lease, "generation lease should exist before release");
const generationRelease = releaseWorkerLease(generationLease.lease.id, generationLease.lease.token);
assert.equal(generationRelease.released, true, "provider generation lease should release with matching token");
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

const referencedShot = bundle.shots.find((shot) => shot.id === firstShotId);
assert.ok(referencedShot, "referenced shot should exist for provider health routing checks");
const referencedShotJob = bundle.generationJobs.find((job) => job.shotId === firstShotId);
assert.ok(referencedShotJob, "referenced shot should create a generation job");
assert.equal(referencedShotJob.providerAttempts[0].provider, referencedShotJob.routing.selected.provider, "attempt provider should match the selected route");
assert.equal(referencedShotJob.providerAttempts[0].model, referencedShotJob.routing.selected.model, "attempt model should match the selected route");
assert.equal(referencedShotJob.promptPackage.routingHints.startFrameAssetId, productAsset.id, "first-frame asset should be in generation prompt package");
assert.equal(referencedShotJob.promptPackage.durationSec, referencedShot?.durationSec, "prompt package should snapshot shot duration");
assert.equal(referencedShotJob.routing.ruleId, "image-to-video-fast", "first-frame fast shots should use image-to-video fast routing");
assert.equal(referencedShotJob.routing.hiddenFromUser, true, "provider routing must remain hidden from user UI");
assert.equal(referencedShotJob.routing.selected.provider, "luma", "first image-to-video fast candidate should be Luma");
assert.equal(referencedShotJob.routing.selected.model, "ray-flash-2", "first image-to-video fast model should be ray-flash-2");
const referencedInvocation = buildProviderInvocation(referencedShotJob);
assert.equal(referencedInvocation.provider, referencedShotJob.routing.selected.provider, "provider invocation should use the selected provider");
assert.equal(referencedInvocation.model, referencedShotJob.routing.selected.model, "provider invocation should use the selected model");
assert.equal(referencedInvocation.inputKind, "image", "first-frame jobs should become image provider invocations");
assert.equal(referencedInvocation.request.startFrameUrl, productAsset.url, "provider invocation should carry the first-frame URL");
assert.equal(referencedInvocation.request.durationSec, referencedShot?.durationSec, "provider invocation should carry snapped shot duration");
assert.equal(referencedInvocation.policy.hiddenFromUser, true, "provider invocation should preserve hidden-from-user policy");
assert.equal(referencedInvocation.policy.storageIngestRequired, true, "provider invocation should require output ingest to storage");
assert.equal(referencedInvocation.responseContract.ingest, "copy_to_storage", "provider invocation should require storage ingest");
const referencedShotRoutes = bundle.generationJobs
  .filter((job) => job.shotId === firstShotId)
  .map((job) => `${job.routing.selected.provider}:${job.routing.selected.model}`);
assert.deepEqual(
  referencedShotRoutes,
  ["luma:ray-flash-2", "runway:gen4_turbo", "google-vertex:veo-3.1-fast-generate-001"],
  "fast image-to-video takes should split across configured provider candidates"
);
let providerHealth = getProviderHealthSnapshot();
assert.ok(providerHealth.summary.total > 0, "provider health snapshot should include configured provider models");
assert.equal(providerHealth.summary.down, 0, "provider health should default to no down targets");
assert.equal(providerHealth.summary.healthy, providerHealth.summary.total, "provider health should default all targets to healthy");
setProviderHealth({ provider: "luma", model: "ray-flash-2" }, "down", "synthetic outage");
providerHealth = getProviderHealthSnapshot();
const lumaHealth = providerHealth.targets.find((target) => target.provider === "luma" && target.model === "ray-flash-2");
assert.equal(lumaHealth?.status, "down", "provider health snapshot should expose down overrides");
assert.equal(lumaHealth?.reason, "synthetic outage", "provider health snapshot should expose down reasons");
assert.ok(lumaHealth?.checkedAt, "provider health snapshot should expose override check time");
assert.equal(providerHealth.summary.down, 1, "provider health summary should count down targets");
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
providerHealth = getProviderHealthSnapshot();
assert.equal(providerHealth.summary.down, 0, "reset provider health should clear down targets");
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
const styleInvocation = buildProviderInvocation(styleShotJob);
assert.equal(styleInvocation.inputKind, "text", "style-only references should keep a text provider invocation");
assert.equal(styleInvocation.policy.rightsReviewRequired, true, "provider invocation should preserve rights review requirements");
assert.ok(styleInvocation.request.negativePrompt.includes(styleShotJob.promptPackage.saec.negative), "provider invocation should include SAEC negative prompt");

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
const renderResult = startRender(project.id, [...renderSpecs]);
workerDispatch = getWorkerDispatchSnapshot();
const renderDispatchItems = workerDispatch.items.filter((item) => item.kind === "render" && item.projectId === project.id);
assert.equal(renderDispatchItems.length, renderResult.jobs.length, "worker dispatch snapshot should include active render jobs");
assert.ok(renderDispatchItems.every((item) => item.dispatchKey === `render:${item.jobId}`), "render dispatch keys should be stable");
assert.ok(
  renderDispatchItems.every((item) => "output" in item.invocation && item.invocation.output.role === "render_output"),
  "render dispatch items should carry render worker invocations"
);
assert.equal(workerDispatch.summary.render, renderResult.jobs.length, "worker dispatch summary should count render jobs");
assert.equal(workerDispatch.summary.total, workerDispatch.items.length, "worker dispatch summary should match render dispatch item count");
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
const allCreditTransactions = getMockState().creditTransactions;
const capturedCredits = allCreditTransactions
  .filter((transaction) => transaction.kind === "capture")
  .reduce((total, transaction) => total + transaction.credits, 0);
const openReservedCredits = allCreditTransactions.reduce((total, transaction) => {
  if (transaction.kind === "reserve") return total + transaction.credits;
  if (transaction.kind === "capture" || transaction.kind === "refund") return total - transaction.credits;
  return total;
}, 0);
assert.equal(bundle.credits.spent, capturedCredits, "spent credits should match global captured ledger entries");
assert.equal(bundle.credits.reserved, Math.max(0, openReservedCredits), "reserved credits should match global open ledger reservations");
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
const renderInvocation = buildRenderWorkerInvocation(renderedBundle.renderJobs[0]);
assert.equal(renderInvocation.jobId, renderedBundle.renderJobs[0].id, "render worker invocation should identify its render job");
assert.equal(renderInvocation.sourceHash, renderedBundle.renderJobs[0].renderPlan.sourceHash, "render worker invocation should preserve source hash");
assert.equal(renderInvocation.inputs.length, renderedBundle.renderJobs[0].renderPlan.shots.length, "render worker invocation should include all renderable plan shots");
assert.deepEqual(
  renderInvocation.inputs.map((input) => input.order),
  renderInvocation.inputs.map((input) => input.order).sort((a, b) => a - b),
  "render worker invocation inputs should preserve storyboard order"
);
assert.equal(renderInvocation.missingShotIds.length, 1, "render worker invocation should carry missing shots for worker reporting");
assert.equal(renderInvocation.policy.missingShotPolicy, "skip_with_notice", "render worker invocation should document missing-shot behavior");
assert.equal(renderInvocation.policy.burnCaptions, true, "burn-in renders should request caption burn");
assert.equal(renderInvocation.policy.emitSrt, false, "burn-in-only renders should not emit srt");
assert.equal(renderInvocation.policy.audioMix, afterAudioBundle.editState.bgm.enabled, "render worker invocation should preserve audio mix policy");
assert.equal(renderInvocation.output.role, "render_output", "render worker invocation should declare render output role");
assert.equal(renderInvocation.output.container, "mp4", "render worker invocation should target mp4 output");
assert.equal(renderInvocation.output.storageKey, `projects/${renderInvocation.projectId}/renderJob/${renderInvocation.jobId}/render_output`, "render worker invocation should expose production-shaped storage key");
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

const queue = getJobQueueSnapshot();
const metricJobTotal =
  Object.values(metrics.jobs.generation).reduce((total, count) => total + count, 0) +
  Object.values(metrics.jobs.image).reduce((total, count) => total + count, 0) +
  Object.values(metrics.jobs.render).reduce((total, count) => total + count, 0);
assert.equal(queue.summary.total, metricJobTotal, "queue snapshot should cover all generation, image, and render jobs");
assert.equal(queue.summary.running + queue.summary.queued, queue.summary.active, "queue snapshot active count should match queued plus running");
assert.equal(queue.summary.cancelable, queue.jobs.filter((job) => job.cancelable).length, "queue snapshot cancelable count should match jobs");
assert.equal(queue.summary.cancelled, metrics.jobs.generation.cancelled + metrics.jobs.image.cancelled + metrics.jobs.render.cancelled, "queue snapshot should count cancelled jobs");
assert.ok(queue.jobs.some((job) => job.kind === "generation" && job.status === "cancelled"), "queue snapshot should retain cancelled generation jobs");
assert.ok(queue.jobs.some((job) => job.kind === "render" && job.status === "done"), "queue snapshot should include completed render jobs");
assert.equal(queue.summary.nextDueAt, null, "completed mock flow should have no active queue due date");
workerDispatch = getWorkerDispatchSnapshot();
assert.equal(workerDispatch.summary.total, 0, "completed mock flow should have no active worker dispatch items");
assert.equal(workerDispatch.items.length, 0, "completed worker dispatch snapshot should have no items");
assert.equal(workerDispatch.summary.nextDueAt, null, "completed worker dispatch snapshot should have no next due date");
workerLeases = getWorkerLeaseSnapshot();
assert.equal(workerLeases.summary.active, 0, "completed mock flow should not leave active worker leases");
assert.ok(workerLeases.summary.released >= 2, "worker lease snapshot should retain released lease history");
const workerCompletions = getWorkerCompletionSnapshot();
assert.equal(workerCompletions.summary.total, queue.summary.total, "worker completion receipts should cover all terminal queue jobs");
assert.ok(workerCompletions.summary.succeeded > 0, "worker completion receipts should include successful jobs");
assert.ok(workerCompletions.summary.failed > 0, "worker completion receipts should include failed jobs");
assert.ok(workerCompletions.summary.cancelled > 0, "worker completion receipts should include cancelled jobs");
assert.equal(workerCompletions.summary.artifactCount, workerCompletions.receipts.reduce((total, receipt) => total + receipt.summary.artifactCount, 0), "completion artifact summary should match receipts");
assert.equal(workerCompletions.summary.capturedCredits, metrics.credits.captured, "completion receipts should reconcile captured credits");
assert.equal(workerCompletions.summary.refundedCredits, metrics.credits.refunded, "completion receipts should reconcile refunded credits");
assert.ok(
  workerCompletions.receipts.some((receipt) => receipt.kind === "provider_generation" && receipt.status === "succeeded" && receipt.artifacts.some((artifact) => artifact.role === "take_video")),
  "successful provider generation receipts should include take video artifacts"
);
assert.ok(
  workerCompletions.receipts.some((receipt) => receipt.kind === "image_generation" && receipt.status === "succeeded" && receipt.artifacts.some((artifact) => artifact.role === "image_asset") && receipt.artifacts.some((artifact) => artifact.role === "image_thumbnail")),
  "successful image generation receipts should include image and thumbnail artifacts"
);
assert.ok(
  workerCompletions.receipts.some((receipt) => receipt.kind === "render" && receipt.status === "succeeded" && receipt.artifacts.some((artifact) => artifact.role === "render_output")),
  "successful render receipts should include render output artifacts"
);
assert.ok(
  workerCompletions.receipts.some((receipt) => receipt.kind === "provider_generation" && receipt.status === "failed" && receipt.error?.code === "MOCK_PROVIDER_FAILED"),
  "failed provider receipts should preserve normalized provider errors"
);
assert.ok(
  workerCompletions.receipts.some((receipt) => receipt.kind === "provider_generation" && receipt.status === "cancelled" && receipt.error?.code === "JOB_CANCELLED" && receipt.summary.refundedCredits > 0),
  "cancelled provider receipts should preserve cancel errors and refunds"
);

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
const cleanupPlan = getStorageCleanupPlan();
assert.equal(cleanupPlan.summary.total, inventory.summary.total, "storage cleanup plan should cover the artifact inventory");
assert.equal(cleanupPlan.summary.reviewExternal, inventory.summary.reviewExternal, "storage cleanup plan should preserve external review counts");
assert.equal(cleanupPlan.summary.deleteCandidates, 0, "completed mock flow should not leave delete candidates");
assert.ok(cleanupPlan.items.some((item) => item.action === "retain" && item.safeToDelete === false), "retained artifacts should not be safe to delete");
assert.ok(cleanupPlan.items.some((item) => item.action === "review_external" && item.safeToDelete === false), "external review artifacts should not be deleted automatically");

const cleanupSourceState = getMockState();
const orphanBaseArtifact = cleanupSourceState.mediaArtifacts.find((artifact) => artifact.ownerType === "imageAsset" && artifact.status === "stored");
assert.ok(orphanBaseArtifact, "mock state should have a stored image artifact for orphan cleanup simulation");
const orphanState = {
  ...cleanupSourceState,
  imageAssets: cleanupSourceState.imageAssets.filter((asset) => asset.id !== orphanBaseArtifact.ownerId)
};
const orphanCleanupPlan = buildStorageCleanupPlan(orphanState);
const orphanCleanupItem = orphanCleanupPlan.items.find((item) => item.artifact.id === orphanBaseArtifact.id);
assert.equal(orphanCleanupItem?.cleanup, "orphaned", "simulated missing owner should mark artifact orphaned");
assert.equal(orphanCleanupItem?.action, "delete_object", "orphaned stored artifacts should become delete candidates");
assert.equal(orphanCleanupItem?.safeToDelete, true, "orphaned stored artifacts should be safe to delete");
assert.ok(orphanCleanupPlan.summary.deleteCandidates > cleanupPlan.summary.deleteCandidates, "orphan cleanup plan should increase delete candidates");
const executableCleanupState = getMutableMockState();
executableCleanupState.imageAssets = executableCleanupState.imageAssets.filter((asset) => asset.id !== orphanBaseArtifact.ownerId);
saveMockState(executableCleanupState);
const executableCleanupPlan = getStorageCleanupPlan();
assert.ok(executableCleanupPlan.summary.deleteCandidates > 0, "orphaned artifacts should become executable cleanup candidates in mock state");
const cleanupExecution = executeStorageCleanup({ limit: 1 });
assert.equal(cleanupExecution.summary.deleted, 1, "storage cleanup execution should delete one safe candidate when limited to one");
assert.equal(cleanupExecution.summary.recordsCreated, 1, "storage cleanup execution should create one audit record per deleted artifact");
assert.equal(cleanupExecution.records.length, 1, "storage cleanup execution should return created records");
assert.equal(getMockState().mediaArtifacts.some((artifact) => artifact.id === cleanupExecution.records[0]?.artifactId), false, "deleted cleanup artifacts should be removed from mock state");
assert.equal(getMockState().storageCleanupRecords.some((record) => record.id === cleanupExecution.records[0]?.id), true, "storage cleanup execution records should persist in mock state");
const cleanupExecutionSnapshot = getStorageCleanupExecutionSnapshot();
assert.ok(cleanupExecutionSnapshot.records.some((record) => record.id === cleanupExecution.records[0]?.id), "storage cleanup execution snapshot should include persisted records");
assert.equal(cleanupExecutionSnapshot.summary.total, getMockState().storageCleanupRecords.length, "storage cleanup execution snapshot should summarize persisted cleanup records");
assert.equal(cleanupExecutionSnapshot.summary.deleted, cleanupExecutionSnapshot.records.length, "storage cleanup execution snapshot should count deleted records");

console.log("mock-flow.test OK", {
  shots: bundle.shots.length,
  failed: failedShots.length,
  takes: bundle.takes.length,
  imageAssets: bundle.imageAssets.length,
  renderJobs: bundle.renderJobs.length
});
