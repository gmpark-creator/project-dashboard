import type { ImageJob, JobQueueSnapshot, JobStatus, QueueJobKind, QueueJobSnapshot, RenderJob, GenerationJob, StudioState } from "../domain/types";
import { getMockState } from "./mock-service";

function active(status: JobStatus) {
  return status === "queued" || status === "running";
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
    cancelable: active(job.status)
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
    cancelable: active(job.status)
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
    cancelable: active(job.status)
  };
}

function kindOrder(kind: QueueJobKind) {
  return kind === "generation" ? 0 : kind === "image" ? 1 : 2;
}

export function buildJobQueueSnapshot(current: StudioState): JobQueueSnapshot {
  const generatedAt = new Date().toISOString();
  const now = Date.now();
  const jobs = [
    ...current.generationJobs.map(generationSnapshot),
    ...current.imageJobs.map(imageSnapshot),
    ...current.renderJobs.map(renderSnapshot)
  ].sort((a, b) => {
    if (a.status !== b.status) return active(a.status) === active(b.status) ? 0 : active(a.status) ? -1 : 1;
    if (a.dueAt !== b.dueAt) return a.dueAt - b.dueAt;
    return kindOrder(a.kind) - kindOrder(b.kind);
  });

  const activeJobs = jobs.filter((job) => active(job.status));

  return {
    generatedAt,
    summary: {
      total: jobs.length,
      queued: jobs.filter((job) => job.status === "queued").length,
      running: jobs.filter((job) => job.status === "running").length,
      done: jobs.filter((job) => job.status === "done").length,
      failed: jobs.filter((job) => job.status === "failed").length,
      cancelled: jobs.filter((job) => job.status === "cancelled").length,
      active: activeJobs.length,
      overdue: activeJobs.filter((job) => job.dueAt < now).length,
      cancelable: jobs.filter((job) => job.cancelable).length,
      nextDueAt: activeJobs.length ? Math.min(...activeJobs.map((job) => job.dueAt)) : null
    },
    jobs
  };
}

export function getJobQueueSnapshot() {
  return buildJobQueueSnapshot(getMockState());
}
