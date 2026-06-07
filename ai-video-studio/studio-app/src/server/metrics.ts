import type { CreditTransaction, JobStatus, JobStatusCounts, ProjectStatus, StudioState, SystemMetrics } from "../domain/types";
import { getMockState } from "./mock-service";

function blankJobCounts(): JobStatusCounts {
  return {
    queued: 0,
    running: 0,
    done: 0,
    failed: 0,
    cancelled: 0
  };
}

function countJobs<T extends { status: JobStatus }>(jobs: T[]) {
  const counts = blankJobCounts();
  for (const job of jobs) counts[job.status] += 1;
  return counts;
}

function activeProject(status: ProjectStatus) {
  return status === "storyboarded" || status === "generating" || status === "reviewing" || status === "edited" || status === "rendering";
}

function creditTotal(transactions: CreditTransaction[], kind: CreditTransaction["kind"]) {
  return transactions.filter((transaction) => transaction.kind === kind).reduce((total, transaction) => total + transaction.credits, 0);
}

function providerCostUsd(transactions: CreditTransaction[]) {
  return Number(transactions.reduce((total, transaction) => total + (transaction.providerCostUsd || 0), 0).toFixed(2));
}

function marginPolicyVersions(transactions: CreditTransaction[]) {
  return [...new Set(transactions.map((transaction) => transaction.marginPolicyVersion).filter((version): version is string => Boolean(version)))].sort();
}

export function buildSystemMetrics(current: StudioState): SystemMetrics {
  const attempts = current.generationJobs.flatMap((job) => job.providerAttempts);
  const latencies = attempts
    .map((attempt) => attempt.latencyMs)
    .filter((latency): latency is number => typeof latency === "number");
  const avgLatencyMs = latencies.length ? Math.round(latencies.reduce((total, latency) => total + latency, 0) / latencies.length) : null;

  return {
    generatedAt: new Date().toISOString(),
    projects: {
      total: current.projects.length,
      active: current.projects.filter((project) => activeProject(project.status)).length,
      done: current.projects.filter((project) => project.status === "done").length,
      failed: current.projects.filter((project) => project.status === "failed").length
    },
    jobs: {
      generation: countJobs(current.generationJobs),
      image: countJobs(current.imageJobs),
      render: countJobs(current.renderJobs)
    },
    credits: {
      balance: current.credits.balance,
      spent: current.credits.spent,
      reserved: current.credits.reserved,
      available: Math.max(0, current.credits.balance - current.credits.spent - current.credits.reserved),
      captured: creditTotal(current.creditTransactions, "capture"),
      refunded: creditTotal(current.creditTransactions, "refund"),
      providerCostUsd: providerCostUsd(current.creditTransactions),
      marginPolicyVersions: marginPolicyVersions(current.creditTransactions)
    },
    providerAttempts: {
      total: attempts.length,
      succeeded: attempts.filter((attempt) => attempt.status === "succeeded").length,
      failed: attempts.filter((attempt) => attempt.status === "failed").length,
      cancelled: attempts.filter((attempt) => attempt.status === "cancelled").length,
      retryableFailures: attempts.filter((attempt) => attempt.status === "failed" && attempt.retryable).length,
      fallbackSuggested: attempts.filter((attempt) => attempt.fallbackSuggested).length,
      avgLatencyMs
    },
    mediaArtifacts: {
      total: current.mediaArtifacts.length,
      images: current.mediaArtifacts.filter((artifact) => artifact.kind === "image").length,
      videos: current.mediaArtifacts.filter((artifact) => artifact.kind === "video").length,
      external: current.mediaArtifacts.filter((artifact) => artifact.status === "external").length
    }
  };
}

export function getSystemMetrics() {
  return buildSystemMetrics(getMockState());
}
