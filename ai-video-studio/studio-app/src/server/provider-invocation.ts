import type { GenerationJob, GenerationPromptPackage, GenerationReference, ProviderInvocation, ProviderInvocationInputKind } from "../domain/types";

function referenceUrl(references: GenerationReference[], assetId: string | null) {
  if (!assetId) return null;
  return references.find((reference) => reference.assetId === assetId)?.url || null;
}

function inputKind(promptPackage: GenerationPromptPackage): ProviderInvocationInputKind {
  if (promptPackage.routingHints.startFrameAssetId && promptPackage.routingHints.lastFrameAssetId) return "first_last_frames";
  if (promptPackage.requirements.imageToVideo && promptPackage.routingHints.startFrameAssetId) return "image";
  return "text";
}

function compact(parts: Array<string | null | undefined>) {
  return parts.map((part) => part?.trim()).filter((part): part is string => Boolean(part)).join("\n");
}

function rolePrompt(promptPackage: GenerationPromptPackage) {
  const { saec, directionSpec, requirements } = promptPackage;
  return compact([
    `Subject: ${saec.subject}`,
    `Action: ${saec.action}`,
    `Environment: ${saec.environment}`,
    `Camera: ${directionSpec.camera || saec.camera}`,
    `Composition: ${directionSpec.composition || saec.framing}`,
    `Lighting: ${directionSpec.lighting || saec.lighting}`,
    `Motion: ${directionSpec.motion}`,
    `Style: ${directionSpec.style || saec.style}`,
    requirements.characterLock && requirements.characterId ? `Maintain character continuity for ${requirements.characterId}.` : null,
    requirements.imageToVideo ? "Use the provided frame reference as the visual anchor." : null,
    directionSpec.notes ? `Notes: ${directionSpec.notes}` : null
  ]);
}

function negativePrompt(promptPackage: GenerationPromptPackage) {
  return compact([promptPackage.saec.negative, ...promptPackage.directionSpec.avoid]);
}

export function buildProviderInvocation(job: GenerationJob): ProviderInvocation {
  const promptPackage = job.promptPackage;
  return {
    jobId: job.id,
    takeId: job.takeId,
    projectId: job.projectId,
    shotId: job.shotId,
    provider: job.routing.selected.provider,
    model: job.routing.selected.model,
    routingRuleId: job.routing.ruleId,
    inputKind: inputKind(promptPackage),
    request: {
      prompt: rolePrompt(promptPackage),
      negativePrompt: negativePrompt(promptPackage),
      aspect: promptPackage.requirements.aspect,
      durationSec: promptPackage.durationSec,
      tier: promptPackage.requirements.tier,
      references: promptPackage.references.map((reference) => ({ ...reference })),
      startFrameUrl: referenceUrl(promptPackage.references, promptPackage.routingHints.startFrameAssetId),
      lastFrameUrl: referenceUrl(promptPackage.references, promptPackage.routingHints.lastFrameAssetId)
    },
    policy: {
      hiddenFromUser: job.routing.hiddenFromUser,
      fallbackEnabled: job.routing.fallbackEnabled,
      rightsReviewRequired: promptPackage.routingHints.rightsReviewRequired,
      storageIngestRequired: true
    },
    responseContract: {
      expectedKind: "video",
      outputRole: "take_video",
      ingest: "copy_to_storage",
      progress: "async_polling"
    }
  };
}

export function buildProviderInvocations(jobs: GenerationJob[]) {
  return jobs.map((job) => buildProviderInvocation(job));
}
