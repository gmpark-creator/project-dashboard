import assert from "node:assert/strict";
import { POST as completeWorkerLease } from "../app/api/system/worker-leases/[leaseId]/complete/route";
import { POST as createWorkerLease } from "../app/api/system/worker-leases/route";
import type { WorkerLeaseCompletionInput, WorkerLeaseCompletionResult, WorkerLeaseResult } from "../src/domain/types";
import { createImageJob, createProject, resetMockState } from "../src/server/mock-service";

const adminToken = "test-admin-token";

function request(body: unknown) {
  return new Request("http://cutpilot.local/api/system/worker-leases", {
    method: "POST",
    headers: { "x-cutpilot-admin-token": adminToken },
    body: JSON.stringify(body)
  });
}

function context<T extends Record<string, string>>(params: T) {
  return { params: Promise.resolve(params) };
}

async function json<T>(response: Response) {
  return response.json() as Promise<T>;
}

async function main() {
  const originalPersist = process.env.CUTPILOT_MOCK_PERSIST;
  const originalRuntimeMode = process.env.CUTPILOT_RUNTIME_MODE;
  const originalAdminToken = process.env.CUTPILOT_ADMIN_TOKEN;
  try {
    process.env.CUTPILOT_MOCK_PERSIST = "0";
    process.env.CUTPILOT_RUNTIME_MODE = "production";
    process.env.CUTPILOT_ADMIN_TOKEN = adminToken;
    resetMockState();

    const project = createProject({
      title: "API worker storage policy",
      idea: "A production image worker completion policy check",
      intent: "product_ad"
    });
    const imageJob = createImageJob({
      projectId: project.id,
      prompt: "Production route-level worker output image",
      purpose: "product",
      role: "product",
      aspect: "9:16",
      style: "clean",
      count: 1
    }).job;
    const variant = imageJob.variants[0];
    assert.ok(variant, "storage policy setup should create an image variant");

    const leaseResponse = await createWorkerLease(request({ workerId: "api-storage-policy-worker", kind: "image_generation", ttlSec: 30 }));
    assert.equal(leaseResponse.status, 201, "authorized production lease route should return a created lease");
    const leaseResult = await json<WorkerLeaseResult>(leaseResponse);
    assert.equal(leaseResult.reason, "leased", "route-level storage policy setup should lease image work");
    assert.equal(leaseResult.lease?.jobId, imageJob.id, "route-level storage policy setup should lease the queued image job");
    assert.ok(leaseResult.lease, "route-level storage policy setup should return a lease");

    const imageUrl = "https://assets.cutpilot.local/api-worker-storage-policy-image.png";
    const thumbUrl = "https://assets.cutpilot.local/api-worker-storage-policy-thumb.jpg";
    const imageStorageKey = `projects/${project.id}/imageJob/${imageJob.id}/variants/${variant.id}/image_asset`;
    const thumbnailStorageKey = `projects/${project.id}/imageJob/${imageJob.id}/variants/${variant.id}/image_thumbnail`;

    const missingStorageResponse = await completeWorkerLease(
      request({
        token: leaseResult.lease.token,
        status: "succeeded",
        outputs: { imageVariants: [{ variantId: variant.id, imageUrl }] }
      } satisfies WorkerLeaseCompletionInput),
      context({ leaseId: leaseResult.lease.id })
    );
    assert.equal(missingStorageResponse.status, 422, "production completion route should reject missing storage keys");
    const missingStorageResult = await json<WorkerLeaseCompletionResult>(missingStorageResponse);
    assert.equal(missingStorageResult.completed, false, "missing storage key completion should not mutate the worker job");
    assert.equal(missingStorageResult.reason, "invalid_outputs", "missing storage keys should be reported as invalid outputs");

    const mismatchedStorageResponse = await completeWorkerLease(
      request({
        token: leaseResult.lease.token,
        status: "succeeded",
        outputs: {
          imageVariants: [
            {
              variantId: variant.id,
              imageUrl,
              imageStorageKey: "projects/wrong/imageJob/wrong/variants/wrong/image_asset",
              thumbUrl,
              thumbnailStorageKey
            }
          ]
        }
      } satisfies WorkerLeaseCompletionInput),
      context({ leaseId: leaseResult.lease.id })
    );
    assert.equal(mismatchedStorageResponse.status, 422, "production completion route should reject mismatched storage keys");
    const mismatchedStorageResult = await json<WorkerLeaseCompletionResult>(mismatchedStorageResponse);
    assert.equal(mismatchedStorageResult.completed, false, "mismatched storage key completion should keep the lease active");
    assert.equal(mismatchedStorageResult.reason, "invalid_outputs", "mismatched storage keys should be reported as invalid outputs");

    const validStorageResponse = await completeWorkerLease(
      request({
        token: leaseResult.lease.token,
        status: "succeeded",
        outputs: {
          imageVariants: [
            {
              variantId: variant.id,
              imageUrl,
              imageStorageKey,
              thumbUrl,
              thumbnailStorageKey
            }
          ]
        }
      } satisfies WorkerLeaseCompletionInput),
      context({ leaseId: leaseResult.lease.id })
    );
    assert.equal(validStorageResponse.status, 200, "production completion route should accept matching storage keys");
    const validStorageResult = await json<WorkerLeaseCompletionResult>(validStorageResponse);
    assert.equal(validStorageResult.completed, true, "valid production storage keys should complete the worker lease");
    assert.equal(validStorageResult.reason, "completed", "valid production storage keys should return the completed reason");
    assert.ok(
      validStorageResult.receipt?.artifacts.some((artifact) => artifact.role === "image_asset" && artifact.url === imageUrl),
      "completed route response should include the worker-provided image artifact"
    );
    assert.ok(
      validStorageResult.receipt?.artifacts.some((artifact) => artifact.role === "image_thumbnail" && artifact.url === thumbUrl),
      "completed route response should include the worker-provided thumbnail artifact"
    );
  } finally {
    resetMockState();
    if (typeof originalPersist === "undefined") delete process.env.CUTPILOT_MOCK_PERSIST;
    else process.env.CUTPILOT_MOCK_PERSIST = originalPersist;
    if (typeof originalRuntimeMode === "undefined") delete process.env.CUTPILOT_RUNTIME_MODE;
    else process.env.CUTPILOT_RUNTIME_MODE = originalRuntimeMode;
    if (typeof originalAdminToken === "undefined") delete process.env.CUTPILOT_ADMIN_TOKEN;
    else process.env.CUTPILOT_ADMIN_TOKEN = originalAdminToken;
  }

  console.log("api-worker-storage-policy.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
