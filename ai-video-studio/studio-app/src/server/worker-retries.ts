import type { WorkerCompletionReceipt, WorkerRetryAction, WorkerRetryPlan, WorkerRetryPlanItem } from "../domain/types";
import { getMockState } from "./mock-service";
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
