import { randomUUID } from "node:crypto";
import type { StudioState, WorkerDispatchKind, WorkerLease, WorkerLeaseCompletionInput, WorkerLeaseCompletionResult, WorkerLeaseReleaseResult, WorkerLeaseRenewResult, WorkerLeaseRequest, WorkerLeaseResult, WorkerLeaseSnapshot } from "../domain/types";
import { completeLeasedWorkerJob, getMutableMockState, saveMockState } from "./mock-service";
import { buildWorkerCompletionSnapshot } from "./worker-completions";
import { buildWorkerDispatchSnapshot } from "./worker-dispatch";

const DEFAULT_TTL_SEC = 60;
const MAX_TTL_SEC = 600;

function uid() {
  return `wlease_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function clampTtl(ttlSec: number | undefined) {
  return Math.max(5, Math.min(ttlSec || DEFAULT_TTL_SEC, MAX_TTL_SEC));
}

function expireLeases(current: StudioState, now = Date.now()) {
  let changed = false;
  for (const lease of current.workerLeases) {
    if (lease.status === "active" && new Date(lease.expiresAt).getTime() <= now) {
      lease.status = "expired";
      changed = true;
    }
  }
  return changed;
}

function activeDispatchKeys(current: StudioState) {
  return new Set(current.workerLeases.filter((lease) => lease.status === "active").map((lease) => lease.dispatchKey));
}

function workerKind(input: WorkerLeaseRequest["kind"]): WorkerDispatchKind | null {
  if (!input || input === "any") return null;
  return input;
}

function normalizeRequest(input: Partial<WorkerLeaseRequest> = {}): WorkerLeaseRequest {
  return {
    workerId: input.workerId?.trim() || "mock-worker",
    kind: input.kind || "any",
    ttlSec: clampTtl(input.ttlSec)
  };
}

export function createWorkerLease(input: Partial<WorkerLeaseRequest> = {}): WorkerLeaseResult {
  const current = getMutableMockState();
  expireLeases(current);
  const request = normalizeRequest(input);
  const requestedKind = workerKind(request.kind);
  const leasedKeys = activeDispatchKeys(current);
  const item = buildWorkerDispatchSnapshot(current).items.find((candidate) => {
    if (requestedKind && candidate.kind !== requestedKind) return false;
    return !leasedKeys.has(candidate.dispatchKey);
  });

  if (!item) {
    saveMockState(current);
    return { lease: null, item: null, reason: "no_available_work" };
  }

  const leasedAt = new Date();
  const lease: WorkerLease = {
    id: uid(),
    token: randomUUID(),
    dispatchKey: item.dispatchKey,
    kind: item.kind,
    jobId: item.jobId,
    projectId: item.projectId,
    workerId: request.workerId,
    status: "active",
    leasedAt: leasedAt.toISOString(),
    expiresAt: new Date(leasedAt.getTime() + clampTtl(request.ttlSec) * 1000).toISOString(),
    releasedAt: null
  };
  current.workerLeases.unshift(lease);
  saveMockState(current);
  return { lease, item, reason: "leased" };
}

export function releaseWorkerLease(leaseId: string, token: string | null | undefined): WorkerLeaseReleaseResult {
  const current = getMutableMockState();
  expireLeases(current);
  const lease = current.workerLeases.find((item) => item.id === leaseId);
  if (!lease) {
    saveMockState(current);
    return { leaseId, released: false, status: null, reason: "not_found" };
  }
  if (lease.token !== token) {
    saveMockState(current);
    return { leaseId, released: false, status: lease.status, reason: "token_mismatch" };
  }
  if (lease.status !== "active") {
    saveMockState(current);
    return { leaseId, released: false, status: lease.status, reason: "not_active" };
  }
  lease.status = "released";
  lease.releasedAt = new Date().toISOString();
  saveMockState(current);
  return { leaseId, released: true, status: lease.status, reason: "released" };
}

export function renewWorkerLease(leaseId: string, input: { token?: string | null; ttlSec?: number } = {}): WorkerLeaseRenewResult {
  const current = getMutableMockState();
  expireLeases(current);
  const lease = current.workerLeases.find((item) => item.id === leaseId);
  if (!lease) {
    saveMockState(current);
    return { leaseId, renewed: false, lease: null, status: null, reason: "not_found" };
  }
  if (lease.token !== input.token) {
    saveMockState(current);
    return { leaseId, renewed: false, lease, status: lease.status, reason: "token_mismatch" };
  }
  if (lease.status !== "active") {
    saveMockState(current);
    return { leaseId, renewed: false, lease, status: lease.status, reason: "not_active" };
  }
  lease.expiresAt = new Date(Date.now() + clampTtl(input.ttlSec) * 1000).toISOString();
  saveMockState(current);
  return { leaseId, renewed: true, lease, status: lease.status, reason: "renewed" };
}

export function completeWorkerLease(leaseId: string, input: Partial<WorkerLeaseCompletionInput> = {}): WorkerLeaseCompletionResult {
  const current = getMutableMockState();
  expireLeases(current);
  const lease = current.workerLeases.find((item) => item.id === leaseId);
  if (!lease) {
    saveMockState(current);
    return { leaseId, completed: false, lease: null, receipt: null, reason: "not_found" };
  }
  if (lease.token !== input.token) {
    saveMockState(current);
    return { leaseId, completed: false, lease, receipt: null, reason: "token_mismatch" };
  }
  if (lease.status !== "active") {
    saveMockState(current);
    return { leaseId, completed: false, lease, receipt: null, reason: "not_active" };
  }
  const status = input.status;
  if (status !== "succeeded" && status !== "failed") {
    saveMockState(current);
    return { leaseId, completed: false, lease, receipt: null, reason: "unsupported_status" };
  }
  const completion = completeLeasedWorkerJob(current, lease, { token: input.token, status, error: input.error });
  if (completion !== "completed") {
    saveMockState(current);
    return { leaseId, completed: false, lease, receipt: null, reason: completion };
  }
  lease.status = "released";
  lease.releasedAt = new Date().toISOString();
  const receipt =
    buildWorkerCompletionSnapshot(current).receipts.find((item) => item.kind === lease.kind && item.jobId === lease.jobId) || null;
  saveMockState(current);
  return { leaseId, completed: true, lease, receipt, reason: "completed" };
}

export function getWorkerLeaseSnapshot(): WorkerLeaseSnapshot {
  const current = getMutableMockState();
  const changed = expireLeases(current);
  if (changed) saveMockState(current);
  const leases = [...current.workerLeases].sort((a, b) => b.leasedAt.localeCompare(a.leasedAt));
  return {
    generatedAt: new Date().toISOString(),
    summary: {
      total: leases.length,
      active: leases.filter((lease) => lease.status === "active").length,
      released: leases.filter((lease) => lease.status === "released").length,
      expired: leases.filter((lease) => lease.status === "expired").length
    },
    leases
  };
}
