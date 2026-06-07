import type {
  MediaArtifactInventoryItem,
  StorageCleanupAction,
  StorageCleanupExecutionRecord,
  StorageCleanupExecutionResult,
  StorageCleanupExecutionSnapshot,
  StorageCleanupPlan,
  StorageCleanupPlanItem,
  StudioState
} from "../domain/types";
import { buildMediaArtifactInventory } from "./artifact-inventory";
import { getMockState, getMutableMockState, saveMockState } from "./mock-service";
import { deleteStoredObject } from "./object-storage";

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

export function getStorageCleanupExecutionSnapshot(): StorageCleanupExecutionSnapshot {
  const records = [...getMockState().storageCleanupRecords].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return {
    generatedAt: new Date().toISOString(),
    summary: {
      total: records.length,
      deleted: records.filter((record) => record.status === "deleted").length,
      knownReclaimedBytes: records.reduce((total, record) => total + (record.bytes || 0), 0),
      unknownReclaimedItems: records.filter((record) => record.bytes === null).length
    },
    records
  };
}

function cleanupRecordId() {
  return `scln_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function executeStorageCleanup(input: { limit?: number } = {}): Promise<StorageCleanupExecutionResult> {
  const current = getMutableMockState();
  const plan = buildStorageCleanupPlan(current);
  const candidates = plan.items.filter((item) => item.safeToDelete);
  const limit = typeof input.limit === "number" ? Math.max(0, Math.floor(input.limit)) : null;
  const selected = limit === null ? candidates : candidates.slice(0, limit);
  const selectedIds = new Set(selected.map((item) => item.artifact.id));
  const timestamp = new Date().toISOString();

  for (const item of selected) {
    await deleteStoredObject(item.storageKey);
  }

  const records: StorageCleanupExecutionRecord[] = selected.map((item) => ({
    id: cleanupRecordId(),
    artifactId: item.artifact.id,
    projectId: item.artifact.projectId,
    storageKey: item.storageKey,
    action: "delete_object",
    status: "deleted",
    bytes: item.artifact.bytes,
    reason: item.reason,
    createdAt: timestamp
  }));

  if (records.length) {
    current.mediaArtifacts = current.mediaArtifacts.filter((artifact) => !selectedIds.has(artifact.id));
    current.storageCleanupRecords.unshift(...records);
    saveMockState(current);
  }

  return {
    executedAt: timestamp,
    limit,
    summary: {
      candidates: candidates.length,
      deleted: records.length,
      skipped: Math.max(0, candidates.length - records.length),
      recordsCreated: records.length,
      knownReclaimedBytes: records.reduce((total, record) => total + (record.bytes || 0), 0),
      unknownReclaimedItems: records.filter((record) => record.bytes === null).length
    },
    records
  };
}
