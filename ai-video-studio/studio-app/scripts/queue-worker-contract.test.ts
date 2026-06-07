import assert from "node:assert/strict";
import { buildQueueWorkerEnvelope, queueWorkerContractVersion, validateQueueWorkerEnvelope } from "../src/server/queue-worker-contract";
import { buildWorkerDispatchSnapshot } from "../src/server/worker-dispatch";
import { createProject, generateShot, getMockState, getProjectBundle, resetMockState } from "../src/server/mock-service";

async function main() {
  resetMockState();
  const project = createProject({
    title: "Queue worker contract",
    idea: "Create provider work for queue message validation",
    intent: "product_ad"
  });
  const bundle = getProjectBundle(project.id);
  const shot = bundle?.shots[0];
  assert.ok(shot, "queue worker setup should create a shot");
  generateShot(shot.id, { takeCount: 1 });

  const dispatch = buildWorkerDispatchSnapshot(getMockState());
  const item = dispatch.items.find((candidate) => candidate.kind === "provider_generation");
  assert.ok(item, "queue worker setup should expose provider generation work");

  const envelope = buildQueueWorkerEnvelope(item, { messageId: "qmsg_provider_generation_1", ttlSec: 45, renewBeforeSec: 10 });
  assert.equal(envelope.contractVersion, queueWorkerContractVersion, "queue envelope should include the stable contract version");
  assert.equal(envelope.dedupeKey, item.dispatchKey, "queue envelope should use dispatch key as dedupe key");
  assert.equal(envelope.lease.required, true, "queue envelope should require worker lease handling");
  assert.deepEqual(validateQueueWorkerEnvelope(envelope), [], "queue envelope should validate");

  const invalid = {
    ...envelope,
    dedupeKey: "wrong",
    lease: { ...envelope.lease, renewBeforeSec: envelope.lease.ttlSec }
  };
  assert.ok(validateQueueWorkerEnvelope(invalid).includes("dedupeKey"), "queue validator should reject mismatched dedupe keys");
  assert.ok(validateQueueWorkerEnvelope(invalid).includes("lease.renewBeforeSec"), "queue validator should reject invalid renew timing");

  resetMockState();
  console.log("queue-worker-contract.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
