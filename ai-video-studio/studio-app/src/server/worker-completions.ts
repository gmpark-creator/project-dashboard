import type {
  CreditTransaction,
  ErrorResponse,
  GenerationJob,
  ImageJob,
  JobStatus,
  MediaArtifact,
  RenderJob,
  StudioState,
  WorkerCompletionReceipt,
  WorkerCompletionSnapshot,
  WorkerCompletionStatus,
  WorkerDispatchKind
} from "../domain/types";
import { getMockState } from "./mock-service";

type TerminalJob = GenerationJob | ImageJob | RenderJob;
type CompletionSource = Pick<StudioState, "generationJobs" | "imageJobs" | "renderJobs" | "mediaArtifacts" | "creditTransactions">;

function terminal(status: JobStatus) {
  return status === "done" || status === "failed" || status === "cancelled";
}

function completionStatus(status: JobStatus): WorkerCompletionStatus {
  if (status === "done") return "succeeded";
  if (status === "failed") return "failed";
  if (status === "cancelled") return "cancelled";
  throw new Error("Active jobs do not have completion receipts.");
}

function sumCredits(transactions: CreditTransaction[], kind: CreditTransaction["kind"]) {
  return transactions.filter((transaction) => transaction.kind === kind).reduce((total, transaction) => total + transaction.credits, 0);
}

function artifactsForJob(current: Pick<CompletionSource, "mediaArtifacts">, jobId: string): MediaArtifact[] {
  return current.mediaArtifacts.filter((artifact) => artifact.sourceJobId === jobId);
}

function transactionsForJob(current: Pick<CompletionSource, "creditTransactions">, jobId: string): CreditTransaction[] {
  return current.creditTransactions.filter((transaction) => transaction.jobId === jobId);
}

function buildReceipt(input: {
  kind: WorkerDispatchKind;
  job: TerminalJob;
  error: ErrorResponse | null;
  artifacts: MediaArtifact[];
  creditTransactions: CreditTransaction[];
}): WorkerCompletionReceipt {
  if (!terminal(input.job.status)) {
    throw new Error("Worker completion receipts can only be built for terminal jobs.");
  }
  const status = completionStatus(input.job.status);
  return {
    completionKey: `${input.kind}:${input.job.id}:${status}`,
    kind: input.kind,
    jobId: input.job.id,
    projectId: input.job.projectId,
    status,
    completedAt: input.job.updatedAt,
    error: input.error,
    artifacts: input.artifacts,
    creditTransactions: input.creditTransactions,
    summary: {
      artifactCount: input.artifacts.length,
      storedArtifacts: input.artifacts.filter((artifact) => artifact.status === "stored").length,
      externalArtifacts: input.artifacts.filter((artifact) => artifact.status === "external").length,
      capturedCredits: sumCredits(input.creditTransactions, "capture"),
      refundedCredits: sumCredits(input.creditTransactions, "refund")
    }
  };
}

function generationReceipt(current: CompletionSource, job: GenerationJob) {
  return buildReceipt({
    kind: "provider_generation",
    job,
    error: job.error,
    artifacts: artifactsForJob(current, job.id),
    creditTransactions: transactionsForJob(current, job.id)
  });
}

function imageReceipt(current: CompletionSource, job: ImageJob) {
  return buildReceipt({
    kind: "image_generation",
    job,
    error: job.error,
    artifacts: artifactsForJob(current, job.id),
    creditTransactions: transactionsForJob(current, job.id)
  });
}

function renderReceipt(current: CompletionSource, job: RenderJob) {
  return buildReceipt({
    kind: "render",
    job,
    error: job.error,
    artifacts: artifactsForJob(current, job.id),
    creditTransactions: transactionsForJob(current, job.id)
  });
}

export function buildWorkerCompletionSnapshot(current: StudioState): WorkerCompletionSnapshot {
  return buildWorkerCompletionSnapshotFromJobs({
    generationJobs: current.generationJobs,
    imageJobs: current.imageJobs,
    renderJobs: current.renderJobs,
    mediaArtifacts: current.mediaArtifacts,
    creditTransactions: current.creditTransactions
  });
}

export function buildWorkerCompletionSnapshotFromJobs(input: {
  generationJobs: GenerationJob[];
  imageJobs: ImageJob[];
  renderJobs: RenderJob[];
  mediaArtifacts: MediaArtifact[];
  creditTransactions: CreditTransaction[];
}): WorkerCompletionSnapshot {
  const current: CompletionSource = input;
  const receipts = [
    ...current.generationJobs.filter((job) => terminal(job.status)).map((job) => generationReceipt(current, job)),
    ...current.imageJobs.filter((job) => terminal(job.status)).map((job) => imageReceipt(current, job)),
    ...current.renderJobs.filter((job) => terminal(job.status)).map((job) => renderReceipt(current, job))
  ].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      total: receipts.length,
      succeeded: receipts.filter((receipt) => receipt.status === "succeeded").length,
      failed: receipts.filter((receipt) => receipt.status === "failed").length,
      cancelled: receipts.filter((receipt) => receipt.status === "cancelled").length,
      artifactCount: receipts.reduce((total, receipt) => total + receipt.summary.artifactCount, 0),
      capturedCredits: receipts.reduce((total, receipt) => total + receipt.summary.capturedCredits, 0),
      refundedCredits: receipts.reduce((total, receipt) => total + receipt.summary.refundedCredits, 0)
    },
    receipts
  };
}

export function getWorkerCompletionSnapshot() {
  return buildWorkerCompletionSnapshot(getMockState());
}
