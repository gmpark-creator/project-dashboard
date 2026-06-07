import type { RenderJob, RenderWorkerInvocation } from "../domain/types";

function outputStorageKey(job: RenderJob) {
  return `projects/${job.projectId}/renderJob/${job.id}/render_output`;
}

export function buildRenderWorkerInvocation(job: RenderJob): RenderWorkerInvocation {
  return {
    jobId: job.id,
    projectId: job.projectId,
    sourceHash: job.renderPlan.sourceHash,
    spec: job.spec,
    inputs: job.renderPlan.shots
      .filter((shot) => Boolean(shot.videoUrl))
      .map((shot) => ({
        shotId: shot.shotId,
        takeId: shot.takeId,
        order: shot.order,
        title: shot.title,
        durationSec: shot.durationSec,
        videoUrl: shot.videoUrl || "",
        posterUrl: shot.posterUrl
      })),
    missingShotIds: [...job.renderPlan.missingShotIds],
    edit: job.renderPlan.edit,
    output: {
      role: "render_output",
      container: "mp4",
      storageKey: outputStorageKey(job),
      shareUrlRequired: true
    },
    policy: {
      missingShotPolicy: "skip_with_notice",
      burnCaptions: job.spec.caption === "burn-in" || job.spec.caption === "both",
      emitSrt: job.spec.caption === "srt" || job.spec.caption === "both",
      audioMix: job.renderPlan.edit.bgm.enabled,
      voiceover: job.renderPlan.edit.voiceover.enabled,
      transitions: job.renderPlan.edit.transitions
    }
  };
}

export function buildRenderWorkerInvocations(jobs: RenderJob[]) {
  return jobs.map((job) => buildRenderWorkerInvocation(job));
}
