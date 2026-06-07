import type { WorkerDispatchItem, WorkerDispatchKind } from "../domain/types";

export const queueWorkerContractVersion = "queue_worker_v1";

export type QueueWorkerEnvelope = {
  contractVersion: typeof queueWorkerContractVersion;
  messageId: string;
  dedupeKey: string;
  dispatchKey: string;
  kind: WorkerDispatchKind;
  jobId: string;
  projectId: string;
  priority: number;
  dueAt: number;
  queuedAt: string;
  lease: {
    required: true;
    ttlSec: number;
    renewBeforeSec: number;
  };
  item: WorkerDispatchItem;
};

const DEFAULT_QUEUE_LEASE_TTL_SEC = 60;
const DEFAULT_RENEW_BEFORE_SEC = 15;

export function buildQueueWorkerEnvelope(
  item: WorkerDispatchItem,
  options: { messageId?: string; ttlSec?: number; renewBeforeSec?: number } = {}
): QueueWorkerEnvelope {
  const ttlSec = Math.max(5, Math.floor(options.ttlSec || DEFAULT_QUEUE_LEASE_TTL_SEC));
  const renewBeforeSec = Math.max(1, Math.min(Math.floor(options.renewBeforeSec || DEFAULT_RENEW_BEFORE_SEC), ttlSec - 1));
  return {
    contractVersion: queueWorkerContractVersion,
    messageId: options.messageId || `qmsg_${item.dispatchKey.replace(/[^A-Za-z0-9_-]/g, "_")}`,
    dedupeKey: item.dispatchKey,
    dispatchKey: item.dispatchKey,
    kind: item.kind,
    jobId: item.jobId,
    projectId: item.projectId,
    priority: item.priority,
    dueAt: item.dueAt,
    queuedAt: item.queuedAt,
    lease: {
      required: true,
      ttlSec,
      renewBeforeSec
    },
    item
  };
}

export function validateQueueWorkerEnvelope(envelope: QueueWorkerEnvelope) {
  const errors: string[] = [];
  if (envelope.contractVersion !== queueWorkerContractVersion) errors.push("contractVersion");
  if (!envelope.messageId.trim()) errors.push("messageId");
  if (envelope.dedupeKey !== envelope.dispatchKey) errors.push("dedupeKey");
  if (envelope.dispatchKey !== envelope.item.dispatchKey) errors.push("item.dispatchKey");
  if (envelope.kind !== envelope.item.kind) errors.push("kind");
  if (envelope.jobId !== envelope.item.jobId) errors.push("jobId");
  if (envelope.projectId !== envelope.item.projectId) errors.push("projectId");
  if (envelope.priority !== envelope.item.priority) errors.push("priority");
  if (envelope.dueAt !== envelope.item.dueAt) errors.push("dueAt");
  if (envelope.lease.required !== true) errors.push("lease.required");
  if (envelope.lease.ttlSec < 5) errors.push("lease.ttlSec");
  if (envelope.lease.renewBeforeSec <= 0 || envelope.lease.renewBeforeSec >= envelope.lease.ttlSec) errors.push("lease.renewBeforeSec");
  return errors;
}
