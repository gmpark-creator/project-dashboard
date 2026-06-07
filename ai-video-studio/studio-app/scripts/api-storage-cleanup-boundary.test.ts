import assert from "node:assert/strict";
import { POST as executeStorageCleanup } from "../app/api/system/storage-cleanup/route";
import { getRuntimeReadiness } from "../src/server/readiness";
import { createImageJob, createProject, getMockState, getMutableMockState, resetMockState, saveMockState } from "../src/server/mock-service";
import { completeWorkerLease, createWorkerLease } from "../src/server/worker-leases";

const adminToken = "test-admin-token";
const managedEnvNames = [
  "CUTPILOT_MOCK_PERSIST",
  "CUTPILOT_RUNTIME_MODE",
  "CUTPILOT_ADMIN_TOKEN",
  "OBJECT_STORAGE_PROVIDER",
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET"
];

function request(body: unknown) {
  return new Request("http://cutpilot.local/api/system/storage-cleanup", {
    method: "POST",
    headers: { "x-cutpilot-admin-token": adminToken },
    body: JSON.stringify(body)
  });
}

function restoreEnv(originalEnv: Map<string, string | undefined>) {
  for (const name of managedEnvNames) {
    const value = originalEnv.get(name);
    if (typeof value === "undefined") delete process.env[name];
    else process.env[name] = value;
  }
}

function createOrphanedStoredArtifact() {
  process.env.CUTPILOT_RUNTIME_MODE = "mock";
  const project = createProject({
    title: "Storage cleanup boundary",
    idea: "A stored artifact that should not be metadata-deleted before object storage deletion",
    intent: "product_ad"
  });
  const imageJob = createImageJob({
    projectId: project.id,
    prompt: "Cleanup boundary image",
    purpose: "product",
    role: "product",
    aspect: "9:16",
    count: 1
  }).job;
  const variant = imageJob.variants[0];
  assert.ok(variant, "cleanup boundary setup should create an image variant");
  const lease = createWorkerLease({ workerId: "cleanup-boundary-worker", kind: "image_generation", ttlSec: 30 });
  assert.equal(lease.reason, "leased", "cleanup boundary setup should lease image work");
  assert.ok(lease.lease, "cleanup boundary setup should create a lease");
  const completion = completeWorkerLease(lease.lease.id, {
    token: lease.lease.token,
    status: "succeeded",
    requireOutputs: true,
    outputs: {
      imageVariants: [
        {
          variantId: variant.id,
          imageUrl: "https://assets.cutpilot.local/storage-cleanup-boundary-image.png",
          thumbUrl: "https://assets.cutpilot.local/storage-cleanup-boundary-thumb.jpg"
        }
      ]
    }
  });
  assert.equal(completion.completed, true, "cleanup boundary setup should create stored media artifacts");

  const current = getMutableMockState();
  const orphanedArtifact = current.mediaArtifacts.find((artifact) => artifact.sourceJobId === imageJob.id && artifact.role === "image_asset");
  assert.ok(orphanedArtifact, "cleanup boundary setup should create an image artifact");
  current.imageAssets = current.imageAssets.filter((asset) => asset.id !== orphanedArtifact.ownerId);
  saveMockState(current);
  return orphanedArtifact.id;
}

async function main() {
  const originalEnv = new Map(managedEnvNames.map((name) => [name, process.env[name]] as const));
  const originalFetch = globalThis.fetch;
  try {
    process.env.CUTPILOT_MOCK_PERSIST = "0";
    resetMockState();
    const orphanedArtifactId = createOrphanedStoredArtifact();

    process.env.CUTPILOT_RUNTIME_MODE = "production";
    process.env.CUTPILOT_ADMIN_TOKEN = adminToken;
    process.env.OBJECT_STORAGE_PROVIDER = "r2";
    process.env.R2_ACCOUNT_ID = "account123456";
    process.env.R2_ACCESS_KEY_ID = "access123456";
    process.env.R2_SECRET_ACCESS_KEY = "secret123456789";
    process.env.R2_BUCKET = "cutpilot-prod-media";

    const readiness = getRuntimeReadiness();
    const objectStorageCheck = readiness.checks.find((check) => check.id === "object_storage");
    assert.equal(objectStorageCheck?.status, "fail", "production readiness should fail until live object ingest is implemented");
    assert.ok(objectStorageCheck?.detail.includes("live object ingest adapter"), "production readiness should describe the remaining live ingest adapter gap");

    let deleteCalls = 0;
    globalThis.fetch = (async (url, init) => {
      deleteCalls += 1;
      assert.equal(init?.method, "DELETE", "production cleanup should delete objects through the object storage adapter");
      assert.ok(String(url).includes("https://account123456.r2.cloudflarestorage.com/cutpilot-prod-media/"), "production cleanup should target the configured R2 bucket");
      return new Response(null, { status: 204 });
    }) as typeof fetch;
    const response = await executeStorageCleanup(request({ limit: 1 }));
    assert.equal(response.status, 200, "production cleanup execution should succeed when R2 deletion succeeds");
    const result = (await response.json()) as { summary?: { deleted?: number; recordsCreated?: number } };
    assert.equal(result.summary?.deleted, 1, "production cleanup should delete the selected safe object");
    assert.equal(result.summary?.recordsCreated, 1, "production cleanup should create an audit record after deletion");
    assert.equal(deleteCalls, 1, "production cleanup should call R2 delete once for a one-item limit");
    assert.equal(
      getMockState().mediaArtifacts.some((artifact) => artifact.id === orphanedArtifactId),
      false,
      "successful production cleanup should remove media artifact metadata after object deletion"
    );
    assert.equal(getMockState().storageCleanupRecords.length, 1, "successful production cleanup should create deletion records");
  } finally {
    globalThis.fetch = originalFetch;
    resetMockState();
    restoreEnv(originalEnv);
  }

  console.log("api-storage-cleanup-boundary.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
