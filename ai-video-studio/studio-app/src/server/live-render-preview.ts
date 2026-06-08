import type { CostEstimate, ExportSpec, ProjectBundle, RenderPlan, RenderPreview, RenderRightsReview, Shot, Take } from "../domain/types";
import { buildCostEstimate, DEFAULT_EXPORT_RENDER_COUNT } from "../domain/cost-policy";

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
  // 비용은 단일 cost-policy로 계산(표준 내보내기 = DEFAULT_EXPORT_RENDER_COUNT개 렌더). 사용 가능 credit은
  // 실제 예약 체크(live adapter availableCredits)와 동일하게 balance - spent - reserved 로 본다.
  // 기존엔 spent를 빼지 않아 available을 과대표시했다(과금 fail-open). preview와 실제 예약을 일치시킨다.
  const availableCredits = Math.max(0, bundle.credits.balance - bundle.credits.spent - bundle.credits.reserved);
  return buildCostEstimate("startRender", { renderCount: DEFAULT_EXPORT_RENDER_COUNT }, availableCredits);
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
