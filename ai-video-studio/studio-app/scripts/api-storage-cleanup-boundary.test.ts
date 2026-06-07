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

async function json(response: Response) {
  return response.json() as Promise<{ code?: string }>;
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
    assert.equal(objectStorageCheck?.status, "fail", "production readiness should fail until live object deletion is implemented");

    const response = await executeStorageCleanup(request({ limit: 1 }));
    assert.equal(response.status, 503, "production cleanup execution should fail closed without a live object storage delete adapter");
    assert.equal((await json(response)).code, "OBJECT_STORAGE_UNAVAILABLE", "cleanup boundary should expose a stable storage unavailable code");
    assert.equal(
      getMockState().mediaArtifacts.some((artifact) => artifact.id === orphanedArtifactId),
      true,
      "failed production cleanup should preserve media artifact metadata"
    );
    assert.equal(getMockState().storageCleanupRecords.length, 0, "failed production cleanup should not create deletion records");
  } finally {
    resetMockState();
    restoreEnv(originalEnv);
  }

  console.log("api-storage-cleanup-boundary.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
