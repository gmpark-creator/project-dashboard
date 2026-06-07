import assert from "node:assert/strict";
import {
  deleteStoredObject,
  ingestStoredObject,
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
  const originalFetch = globalThis.fetch;
  try {
    delete process.env.CUTPILOT_RUNTIME_MODE;
    delete process.env.OBJECT_STORAGE_PROVIDER;
    const mockDelete = await deleteStoredObject(input.storageKey);
    assert.equal(mockDelete.provider, "mock", "mock mode should use the mock storage provider for deletes");
    assert.equal(mockDelete.storageKey, input.storageKey, "mock delete should preserve the production-shaped storage key");
    const mockResult = await ingestStoredObject(input);
    assert.equal(mockResult.provider, "mock", "mock mode should use the mock storage provider");
    assert.equal(mockResult.url, input.sourceUrl, "mock ingest should preserve the source URL for local preview");
    assert.equal(mockResult.storageKey, input.storageKey, "mock ingest should preserve the production-shaped storage key");
    assert.equal(mockResult.copied, true, "mock ingest should return a copied result");

    process.env.CUTPILOT_RUNTIME_MODE = "production";
    process.env.OBJECT_STORAGE_PROVIDER = "r2";
    process.env.R2_ACCOUNT_ID = "account123";
    process.env.R2_ACCESS_KEY_ID = "accesskey123";
    process.env.R2_SECRET_ACCESS_KEY = "secretkey1234";
    process.env.R2_BUCKET = "cutpilot-prod";
    let capturedUrl = "";
    let capturedHeaders: Record<string, string> = {};
    globalThis.fetch = (async (url, init) => {
      capturedUrl = String(url);
      capturedHeaders = init?.headers as Record<string, string>;
      return new Response(null, { status: 204 });
    }) as typeof fetch;
    const r2Delete = await deleteStoredObject(input.storageKey);
    assert.equal(r2Delete.provider, "r2", "production R2 delete should use the live R2 provider");
    assert.equal(r2Delete.storageKey, input.storageKey, "production R2 delete should preserve the storage key");
    assert.ok(capturedUrl.includes("https://account123.r2.cloudflarestorage.com/cutpilot-prod/projects/prj_test/take/take_test/take_video"), "production R2 delete should use path-style R2 object URLs");
    assert.equal(capturedHeaders["x-amz-content-sha256"], "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "production R2 delete should sign the empty payload hash");
    assert.ok(capturedHeaders.Authorization.startsWith("AWS4-HMAC-SHA256 "), "production R2 delete should attach SigV4 authorization");

    const calls: Array<{ url: string; init?: RequestInit }> = [];
    globalThis.fetch = (async (url, init) => {
      calls.push({ url: String(url), init });
      if (!init) return new Response(Buffer.from("video-bytes"), { status: 200 });
      return new Response(null, { status: 200 });
    }) as typeof fetch;
    const r2Ingest = await ingestStoredObject(input);
    const sourceCall = calls[0];
    const putCall = calls[1];
    const putHeaders = putCall?.init?.headers as Record<string, string>;
    assert.equal(sourceCall?.url, input.sourceUrl, "production R2 ingest should fetch the provider source URL first");
    assert.ok(putCall?.url.includes("https://account123.r2.cloudflarestorage.com/cutpilot-prod/projects/prj_test/take/take_test/take_video"), "production R2 ingest should PUT to the configured R2 object URL");
    assert.equal(putCall?.init?.method, "PUT", "production R2 ingest should write objects with PUT");
    assert.equal(putHeaders["Content-Type"], input.contentType, "production R2 ingest should preserve the expected content type");
    assert.ok(putHeaders.Authorization.includes("SignedHeaders=content-type;host;x-amz-content-sha256;x-amz-date"), "production R2 ingest should sign the content type and payload headers");
    assert.equal(r2Ingest.provider, "r2", "production R2 ingest should use the live R2 provider");
    assert.equal(r2Ingest.bytes, input.bytes, "production R2 ingest should preserve explicit byte counts");
    assert.equal(r2Ingest.copied, true, "production R2 ingest should report copied objects");

    const readiness = getRuntimeReadiness();
    assert.ok(
      readiness.checks.some(
        (check) => check.id === "object_storage" && check.status === "pass" && check.detail.includes("live ingest and deletion")
      ),
      "production readiness should pass object storage when R2 env is valid"
    );
  } finally {
    globalThis.fetch = originalFetch;
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
