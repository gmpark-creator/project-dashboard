import assert from "node:assert/strict";
import { buildProviderInvocation } from "../src/server/provider-invocation";
import {
  providerExecutionContractVersion,
  providerExecutionPending,
  providerExecutionSucceeded,
  providerExecutionUnavailable,
  validateProviderExecutionResult
} from "../src/server/provider-execution-contract";
import { createProject, generateShot, getProjectBundle, resetMockState } from "../src/server/mock-service";

async function main() {
  resetMockState();
  const project = createProject({
    title: "Provider execution contract",
    idea: "Generate a concise product teaser to validate provider execution shape",
    intent: "product_ad"
  });
  const bundle = getProjectBundle(project.id);
  const shot = bundle?.shots[0];
  assert.ok(shot, "provider execution setup should create at least one shot");
  const job = generateShot(shot.id, { takeCount: 1 }).jobs[0];
  assert.ok(job, "provider execution setup should create a generation job");

  const invocation = buildProviderInvocation(job);
  const submitted = providerExecutionPending(invocation, {
    status: "submitted",
    providerRequestId: "provider_req_123",
    retryAfterSec: 8
  });
  assert.equal(submitted.contractVersion, providerExecutionContractVersion, "pending result should include the stable contract version");
  assert.deepEqual(validateProviderExecutionResult(invocation, submitted), [], "pending provider result should validate");

  const succeeded = providerExecutionSucceeded(invocation, {
    providerRequestId: "provider_req_123",
    video: {
      sourceUrl: "https://provider.example/video.mp4",
      contentType: "video/mp4",
      bytes: 1024,
      expiresAt: "2026-06-07T12:00:00.000Z"
    },
    poster: {
      sourceUrl: "https://provider.example/poster.jpg",
      contentType: "image/jpeg",
      bytes: 256,
      expiresAt: "2026-06-07T12:00:00.000Z"
    },
    metadata: { providerLatencyMs: 1200 }
  });
  assert.deepEqual(validateProviderExecutionResult(invocation, succeeded), [], "successful provider result should validate");

  const unavailable = providerExecutionUnavailable(invocation);
  assert.equal(unavailable.status, "failed", "unavailable provider result should fail closed");
  assert.equal(unavailable.error.code, "PROVIDER_UNAVAILABLE", "unavailable provider result should expose a stable error code");
  assert.equal(unavailable.error.fallbackSuggested, true, "unavailable provider result should suggest fallback handling");
  assert.deepEqual(validateProviderExecutionResult(invocation, unavailable), [], "unavailable provider result should validate");

  const invalid = providerExecutionSucceeded(invocation, {
    providerRequestId: "provider_req_123",
    video: {
      sourceUrl: "",
      contentType: "video/mp4",
      bytes: null,
      expiresAt: null
    }
  });
  assert.ok(validateProviderExecutionResult(invocation, invalid).includes("video.sourceUrl"), "validator should reject empty provider video URLs");

  resetMockState();
  console.log("provider-execution-contract.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
