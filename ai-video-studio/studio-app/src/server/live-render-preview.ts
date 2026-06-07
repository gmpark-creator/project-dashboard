import type { CostEstimate, ExportSpec, ProjectBundle, RenderPlan, RenderPreview, RenderRightsReview, Shot, Take } from "../domain/types";

function bestDoneTake(takes: Take[], shot: Shot) {
  return takes
    .filter((take) => take.shotId === shot.id && take.status === "done")
    .sort((a, b) => (b.metrics.overall || 0) - (a.metrics.overall || 0))[0] || null;
}

function selectedOrBestTake(takes: Take[], shot: Shot) {
  return takes.find((take) => take.id === shot.selectedTakeId && take.shotId === shot.id) || bestDoneTake(takes, shot);
}

export function buildLiveRenderRightsReview(bundle: ProjectBundle): RenderRightsReview {
  const items = new Map<string, RenderRightsReview["items"][number]>();
  for (const shot of bundle.shots.filter((item) => selectedOrBestTake(bundle.takes, item))) {
    for (const assetId of shot.referenceImageIds) {
      const asset = bundle.imageAssets.find((item) => item.id === assetId && item.projectId === bundle.project.id);
      if (!asset || asset.rights.status !== "needs_review") continue;
      const item = items.get(asset.id) || {
        assetId: asset.id,
        label: asset.label,
        role: asset.role,
        rightsStatus: asset.rights.status,
        note: asset.rights.note,
        targetShotIds: []
      };
      if (!item.targetShotIds.includes(shot.id)) item.targetShotIds.push(shot.id);
      items.set(asset.id, item);
    }
  }
  const list = [...items.values()];
  return {
    required: list.length > 0,
    assetIds: list.map((item) => item.assetId),
    items: list
  };
}

export function buildLiveRenderPlan(bundle: ProjectBundle, spec: ExportSpec): RenderPlan {
  const planShots: RenderPlan["shots"] = [];
  const missingShotIds: string[] = [];
  for (const shot of [...bundle.shots].sort((a, b) => a.order - b.order)) {
    const take = selectedOrBestTake(bundle.takes, shot);
    if (!take) {
      missingShotIds.push(shot.id);
      continue;
    }
    planShots.push({
      shotId: shot.id,
      takeId: take.id,
      order: shot.order,
      title: shot.title,
      durationSec: take.durationSec,
      videoUrl: take.videoUrl,
      posterUrl: take.posterUrl,
      tier: take.tier
    });
  }
  return {
    projectId: bundle.project.id,
    spec,
    sourceHash: bundle.renderSourceHash,
    totalDurationSec: planShots.reduce((total, shot) => total + shot.durationSec, 0),
    missingShotIds,
    shots: planShots,
    edit: bundle.editState
  };
}

function estimateLiveRenderCost(bundle: ProjectBundle): CostEstimate {
  const credits = 48;
  const availableCredits = Math.max(0, bundle.credits.balance - bundle.credits.reserved);
  return {
    credits,
    etaSec: 90,
    availableCredits,
    affordable: availableCredits >= credits,
    shortfallCredits: Math.max(0, credits - availableCredits)
  };
}

export function buildLiveRenderPreview(bundle: ProjectBundle, spec: ExportSpec): RenderPreview {
  const renderPlan = buildLiveRenderPlan(bundle, spec);
  return {
    projectId: bundle.project.id,
    spec,
    sourceHash: renderPlan.sourceHash,
    rightsReview: buildLiveRenderRightsReview(bundle),
    renderPlan,
    estimate: estimateLiveRenderCost(bundle)
  };
}
