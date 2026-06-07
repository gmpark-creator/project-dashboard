import type { GenerationJob, ImageJob, QueueJobSnapshot, RenderJob, WorkerCompletionReceipt, WorkerRetryAction, WorkerRetryExecutionResult, WorkerRetryPlan, WorkerRetryPlanItem } from "../domain/types";
import { createImageJob, generateShot, getMockState, startRender } from "./mock-service";
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

export function executeWorkerRetry(sourceJobId: string): WorkerRetryExecutionResult {
  const item = getWorkerRetryPlan().items.find((candidate) => candidate.receipt.jobId === sourceJobId);
  if (!item) return { sourceJobId, executed: false, action: null, replacement: null, reason: "not_found" };
  if (!item.retryable) return { sourceJobId, executed: false, action: item.action, replacement: null, reason: "not_retryable" };

  try {
    const current = getMockState();
    if (item.action === "retry_image_generation") {
      const source = current.imageJobs.find((job) => job.id === sourceJobId);
      if (!source) return { sourceJobId, executed: false, action: item.action, replacement: null, reason: "not_found" };
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
      return { sourceJobId, executed: true, action: item.action, replacement: imageSnapshot(retry.job), reason: "executed" };
    }
    if (item.action === "retry_provider_generation") {
      const source = current.generationJobs.find((job) => job.id === sourceJobId);
      if (!source) return { sourceJobId, executed: false, action: item.action, replacement: null, reason: "not_found" };
      const retry = generateShot(source.shotId, { tier: source.promptPackage.requirements.tier, takeCount: 1, retryOfJobId: source.id });
      return { sourceJobId, executed: true, action: item.action, replacement: generationSnapshot(retry.jobs[0]), reason: "executed" };
    }
    if (item.action === "retry_render") {
      const source = current.renderJobs.find((job) => job.id === sourceJobId);
      if (!source) return { sourceJobId, executed: false, action: item.action, replacement: null, reason: "not_found" };
      const retry = startRender(source.projectId, [source.spec], { retryOfJobId: source.id });
      return { sourceJobId, executed: true, action: item.action, replacement: renderSnapshot(retry.jobs[0]), reason: "executed" };
    }
    return { sourceJobId, executed: false, action: item.action, replacement: null, reason: "unsupported_action" };
  } catch {
    return { sourceJobId, executed: false, action: item.action, replacement: null, reason: "retry_failed" };
  }
}
