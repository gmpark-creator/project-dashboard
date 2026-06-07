import type { MediaArtifact, MediaArtifactCleanup, MediaArtifactInventory, StudioState } from "../domain/types";
import { getMockState } from "./mock-service";

function projectTitle(current: StudioState, artifact: MediaArtifact) {
  return current.projects.find((project) => project.id === artifact.projectId)?.title || "Untitled project";
}

function ownerExists(current: StudioState, artifact: MediaArtifact) {
  if (artifact.ownerType === "imageAsset") return current.imageAssets.some((asset) => asset.id === artifact.ownerId);
  if (artifact.ownerType === "take") return current.takes.some((take) => take.id === artifact.ownerId);
  return current.renderJobs.some((job) => job.id === artifact.ownerId);
}

function imageAssetReferenceCount(current: StudioState, artifact: MediaArtifact) {
  const board = current.referenceBoards[artifact.projectId];
  const boardReferences =
    (board?.productImages.filter((id) => id === artifact.ownerId).length || 0) +
    (board?.characterImages.filter((id) => id === artifact.ownerId).length || 0) +
    (board?.locationImages.filter((id) => id === artifact.ownerId).length || 0) +
    (board?.styleImages.filter((id) => id === artifact.ownerId).length || 0) +
    (board?.keyframes.filter((id) => id === artifact.ownerId).length || 0) +
    (board?.thumbnails.filter((id) => id === artifact.ownerId).length || 0) +
    (board?.logos.filter((id) => id === artifact.ownerId).length || 0) +
    (board?.backgrounds.filter((id) => id === artifact.ownerId).length || 0) +
    (board?.usages.filter((usage) => usage.assetId === artifact.ownerId).length || 0);
  const shotReferences = current.shots.filter((shot) => shot.projectId === artifact.projectId && shot.referenceImageIds.includes(artifact.ownerId)).length;
  return boardReferences + shotReferences;
}

function takeReferenceCount(current: StudioState, artifact: MediaArtifact) {
  const selectedShots = current.shots.filter((shot) => shot.projectId === artifact.projectId && shot.selectedTakeId === artifact.ownerId).length;
  const renderPlanReferences = current.renderJobs.filter((job) => job.renderPlan.shots.some((shot) => shot.takeId === artifact.ownerId)).length;
  return selectedShots + renderPlanReferences;
}

function renderJobReferenceCount(current: StudioState, artifact: MediaArtifact) {
  const defaultVersion = current.projects.some((project) => project.defaultRenderJobId === artifact.ownerId) ? 1 : 0;
  const jobExists = current.renderJobs.some((job) => job.id === artifact.ownerId) ? 1 : 0;
  return defaultVersion + jobExists;
}

function referenceCount(current: StudioState, artifact: MediaArtifact) {
  if (artifact.ownerType === "imageAsset") return imageAssetReferenceCount(current, artifact);
  if (artifact.ownerType === "take") return takeReferenceCount(current, artifact);
  return renderJobReferenceCount(current, artifact);
}

function cleanupState(artifact: MediaArtifact, exists: boolean): MediaArtifactCleanup {
  if (!exists) return "orphaned";
  if (artifact.status === "external") return "review_external";
  return "retain";
}

export function buildMediaArtifactInventory(current: StudioState): MediaArtifactInventory {
  const artifacts = current.mediaArtifacts
    .map((artifact) => {
      const exists = ownerExists(current, artifact);
      const references = referenceCount(current, artifact);
      return {
        artifact,
        projectTitle: projectTitle(current, artifact),
        ownerExists: exists,
        referenced: exists && references > 0,
        referenceCount: references,
        cleanup: cleanupState(artifact, exists)
      };
    })
    .sort((a, b) => b.artifact.createdAt.localeCompare(a.artifact.createdAt));

  const knownBytes = artifacts.reduce((total, item) => total + (item.artifact.bytes || 0), 0);

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      total: artifacts.length,
      stored: artifacts.filter((item) => item.artifact.status === "stored").length,
      external: artifacts.filter((item) => item.artifact.status === "external").length,
      images: artifacts.filter((item) => item.artifact.kind === "image").length,
      videos: artifacts.filter((item) => item.artifact.kind === "video").length,
      knownBytes,
      unknownBytes: artifacts.filter((item) => item.artifact.bytes === null).length,
      orphaned: artifacts.filter((item) => item.cleanup === "orphaned").length,
      reviewExternal: artifacts.filter((item) => item.cleanup === "review_external").length
    },
    artifacts
  };
}

export function getMediaArtifactInventory() {
  return buildMediaArtifactInventory(getMockState());
}
