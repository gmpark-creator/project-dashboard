import assert from "node:assert/strict";
import {
  ingestStoredObject,
  ObjectStorageUnavailableError,
  type StoredObjectIngestInput
} from "../src/server/object-storage";
import { getRuntimeReadiness } from "../src/server/readiness";

const input: StoredObjectIngestInput = {
  sourceUrl: "https://provider.example/result.mp4",
  storageKey: "projects/prj_test/take/take_test/take_video",
  contentType: "video/mp4",
  bytes: 1024
};

async function main() {
  const originalRuntimeMode = process.env.CUTPILOT_RUNTIME_MODE;
  const originalProvider = process.env.OBJECT_STORAGE_PROVIDER;
  const originalR2Account = process.env.R2_ACCOUNT_ID;
  const originalR2Access = process.env.R2_ACCESS_KEY_ID;
  const originalR2Secret = process.env.R2_SECRET_ACCESS_KEY;
  const originalR2Bucket = process.env.R2_BUCKET;
  try {
    delete process.env.CUTPILOT_RUNTIME_MODE;
    delete process.env.OBJECT_STORAGE_PROVIDER;
    const mockResult = ingestStoredObject(input);
    assert.equal(mockResult.provider, "mock", "mock mode should use the mock storage provider");
    assert.equal(mockResult.url, input.sourceUrl, "mock ingest should preserve the source URL for local preview");
    assert.equal(mockResult.storageKey, input.storageKey, "mock ingest should preserve the production-shaped storage key");
    assert.equal(mockResult.copied, true, "mock ingest should return a copied result");

    process.env.CUTPILOT_RUNTIME_MODE = "production";
    process.env.OBJECT_STORAGE_PROVIDER = "r2";
    assert.throws(
      () => ingestStoredObject(input),
      (error) => error instanceof ObjectStorageUnavailableError && error.message.includes("ingest"),
      "production R2 ingest should fail closed until the live ingest adapter is implemented"
    );

    process.env.R2_ACCOUNT_ID = "account123";
    process.env.R2_ACCESS_KEY_ID = "accesskey123";
    process.env.R2_SECRET_ACCESS_KEY = "secretkey1234";
    process.env.R2_BUCKET = "cutpilot-prod";
    const readiness = getRuntimeReadiness();
    assert.ok(
      readiness.checks.some(
        (check) => check.id === "object_storage" && check.status === "fail" && check.detail.includes("ingest/delete adapters")
      ),
      "production readiness should fail object storage until live ingest/delete adapters exist"
    );
  } finally {
    if (typeof originalRuntimeMode === "undefined") delete process.env.CUTPILOT_RUNTIME_MODE;
    else process.env.CUTPILOT_RUNTIME_MODE = originalRuntimeMode;
    if (typeof originalProvider === "undefined") delete process.env.OBJECT_STORAGE_PROVIDER;
    else process.env.OBJECT_STORAGE_PROVIDER = originalProvider;
    if (typeof originalR2Account === "undefined") delete process.env.R2_ACCOUNT_ID;
    else process.env.R2_ACCOUNT_ID = originalR2Account;
    if (typeof originalR2Access === "undefined") delete process.env.R2_ACCESS_KEY_ID;
    else process.env.R2_ACCESS_KEY_ID = originalR2Access;
    if (typeof originalR2Secret === "undefined") delete process.env.R2_SECRET_ACCESS_KEY;
    else process.env.R2_SECRET_ACCESS_KEY = originalR2Secret;
    if (typeof originalR2Bucket === "undefined") delete process.env.R2_BUCKET;
    else process.env.R2_BUCKET = originalR2Bucket;
  }

  console.log("object-storage-ingest-boundary.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
