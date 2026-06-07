import type { GenerationJob, ImageJob, JobStatus, RenderJob, StudioState, WorkerDispatchItem, WorkerDispatchKind, WorkerDispatchSnapshot } from "../domain/types";
import { buildImageWorkerInvocation } from "./image-worker-invocation";
import { getMockState } from "./mock-service";
import { buildProviderInvocation } from "./provider-invocation";
import { buildRenderWorkerInvocation } from "./render-worker-invocation";

function active(status: JobStatus): status is "queued" | "running" {
  return status === "queued" || status === "running";
}

function kindOrder(kind: WorkerDispatchKind) {
  if (kind === "provider_generation") return 0;
  if (kind === "image_generation") return 1;
  return 2;
}

function baseItem(input: {
  kind: WorkerDispatchKind;
  job: Pick<GenerationJob | ImageJob | RenderJob, "id" | "projectId" | "status" | "stage" | "etaSec" | "createdAt" | "updatedAt" | "dueAt">;
  invocation: WorkerDispatchItem["invocation"];
}): Omit<WorkerDispatchItem, "priority"> {
  if (!active(input.job.status)) {
    throw new Error("Worker dispatch items can only be built for active jobs.");
  }
  return {
    dispatchKey: `${input.kind}:${input.job.id}`,
    kind: input.kind,
    jobId: input.job.id,
    projectId: input.job.projectId,
    status: input.job.status,
    stage: input.job.stage,
    etaSec: input.job.etaSec,
    queuedAt: input.job.createdAt,
    updatedAt: input.job.updatedAt,
    dueAt: input.job.dueAt,
    cancelable: true,
    invocation: input.invocation
  };
}

function generationItem(job: GenerationJob) {
  return baseItem({ kind: "provider_generation", job, invocation: buildProviderInvocation(job) });
}

function imageItem(job: ImageJob) {
  return baseItem({ kind: "image_generation", job, invocation: buildImageWorkerInvocation(job) });
}

function renderItem(job: RenderJob) {
  return baseItem({ kind: "render", job, invocation: buildRenderWorkerInvocation(job) });
}

export function buildWorkerDispatchSnapshot(current: StudioState): WorkerDispatchSnapshot {
  const now = Date.now();
  const items = [
    ...current.generationJobs.filter((job) => active(job.status)).map(generationItem),
    ...current.imageJobs.filter((job) => active(job.status)).map(imageItem),
    ...current.renderJobs.filter((job) => active(job.status)).map(renderItem)
  ]
    .sort((a, b) => {
      if (a.dueAt !== b.dueAt) return a.dueAt - b.dueAt;
      return kindOrder(a.kind) - kindOrder(b.kind);
    })
    .map((item, index) => ({ ...item, priority: index + 1 }));

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      total: items.length,
      providerGeneration: items.filter((item) => item.kind === "provider_generation").length,
      imageGeneration: items.filter((item) => item.kind === "image_generation").length,
      render: items.filter((item) => item.kind === "render").length,
      queued: items.filter((item) => item.status === "queued").length,
      running: items.filter((item) => item.status === "running").length,
      overdue: items.filter((item) => item.dueAt < now).length,
      nextDueAt: items.length ? Math.min(...items.map((item) => item.dueAt)) : null
    },
    items
  };
}

export function getWorkerDispatchSnapshot() {
  return buildWorkerDispatchSnapshot(getMockState());
}
