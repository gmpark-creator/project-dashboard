import type { MediaArtifactInventoryItem, StorageCleanupAction, StorageCleanupPlan, StorageCleanupPlanItem, StudioState } from "../domain/types";
import { buildMediaArtifactInventory } from "./artifact-inventory";
import { getMockState } from "./mock-service";

function actionFor(item: MediaArtifactInventoryItem): StorageCleanupAction {
  if (item.cleanup === "orphaned" && item.artifact.status === "stored") return "delete_object";
  if (item.cleanup === "review_external" || item.artifact.status === "external") return "review_external";
  return "retain";
}

function reasonFor(item: MediaArtifactInventoryItem, action: StorageCleanupAction) {
  if (action === "delete_object") return "Owner record is missing and artifact is managed app storage.";
  if (action === "review_external") return "Artifact points to external media or needs manual external storage review.";
  return "Owner exists or artifact is still referenced by the app.";
}

function planItem(item: MediaArtifactInventoryItem): StorageCleanupPlanItem {
  const action = actionFor(item);
  return {
    artifact: item.artifact,
    cleanup: item.cleanup,
    action,
    storageKey: item.artifact.storageKey,
    ownerExists: item.ownerExists,
    referenced: item.referenced,
    referenceCount: item.referenceCount,
    safeToDelete: action === "delete_object",
    reason: reasonFor(item, action)
  };
}

export function buildStorageCleanupPlan(current: StudioState): StorageCleanupPlan {
  const items = buildMediaArtifactInventory(current).artifacts.map(planItem);
  const deleteCandidates = items.filter((item) => item.action === "delete_object");

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      total: items.length,
      retain: items.filter((item) => item.action === "retain").length,
      reviewExternal: items.filter((item) => item.action === "review_external").length,
      deleteCandidates: deleteCandidates.length,
      knownReclaimableBytes: deleteCandidates.reduce((total, item) => total + (item.artifact.bytes || 0), 0),
      unknownReclaimableItems: deleteCandidates.filter((item) => item.artifact.bytes === null).length
    },
    items
  };
}

export function getStorageCleanupPlan() {
  return buildStorageCleanupPlan(getMockState());
}
