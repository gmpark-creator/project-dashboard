import type {
  GenerationJob,
  ImageJob,
  QueueJobKind,
  QueueJobSnapshot,
  RenderJob,
  StudioState,
  WorkerCompletionReceipt,
  WorkerRetryAction,
  WorkerRetryExecutionSnapshot,
  WorkerRetryExecutionResult,
  WorkerRetryPlan,
  WorkerRetryPlanItem,
  WorkerRetryRecord
} from "../domain/types";
import { createImageJob, generateShot, getMockState, getMutableMockState, saveMockState, startRender } from "./mock-service";
import { buildWorkerCompletionSnapshot } from "./worker-completions";

function retryAction(receipt: WorkerCompletionReceipt): WorkerRetryAction {
  if (!receipt.error?.retryable) return "hold";
  if (receipt.kind === "provider_generation") return "retry_provider_generation";
  if (receipt.kind === "image_generation") return "retry_image_generation";
  if (receipt.kind === "render") return "retry_render";
  return "hold";
}

function retryReason(receipt: WorkerCompletionReceipt, action: WorkerRetryAction) {
  if (action === "hold") {
    return receipt.error?.retryable ? "No retry action is configured for this worker kind." : "Completion error is not retryable.";
  }
  if (receipt.error?.fallbackSuggested) return "Retryable failure with fallback suggested.";
  return "Retryable failure.";
}

function planItem(receipt: WorkerCompletionReceipt): WorkerRetryPlanItem {
  const action = retryAction(receipt);
  return {
    receipt,
    action,
    retryable: action !== "hold",
    fallbackSuggested: Boolean(receipt.error?.fallbackSuggested),
    reason: retryReason(receipt, action)
  };
}

export function buildWorkerRetryPlan(receipts: WorkerCompletionReceipt[]): WorkerRetryPlan {
  const items = receipts
    .filter((receipt) => receipt.status === "failed")
    .map(planItem)
    .sort((a, b) => b.receipt.completedAt.localeCompare(a.receipt.completedAt));

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalFailed: items.length,
      retryable: items.filter((item) => item.retryable).length,
      hold: items.filter((item) => !item.retryable).length,
      providerGeneration: items.filter((item) => item.receipt.kind === "provider_generation").length,
      imageGeneration: items.filter((item) => item.receipt.kind === "image_generation").length,
      render: items.filter((item) => item.receipt.kind === "render").length
    },
    items
  };
}

export function getWorkerRetryPlan() {
  return buildWorkerRetryPlan(buildWorkerCompletionSnapshot(getMockState()).receipts);
}

function generationSnapshot(job: GenerationJob): QueueJobSnapshot {
  return {
    id: job.id,
    projectId: job.projectId,
    kind: "generation",
    status: job.status,
    stage: job.stage,
    progress: job.progress,
    etaSec: job.etaSec,
    queuedAt: job.createdAt,
    updatedAt: job.updatedAt,
    dueAt: job.dueAt,
    cancelable: job.status === "queued" || job.status === "running"
  };
}

function imageSnapshot(job: ImageJob): QueueJobSnapshot {
  return {
    id: job.id,
    projectId: job.projectId,
    kind: "image",
    status: job.status,
    stage: job.stage,
    progress: job.progress,
    etaSec: job.etaSec,
    queuedAt: job.createdAt,
    updatedAt: job.updatedAt,
    dueAt: job.dueAt,
    cancelable: job.status === "queued" || job.status === "running"
  };
}

function renderSnapshot(job: RenderJob): QueueJobSnapshot {
  return {
    id: job.id,
    projectId: job.projectId,
    kind: "render",
    status: job.status,
    stage: job.stage,
    progress: job.progress,
    etaSec: job.etaSec,
    queuedAt: job.createdAt,
    updatedAt: job.updatedAt,
    dueAt: job.dueAt,
    cancelable: job.status === "queued" || job.status === "running"
  };
}

