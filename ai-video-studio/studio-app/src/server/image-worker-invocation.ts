import type { ImageJob, ImageWorkerInvocation } from "../domain/types";

function outputStorageKey(job: ImageJob, variantId: string, role: "image_asset" | "image_thumbnail") {
  return `projects/${job.projectId}/imageJob/${job.id}/variants/${variantId}/${role}`;
}

export function buildImageWorkerInvocation(job: ImageJob): ImageWorkerInvocation {
  return {
    jobId: job.id,
    projectId: job.projectId,
    request: {
      prompt: job.prompt,
      purpose: job.purpose,
      role: job.role,
      aspect: job.aspect,
      style: job.style,
      count: job.count
    },
    outputs: job.variants.map((variant) => ({
      variantId: variant.id,
      label: variant.label,
      scoreLabel: variant.scoreLabel,
      imageStorageKey: outputStorageKey(job, variant.id, "image_asset"),
      thumbnailStorageKey: outputStorageKey(job, variant.id, "image_thumbnail")
    })),
    policy: {
      rightsStatus: "generated",
      registerAsAssets: true,
      storageIngestRequired: true
    },
    responseContract: {
      expectedKind: "image",
      outputRole: "image_asset",
      thumbnailRole: "image_thumbnail",
      ingest: "copy_to_storage",
      progress: "async_polling"
    }
  };
}

export function buildImageWorkerInvocations(jobs: ImageJob[]) {
  return jobs.map((job) => buildImageWorkerInvocation(job));
}
