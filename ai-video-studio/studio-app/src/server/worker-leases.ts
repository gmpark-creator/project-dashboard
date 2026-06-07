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

function validUrl(value: string | undefined) {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:" || parsed.protocol === "data:" || parsed.protocol === "mock:";
  } catch {
    return false;
  }
}

function hasInvalidProvidedOutput(input: Partial<WorkerLeaseCompletionInput>) {
  const output = input.outputs;
  if (!output) return false;
  if (output.videoUrl && !validUrl(output.videoUrl)) return true;
  if (output.posterUrl && !validUrl(output.posterUrl)) return true;
  if (output.renderOutputUrl && !validUrl(output.renderOutputUrl)) return true;
  if (output.shareUrl && !validUrl(output.shareUrl)) return true;
  return Boolean(output.imageVariants?.some((variant) => !validUrl(variant.imageUrl) || (variant.thumbUrl ? !validUrl(variant.thumbUrl) : false)));
}

function suppliedStorageKeyMatches(value: string | undefined, expected: string | null) {
  if (typeof value === "undefined") return true;
  return typeof value === "string" && value.length > 0 && value === expected;
}

function hasTopLevelStorageKeys(output: NonNullable<WorkerLeaseCompletionInput["outputs"]>) {
  return Boolean(output.videoStorageKey || output.posterStorageKey || output.renderStorageKey);
}

function hasImageVariantStorageKeys(output: NonNullable<WorkerLeaseCompletionInput["outputs"]>) {
  return Boolean(output.imageVariants?.some((variant) => variant.imageStorageKey || variant.thumbnailStorageKey));
}

function takeStorageKey(projectId: string, takeId: string, role: "take_video" | "take_poster") {
  return `projects/${projectId}/take/${takeId}/${role}`;
}

function renderStorageKey(projectId: string, jobId: string) {
  return `projects/${projectId}/renderJob/${jobId}/render_output`;
}

function imageVariantStorageKey(projectId: string, jobId: string, variantId: string, role: "image_asset" | "image_thumbnail") {
  return `projects/${projectId}/imageJob/${jobId}/variants/${variantId}/${role}`;
}

function expectedImageVariantForOutput(current: StudioState, lease: WorkerLease, variantId: string | undefined, index: number) {
  const job = current.imageJobs.find((item) => item.id === lease.jobId);
  if (!job) return null;
  return (variantId ? job.variants.find((variant) => variant.id === variantId) : null) || job.variants[index] || null;
}

function hasInvalidImageStorageKeys(current: StudioState, lease: WorkerLease, output: NonNullable<WorkerLeaseCompletionInput["outputs"]>) {
  if (hasTopLevelStorageKeys(output)) return true;
  return Boolean(
    output.imageVariants?.some((variant, index) => {
      if (!variant.imageStorageKey && !variant.thumbnailStorageKey) return false;
      const expectedVariant = expectedImageVariantForOutput(current, lease, variant.variantId, index);
      if (!expectedVariant) return true;
      return (
        !suppliedStorageKeyMatches(variant.imageStorageKey, imageVariantStorageKey(lease.projectId, lease.jobId, expectedVariant.id, "image_asset")) ||
        !suppliedStorageKeyMatches(variant.thumbnailStorageKey, imageVariantStorageKey(lease.projectId, lease.jobId, expectedVariant.id, "image_thumbnail"))
      );
    })
  );
}

function hasInvalidProviderStorageKeys(current: StudioState, lease: WorkerLease, output: NonNullable<WorkerLeaseCompletionInput["outputs"]>) {
  if (output.renderStorageKey || hasImageVariantStorageKeys(output)) return true;
  const job = current.generationJobs.find((item) => item.id === lease.jobId);
  if (!job && (output.videoStorageKey || output.posterStorageKey)) return true;
  return (
    !suppliedStorageKeyMatches(output.videoStorageKey, job ? takeStorageKey(job.projectId, job.takeId, "take_video") : null) ||
    !suppliedStorageKeyMatches(output.posterStorageKey, job ? takeStorageKey(job.projectId, job.takeId, "take_poster") : null)
  );
}

function hasInvalidRenderStorageKeys(current: StudioState, lease: WorkerLease, output: NonNullable<WorkerLeaseCompletionInput["outputs"]>) {
  if (output.videoStorageKey || output.posterStorageKey || hasImageVariantStorageKeys(output)) return true;
  const job = current.renderJobs.find((item) => item.id === lease.jobId);
  if (!job && output.renderStorageKey) return true;
  return !suppliedStorageKeyMatches(output.renderStorageKey, job ? renderStorageKey(job.projectId, job.id) : null);
}

function hasInvalidProvidedStorageKeys(current: StudioState, lease: WorkerLease, input: Partial<WorkerLeaseCompletionInput>) {
  const output = input.outputs;
  if (!output) return false;
  if (lease.kind === "image_generation") return hasInvalidImageStorageKeys(current, lease, output);
  if (lease.kind === "provider_generation") return hasInvalidProviderStorageKeys(current, lease, output);
  return hasInvalidRenderStorageKeys(current, lease, output);
}

function imageOutputCoversAllVariants(current: StudioState, lease: WorkerLease, input: Partial<WorkerLeaseCompletionInput>) {
  const job = current.imageJobs.find((item) => item.id === lease.jobId);
  const variants = input.outputs?.imageVariants || [];
  if (!job || !variants.length) return false;
  const coveredVariantIds = new Set(
    variants
      .map((variant, index) => expectedImageVariantForOutput(current, lease, variant.variantId, index)?.id)
      .filter((variantId): variantId is string => Boolean(variantId))
  );
  return job.variants.every((variant) => coveredVariantIds.has(variant.id));
}

function validRequiredOutput(current: StudioState, lease: WorkerLease, input: Partial<WorkerLeaseCompletionInput>) {
  if (hasInvalidProvidedOutput(input)) return false;
  if (hasInvalidProvidedStorageKeys(current, lease, input)) return false;
  const requireOutputs = input.requireOutputs === true || process.env.CUTPILOT_RUNTIME_MODE === "production";
  if (!requireOutputs) return true;
  const output = input.outputs;
  if (!output) return false;
  if (lease.kind === "image_generation") return imageOutputCoversAllVariants(current, lease, input);
  if (lease.kind === "provider_generation") return validUrl(output.videoUrl);
  return validUrl(output.renderOutputUrl) || validUrl(output.videoUrl);
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
  if (status === "succeeded" && !validRequiredOutput(current, lease, input)) {
    saveMockState(current);
    return { leaseId, completed: false, lease, receipt: null, reason: "invalid_outputs" };
  }
  const completion = completeLeasedWorkerJob(current, lease, { token: input.token, status, error: input.error, outputs: input.outputs });
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