function retryRecordId() {
  return `wretry_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function replacementSnapshot(current: StudioState, kind: QueueJobKind, jobId: string) {
  return replacementSnapshotFromJobs(
    {
      generationJobs: current.generationJobs,
      imageJobs: current.imageJobs,
      renderJobs: current.renderJobs
    },
    kind,
    jobId
  );
}

function replacementSnapshotFromJobs(
  current: Pick<StudioState, "generationJobs" | "imageJobs" | "renderJobs">,
  kind: QueueJobKind,
  jobId: string
) {
  if (kind === "image") {
    const job = current.imageJobs.find((candidate) => candidate.id === jobId);
    return job ? imageSnapshot(job) : null;
  }
  if (kind === "generation") {
    const job = current.generationJobs.find((candidate) => candidate.id === jobId);
    return job ? generationSnapshot(job) : null;
  }
  const job = current.renderJobs.find((candidate) => candidate.id === jobId);
  return job ? renderSnapshot(job) : null;
}

function alreadyExecutedResult(record: WorkerRetryRecord): WorkerRetryExecutionResult {
  const replacement = replacementSnapshot(getMockState(), record.replacementKind, record.replacementJobId);
  return {
    sourceJobId: record.sourceJobId,
    executed: Boolean(replacement),
    action: record.action,
    replacement,
    retryRecord: record,
    reason: replacement ? "already_executed" : "replacement_missing"
  };
}

function recordRetry(sourceJobId: string, action: WorkerRetryAction, replacement: QueueJobSnapshot) {
  const current = getMutableMockState();
  const existing = current.workerRetryRecords.find((record) => record.sourceJobId === sourceJobId);
  if (existing) return existing;

  const timestamp = new Date().toISOString();
  const record: WorkerRetryRecord = {
    id: retryRecordId(),
    sourceJobId,
    action,
    replacementJobId: replacement.id,
    replacementKind: replacement.kind,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  current.workerRetryRecords.unshift(record);
  saveMockState(current);
  return record;
}

export function getWorkerRetryExecutionSnapshot(): WorkerRetryExecutionSnapshot {
  const current = getMockState();
  const completionSnapshot = buildWorkerCompletionSnapshot(current);
  return buildWorkerRetryExecutionSnapshotFromRecords({
    records: current.workerRetryRecords,
    receipts: completionSnapshot.receipts,
    generationJobs: current.generationJobs,
    imageJobs: current.imageJobs,
    renderJobs: current.renderJobs
  });
}

export function buildWorkerRetryExecutionSnapshotFromRecords(input: {
  records: WorkerRetryRecord[];
  receipts: WorkerCompletionReceipt[];
  generationJobs: GenerationJob[];
  imageJobs: ImageJob[];
  renderJobs: RenderJob[];
}): WorkerRetryExecutionSnapshot {
  const items = [...input.records]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((record) => {
      const replacement = replacementSnapshotFromJobs(input, record.replacementKind, record.replacementJobId);
      return {
        record,
        sourceReceipt: input.receipts.find((receipt) => receipt.jobId === record.sourceJobId) || null,
        replacement,
        replacementMissing: !replacement
      };
    });

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      total: items.length,
      providerGeneration: items.filter((item) => item.record.action === "retry_provider_generation").length,
      imageGeneration: items.filter((item) => item.record.action === "retry_image_generation").length,
      render: items.filter((item) => item.record.action === "retry_render").length,
      withReplacement: items.filter((item) => item.replacement).length,
      missingReplacement: items.filter((item) => item.replacementMissing).length
    },
    items
  };
}

export function executeWorkerRetry(sourceJobId: string): WorkerRetryExecutionResult {
  const existingRecord = getMockState().workerRetryRecords.find((record) => record.sourceJobId === sourceJobId);
  if (existingRecord) return alreadyExecutedResult(existingRecord);

  const item = getWorkerRetryPlan().items.find((candidate) => candidate.receipt.jobId === sourceJobId);
  if (!item) return { sourceJobId, executed: false, action: null, replacement: null, retryRecord: null, reason: "not_found" };
  if (!item.retryable) return { sourceJobId, executed: false, action: item.action, replacement: null, retryRecord: null, reason: "not_retryable" };

  try {
    const current = getMockState();
    if (item.action === "retry_image_generation") {
      const source = current.imageJobs.find((job) => job.id === sourceJobId);
      if (!source) return { sourceJobId, executed: false, action: item.action, replacement: null, retryRecord: null, reason: "not_found" };
      const retry = createImageJob({
        projectId: source.projectId,
        prompt: source.prompt,
        purpose: source.purpose,
        role: source.role,
        aspect: source.aspect,
        style: source.style,
        count: source.count,
        retryOfJobId: source.id
      });
      const replacement = imageSnapshot(retry.job);
      const retryRecord = recordRetry(sourceJobId, item.action, replacement);
      return { sourceJobId, executed: true, action: item.action, replacement, retryRecord, reason: "executed" };
    }
    if (item.action === "retry_provider_generation") {
      const source = current.generationJobs.find((job) => job.id === sourceJobId);
      if (!source) return { sourceJobId, executed: false, action: item.action, replacement: null, retryRecord: null, reason: "not_found" };
      const retry = generateShot(source.shotId, { tier: source.promptPackage.requirements.tier, takeCount: 1, retryOfJobId: source.id });
      const replacement = generationSnapshot(retry.jobs[0]);
      const retryRecord = recordRetry(sourceJobId, item.action, replacement);
      return { sourceJobId, executed: true, action: item.action, replacement, retryRecord, reason: "executed" };
    }
    if (item.action === "retry_render") {
      const source = current.renderJobs.find((job) => job.id === sourceJobId);
      if (!source) return { sourceJobId, executed: false, action: item.action, replacement: null, retryRecord: null, reason: "not_found" };
      const retry = startRender(source.projectId, [source.spec], { retryOfJobId: source.id });
      const replacement = renderSnapshot(retry.jobs[0]);
      const retryRecord = recordRetry(sourceJobId, item.action, replacement);
      return { sourceJobId, executed: true, action: item.action, replacement, retryRecord, reason: "executed" };
    }
    return { sourceJobId, executed: false, action: item.action, replacement: null, retryRecord: null, reason: "unsupported_action" };
  } catch {
    return { sourceJobId, executed: false, action: item.action, replacement: null, retryRecord: null, reason: "retry_failed" };
  }
}
