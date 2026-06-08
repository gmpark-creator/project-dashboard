import { randomUUID } from "node:crypto";
import type {
  AssetDeleteResult,
  AssetUsage,
  CancelJobResult,
  CreditTransaction,
  DirectionSpec,
  EditState,
  ErrorResponse,
  ExportSpec,
  GenerationJob,
  GenerationPromptPackage,
  GenerationReference,
  ImageJob,
  ImageMakerPurpose,
  ImageVariant,
  JobStatus,
  MediaArtifact,
  Project,
  ProjectBundle,
  ProviderAttempt,
  QueueJobSnapshot,
  RenderJob,
  Scene,
  Shot,
  Take,
  Tier,
  WorkerCompletionReceipt,
  WorkerDispatchKind,
  WorkerLease,
  WorkerLeaseCompletionInput,
  WorkerLeaseCompletionResult,
  WorkerLeaseReleaseResult,
  WorkerLeaseRenewResult,
  WorkerLeaseRequest,
  WorkerLeaseResult,
  WorkerRetryAction,
  WorkerRetryExecutionResult,
  WorkerRetryRecord
} from "../domain/types";
import type { Aspect, ImageAsset, ImageAssetRole, Intent, ReferenceBoard } from "../domain/types";
import {
  buildLiveDefaultEditState,
  buildLiveDefaultReferenceBoard,
  buildLiveProjectCreateRecords,
  type LiveProjectCreateInput
} from "./live-project-builder";
import type { PgQueryable } from "./live-persistence-migrations";
import { PostgresLivePersistenceReadAdapter } from "./live-persistence-read-adapter";
import { buildLiveRenderPreview } from "./live-render-preview";
import { CreditReservationError } from "./credit-errors";
import { chooseProviderRoute } from "./provider-routing";

type Row = Record<string, unknown>;
export type LiveEditAudioPatch = Partial<Pick<EditState, "captions" | "bgm" | "voiceover" | "transitions">>;
export type LiveExternalImageInput = {
  projectId: string;
  label: string;
  role: ImageAssetRole;
  url: string;
  aspect?: Aspect;
  prompt?: string;
  rightsConfirmed?: boolean;
};
export type LiveShotReferenceInput = {
  assetId: string;
  mode: AssetUsage["mode"];
};
export type LiveImageJobInput = {
  projectId: string;
  prompt: string;
  purpose: ImageMakerPurpose;
  role: ImageAssetRole;
  aspect: Aspect;
  style?: string;
  count?: number;
  retryOfJobId?: string | null;
};
export type LiveShotGenerateInput = {
  tier?: Tier;
  takeCount?: number;
  retryOfJobId?: string | null;
};
export type LiveGenerateAllInput = {
  tier?: Tier;
};
export type LiveTakeUpgradeInput = {
  mode?: NonNullable<Take["upgradeMode"]>;
};
export type LiveStartRenderInput = {
  specs: ExportSpec[];
  retryOfJobId?: string | null;
};
export type LiveStoryboardScenePatch = Partial<Pick<Scene, "order" | "title" | "setting" | "timeOfDay">> & { id: string };
export type LiveStoryboardShotPatch = Partial<Pick<Shot, "order" | "sceneId" | "title" | "durationSec">> & {
  id: string;
  saec?: Partial<Shot["saec"]>;
  requirements?: Partial<Shot["requirements"]>;
  directionSpec?: Partial<Shot["directionSpec"]>;
};
export type LiveStoryboardUpdateInput = {
  scenes?: LiveStoryboardScenePatch[];
  shots?: LiveStoryboardShotPatch[];
};
type ReferenceBoardImageBucket = keyof Pick<
  ReferenceBoard,
  "productImages" | "characterImages" | "locationImages" | "styleImages" | "keyframes" | "thumbnails" | "logos" | "backgrounds"
>;

function now() {
  return new Date().toISOString();
}

function iso(value: unknown) {
  return value instanceof Date ? value.toISOString() : String(value);
}

function json(value: unknown) {
  return JSON.stringify(value);
}

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${randomUUID().slice(0, 8)}`;
}

function isActiveJobStatus(status: unknown): status is JobStatus {
  return status === "queued" || status === "running";
}

function cancelledError() {
  return {
    code: "JOB_CANCELLED",
    userMessage: "Job was cancelled.",
    retryable: false,
    fallbackSuggested: false
  };
}

function jsonValue<T>(value: unknown, fallback: T): T {
  if (value === null || typeof value === "undefined") return fallback;
  if (typeof value === "string") return JSON.parse(value) as T;
  return value as T;
}

function nullableString(value: unknown) {
  return value === null || typeof value === "undefined" ? null : String(value);
}

function rowShot(row: Row): Shot {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    sceneId: String(row.scene_id),
    order: Number(row.order_index),
    title: String(row.title),
    durationSec: Number(row.duration_sec),
    saec: jsonValue<Shot["saec"]>(row.saec, {
      subject: "",
      action: "",
      environment: "",
      camera: "",
      framing: "",
      lighting: "",
      style: "",
      negative: ""
    }),
    requirements: jsonValue<Shot["requirements"]>(row.requirements, {
      tier: "fast",
      aspect: "9:16",
      imageToVideo: false,
      needsLipsyncAudio: false,
      motionHeavy: false,
      characterLock: false,
      characterId: null,
      region: "global"
    }),
    status: row.status as Shot["status"],
    selectedTakeId: nullableString(row.selected_take_id),
    qualityFlags: jsonValue<Shot["qualityFlags"]>(row.quality_flags, []),
    referenceImageIds: jsonValue<Shot["referenceImageIds"]>(row.reference_image_ids, []),
    directionSpec: jsonValue<Shot["directionSpec"]>(row.direction_spec, {
      camera: "",
      composition: "",
      lighting: "",
      motion: "",
      style: "",
      avoid: [],
      notes: ""
    })
  };
}

function rowTake(row: Row): Take {
  const take: Take = {
    id: String(row.id),
    shotId: String(row.shot_id),
    projectId: String(row.project_id),
    label: String(row.label),
    status: row.status as Take["status"],
    videoUrl: nullableString(row.video_url),
    posterUrl: nullableString(row.poster_url),
    durationSec: Number(row.duration_sec),
    tier: row.tier as Take["tier"],
    engineUsed: nullableString(row.engine_used),
    metrics: jsonValue<Take["metrics"]>(row.metrics, {}),
    createdAt: String(row.created_at)
  };
  const upgradeSourceTakeId = nullableString(row.upgrade_source_take_id);
  const upgradeMode = nullableString(row.upgrade_mode);
  if (upgradeSourceTakeId) take.upgradeSourceTakeId = upgradeSourceTakeId;
  if (upgradeMode) take.upgradeMode = upgradeMode as Take["upgradeMode"];
  return take;
}

function imageSize(aspect: Aspect) {
  return (
    {
      "9:16": { width: 1080, height: 1920 },
      "16:9": { width: 1920, height: 1080 },
      "1:1": { width: 1536, height: 1536 },
      "4:5": { width: 1280, height: 1600 }
    } satisfies Record<Aspect, { width: number; height: number }>
  )[aspect];
}

function imageVariantScoreLabel(index: number): ImageVariant["scoreLabel"] {
  return (index === 0 ? "추천" : index === 1 ? "안정적" : "확인 필요") as ImageVariant["scoreLabel"];
}

function takeLabel(index: number) {
  return String.fromCharCode(65 + index);
}

function renderSpecKey(spec: ExportSpec) {
  return `${spec.resolution}:${spec.cut}:${spec.aspect}:${spec.caption}`;
}

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

function clampWorkerLeaseTtl(ttlSec: number | undefined) {
  return Math.max(5, Math.min(ttlSec || 60, 600));
}

function workerKind(input: WorkerLeaseRequest["kind"]): WorkerDispatchKind | null {
  if (!input || input === "any") return null;
  return input;
}

function normalizeWorkerLeaseRequest(input: Partial<WorkerLeaseRequest> = {}): WorkerLeaseRequest {
  return {
    workerId: input.workerId?.trim() || "live-worker",
    kind: input.kind || "any",
    ttlSec: clampWorkerLeaseTtl(input.ttlSec)
  };
}

function rowWorkerLease(row: Row): WorkerLease {
  const expiresAt = iso(row.expires_at);
  const rawStatus = row.status as WorkerLease["status"];
  return {
    id: String(row.id),
    token: String(row.token),
    dispatchKey: String(row.dispatch_key),
    kind: row.kind as WorkerLease["kind"],
    jobId: String(row.job_id),
    projectId: String(row.project_id),
    workerId: String(row.worker_id),
    status: rawStatus === "active" && new Date(expiresAt).getTime() <= Date.now() ? "expired" : rawStatus,
    leasedAt: iso(row.leased_at),
    expiresAt,
    releasedAt: row.released_at ? iso(row.released_at) : null
  };
}

function rowWorkerRetryRecord(row: Row): WorkerRetryRecord {
  return {
    id: String(row.id),
    sourceJobId: String(row.source_job_id),
    action: row.action as WorkerRetryRecord["action"],
    replacementJobId: String(row.replacement_job_id),
    replacementKind: row.replacement_kind as WorkerRetryRecord["replacementKind"],
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at)
  };
}

function nullableNumber(value: unknown) {
  if (value === null || typeof value === "undefined") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function rowCreditTransaction(row: Row): CreditTransaction {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    jobId: nullableString(row.job_id),
    kind: row.kind as CreditTransaction["kind"],
    action: row.action as CreditTransaction["action"],
    credits: Number(row.credits),
    providerCostUsd: nullableNumber(row.provider_cost_usd),
    marginPolicyVersion: String(row.margin_policy_version),
    balanceAfter: jsonValue<CreditTransaction["balanceAfter"]>(row.balance_after, { spent: 0, reserved: 0, available: 0 }),
    note: String(row.note),
    createdAt: iso(row.created_at)
  };
}

function rowMediaArtifact(row: Row): MediaArtifact {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    ownerType: row.owner_type as MediaArtifact["ownerType"],
    ownerId: String(row.owner_id),
    sourceJobId: nullableString(row.source_job_id),
    kind: row.kind as MediaArtifact["kind"],
    role: row.role as MediaArtifact["role"],
    url: String(row.url),
    storageKey: String(row.storage_key),
    contentType: String(row.content_type),
    bytes: nullableNumber(row.bytes),
    status: row.status as MediaArtifact["status"],
    createdAt: iso(row.created_at)
  };
}

function workerError(input: WorkerLeaseCompletionInput, fallbackCode: string, fallbackMessage: string): ErrorResponse {
  return {
    code: input.error?.code?.trim() || fallbackCode,
    userMessage: input.error?.userMessage?.trim() || fallbackMessage,
    retryable: Boolean(input.error?.retryable ?? true),
    fallbackSuggested: Boolean(input.error?.fallbackSuggested ?? true)
  };
}

function validUrl(value: string | undefined, production: boolean) {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    if (production) return parsed.protocol === "https:";
    return parsed.protocol === "https:" || parsed.protocol === "http:" || parsed.protocol === "data:" || parsed.protocol === "mock:";
  } catch {
    return false;
  }
}

function hasInvalidProvidedOutput(input: Partial<WorkerLeaseCompletionInput>, production: boolean) {
  const output = input.outputs;
  if (!output) return false;
  if (output.videoUrl && !validUrl(output.videoUrl, production)) return true;
  if (output.posterUrl && !validUrl(output.posterUrl, production)) return true;
  if (output.renderOutputUrl && !validUrl(output.renderOutputUrl, production)) return true;
  if (output.shareUrl && !validUrl(output.shareUrl, production)) return true;
  return Boolean(
    output.imageVariants?.some(
      (variant) => !validUrl(variant.imageUrl, production) || (variant.thumbUrl ? !validUrl(variant.thumbUrl, production) : false)
    )
  );
}

function suppliedStorageKeyMatches(value: string | undefined, expected: string | null) {
  if (typeof value === "undefined") return true;
  return typeof value === "string" && value.length > 0 && value === expected;
}

function takeStorageKey(projectId: string, takeId: string, role: "take_video" | "take_poster") {
  return `projects/${projectId}/take/${takeId}/${role}`;
}

function renderStorageKey(projectId: string, jobId: string) {
  return `projects/${projectId}/renderJob/${jobId}/render_output`;
}

function imageVariantStorageKey(projectId: string, jobId: string, variantId: string, role: "image_asset" | "image_thumbnail") {
  return `projects/${projectId}/imageJob/${jobId}/variants/${variantId}/${role}`;
}

function expectedImageVariant(variants: ImageVariant[], variantId: string | undefined, index: number) {
  return (variantId ? variants.find((variant) => variant.id === variantId) : null) || variants[index] || null;
}

function validLiveCompletionOutput(lease: WorkerLease, input: Partial<WorkerLeaseCompletionInput>, jobRow: Row) {
  const production = process.env.CUTPILOT_RUNTIME_MODE === "production";
  if (hasInvalidProvidedOutput(input, production)) return false;
  const requireOutputs = input.requireOutputs === true || production;
  if (!requireOutputs) return true;
  const output = input.outputs;
  if (!output) return false;

  if (lease.kind === "image_generation") {
    const variants = jsonValue<ImageVariant[]>(jobRow.variants, []);
    const outputVariants = output.imageVariants || [];
    if (!outputVariants.length) return false;
    const coveredVariantIds = new Set<string>();
    for (const [index, variant] of outputVariants.entries()) {
      const expected = expectedImageVariant(variants, variant.variantId, index);
      if (!expected) return false;
      if (!validUrl(variant.imageUrl, production)) return false;
      if (production && (!variant.imageStorageKey || !variant.thumbnailStorageKey)) return false;
      if (!suppliedStorageKeyMatches(variant.imageStorageKey, imageVariantStorageKey(lease.projectId, lease.jobId, expected.id, "image_asset"))) return false;
      if (!suppliedStorageKeyMatches(variant.thumbnailStorageKey, imageVariantStorageKey(lease.projectId, lease.jobId, expected.id, "image_thumbnail"))) return false;
      coveredVariantIds.add(expected.id);
    }
    return variants.every((variant) => coveredVariantIds.has(variant.id));
  }

  if (lease.kind === "provider_generation") {
    if (!validUrl(output.videoUrl, production)) return false;
    if (production && !output.videoStorageKey) return false;
    if (!suppliedStorageKeyMatches(output.videoStorageKey, takeStorageKey(lease.projectId, String(jobRow.take_id), "take_video"))) return false;
    if (!suppliedStorageKeyMatches(output.posterStorageKey, takeStorageKey(lease.projectId, String(jobRow.take_id), "take_poster"))) return false;
    return !output.posterUrl || validUrl(output.posterUrl, production);
  }

  const renderUrl = output.renderOutputUrl || output.videoUrl;
  if (!validUrl(renderUrl, production)) return false;
  if (production && !output.renderStorageKey) return false;
  return suppliedStorageKeyMatches(output.renderStorageKey, renderStorageKey(lease.projectId, lease.jobId));
}

function terminalCompletionStatus(status: JobStatus) {
  if (status === "done") return "succeeded";
  if (status === "failed") return "failed";
  if (status === "cancelled") return "cancelled";
  throw new Error("Active jobs do not have completion receipts.");
}

function sumCredits(transactions: CreditTransaction[], kind: CreditTransaction["kind"]) {
  return transactions.filter((transaction) => transaction.kind === kind).reduce((total, transaction) => total + transaction.credits, 0);
}

function providerAttempt(target: GenerationJob["routing"]["selected"], startedAt: string): ProviderAttempt {
  return {
    id: uid("pat"),
    provider: target.provider,
    model: target.model,
    requestId: null,
    status: "queued",
    startedAt,
    completedAt: null,
    latencyMs: null,
    errorCode: null,
    retryable: false,
    fallbackSuggested: false
  };
}

function rowGenerationReference(row: Row): GenerationReference {
  const rights = jsonValue<ImageAsset["rights"]>(row.rights, { status: "needs_review", note: "" });
  return {
    assetId: String(row.asset_id),
    role: row.role as ImageAssetRole,
    mode: row.mode as AssetUsage["mode"],
    url: String(row.url),
    rightsStatus: rights.status
  };
}

function generationPromptPackage(shot: Shot, references: GenerationReference[]): GenerationPromptPackage {
  const idsByMode = (mode: AssetUsage["mode"]) => references.filter((reference) => reference.mode === mode).map((reference) => reference.assetId);
  return {
    projectId: shot.projectId,
    shotId: shot.id,
    durationSec: shot.durationSec,
    saec: { ...shot.saec },
    directionSpec: {
      ...shot.directionSpec,
      avoid: [...shot.directionSpec.avoid]
    },
    requirements: { ...shot.requirements },
    references,
    routingHints: {
      startFrameAssetId: idsByMode("first_frame")[0] || null,
      lastFrameAssetId: idsByMode("last_frame")[0] || null,
      styleReferenceAssetIds: idsByMode("style_reference"),
      characterReferenceAssetIds: idsByMode("character_reference"),
      productReferenceAssetIds: idsByMode("product_reference"),
      backgroundReferenceAssetIds: idsByMode("background_reference"),
      rightsReviewRequired: references.some((reference) => reference.rightsStatus === "needs_review")
    }
  };
}

function boardBucket(role: ImageAssetRole): ReferenceBoardImageBucket {
  return (
    {
      product: "productImages",
      character: "characterImages",
      location: "locationImages",
      style: "styleImages",
      keyframe: "keyframes",
      thumbnail: "thumbnails",
      logo: "logos",
      background: "backgrounds"
    } satisfies Record<ImageAssetRole, ReferenceBoardImageBucket>
  )[role];
}

function mergeDirectionPatch(current: DirectionSpec, patch: Partial<DirectionSpec>): DirectionSpec {
  return {
    ...current,
    ...patch,
    avoid: patch.avoid ? patch.avoid.map((item) => item.trim()).filter(Boolean) : current.avoid
  };
}

function projectStatusFromShots(shots: Array<{ status: string; selected_take_id: unknown }>) {
  const hasRunning = shots.some((shot) => shot.status === "generating");
  const hasReview = shots.some((shot) => shot.status === "reviewing" || shot.status === "failed");
  const selectedCount = shots.filter((shot) => Boolean(shot.selected_take_id)).length;
  return hasRunning ? "generating" : hasReview ? "reviewing" : selectedCount ? "edited" : "storyboarded";
}

function projectProgressFromShots(shots: Array<{ status: string; selected_take_id: unknown }>) {
  return {
    shotsDone: shots.filter((shot) => Boolean(shot.selected_take_id) || shot.status === "reviewing" || shot.status === "selected").length,
    shotsTotal: shots.length
  };
}

function nextReferenceRequirements(shot: Shot, modes: AssetUsage["mode"][], intent: Intent): Shot["requirements"] {
  const hasFrameReference = modes.some((mode) => mode === "first_frame" || mode === "last_frame");
  const hasCharacterReference = modes.some((mode) => mode === "character_reference");
  const baselineCharacterLock = intent === "education" || intent === "brand";
  return {
    ...shot.requirements,
    imageToVideo: hasFrameReference,
    characterLock: hasCharacterReference || baselineCharacterLock,
    characterId: hasCharacterReference ? shot.requirements.characterId : baselineCharacterLock ? shot.requirements.characterId : null
  };
}

function rowEditState(row: Row | null, projectId: string): EditState {
  if (!row) return buildLiveDefaultEditState(projectId);
  return {
    projectId,
    captions: jsonValue<EditState["captions"]>(row.captions, buildLiveDefaultEditState(projectId).captions),
    bgm: jsonValue<EditState["bgm"]>(row.bgm, buildLiveDefaultEditState(projectId).bgm),
    voiceover: jsonValue<EditState["voiceover"]>(row.voiceover, buildLiveDefaultEditState(projectId).voiceover),
    transitions: row.transitions as EditState["transitions"],
    commands: jsonValue<EditState["commands"]>(row.commands, [])
  };
}

function rowReferenceBoard(row: Row | null, projectId: string): ReferenceBoard {
  if (!row) return buildLiveDefaultReferenceBoard(projectId);
  return {
    projectId,
    productImages: jsonValue<ReferenceBoard["productImages"]>(row.product_images, []),
    characterImages: jsonValue<ReferenceBoard["characterImages"]>(row.character_images, []),
    locationImages: jsonValue<ReferenceBoard["locationImages"]>(row.location_images, []),
    styleImages: jsonValue<ReferenceBoard["styleImages"]>(row.style_images, []),
    keyframes: jsonValue<ReferenceBoard["keyframes"]>(row.keyframes, []),
    thumbnails: jsonValue<ReferenceBoard["thumbnails"]>(row.thumbnails, []),
    logos: jsonValue<ReferenceBoard["logos"]>(row.logos, []),
    backgrounds: jsonValue<ReferenceBoard["backgrounds"]>(row.backgrounds, []),
    usages: []
  };
}

function removeAssetFromReferenceBoard(board: ReferenceBoard, assetId: string): ReferenceBoard {
  return {
    ...board,
    productImages: board.productImages.filter((id) => id !== assetId),
    characterImages: board.characterImages.filter((id) => id !== assetId),
    locationImages: board.locationImages.filter((id) => id !== assetId),
    styleImages: board.styleImages.filter((id) => id !== assetId),
    keyframes: board.keyframes.filter((id) => id !== assetId),
    thumbnails: board.thumbnails.filter((id) => id !== assetId),
    logos: board.logos.filter((id) => id !== assetId),
    backgrounds: board.backgrounds.filter((id) => id !== assetId),
    usages: board.usages.filter((usage) => usage.assetId !== assetId)
  };
}

export class PostgresLivePersistenceWriteAdapter {
  constructor(private readonly client: PgQueryable) {}

  private async requireProject(projectId: string) {
    const projects = await this.client.query<Row>("SELECT id FROM cutpilot_projects WHERE id = $1 FOR UPDATE", [projectId]);
    if (!projects.rows[0]) throw new Error("Project not found");
  }

  private async getLockedEditState(projectId: string) {
    const rows = await this.client.query<Row>("SELECT * FROM cutpilot_project_edit_states WHERE project_id = $1 FOR UPDATE", [projectId]);
    return rowEditState(rows.rows[0] || null, projectId);
  }

  private async upsertEditState(editState: EditState, updatedAt: string) {
    const rows = await this.client.query<Row>(
      `
      INSERT INTO cutpilot_project_edit_states (project_id, captions, bgm, voiceover, transitions, commands, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (project_id) DO UPDATE SET
        captions = EXCLUDED.captions,
        bgm = EXCLUDED.bgm,
        voiceover = EXCLUDED.voiceover,
        transitions = EXCLUDED.transitions,
        commands = EXCLUDED.commands,
        updated_at = EXCLUDED.updated_at
      RETURNING *
    `,
      [
        editState.projectId,
        json(editState.captions),
        json(editState.bgm),
        json(editState.voiceover),
        editState.transitions,
        json(editState.commands),
        updatedAt
      ]
    );
    return rowEditState(rows.rows[0] || null, editState.projectId);
  }

  private async upsertReferenceBoard(board: ReferenceBoard, updatedAt: string) {
    await this.client.query(
      `
      INSERT INTO cutpilot_reference_boards (
        project_id, product_images, character_images, location_images, style_images,
        keyframes, thumbnails, logos, backgrounds, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (project_id) DO UPDATE SET
        product_images = EXCLUDED.product_images,
        character_images = EXCLUDED.character_images,
        location_images = EXCLUDED.location_images,
        style_images = EXCLUDED.style_images,
        keyframes = EXCLUDED.keyframes,
        thumbnails = EXCLUDED.thumbnails,
        logos = EXCLUDED.logos,
        backgrounds = EXCLUDED.backgrounds,
        updated_at = EXCLUDED.updated_at
    `,
      [
        board.projectId,
        json(board.productImages),
        json(board.characterImages),
        json(board.locationImages),
        json(board.styleImages),
        json(board.keyframes),
        json(board.thumbnails),
        json(board.logos),
        json(board.backgrounds),
        updatedAt
      ]
    );
  }

  private async referenceUsageModes(projectId: string, shotId: string) {
    const rows = await this.client.query<Row>(
      "SELECT mode FROM cutpilot_asset_usages WHERE project_id = $1 AND target = $2 AND target_id = $3",
      [projectId, "shot", shotId]
    );
    return rows.rows.map((row) => row.mode as AssetUsage["mode"]);
  }

  private async projectIntent(projectId: string) {
    const rows = await this.client.query<Row>("SELECT intent FROM cutpilot_projects WHERE id = $1 LIMIT 1", [projectId]);
    return (rows.rows[0]?.intent || "product_ad") as Intent;
  }

  private async countProjectImageAssets(projectId: string) {
    const rows = await this.client.query<Row>("SELECT COUNT(*) AS count FROM cutpilot_image_assets WHERE project_id = $1", [projectId]);
    return Number(rows.rows[0]?.count || 0);
  }

  private async availableCredits(projectId: string) {
    const accountRows = await this.client.query<Row>(
      `
      SELECT p.credit_account_id, a.balance_credits, a.spent_credits, a.reserved_credits
      FROM cutpilot_projects p
      JOIN cutpilot_credit_accounts a ON a.id = p.credit_account_id
      WHERE p.id = $1
      FOR UPDATE
    `,
      [projectId]
    );
    const account = accountRows.rows[0];
    if (!account) throw new Error("Project not found");
    return Math.max(0, Number(account.balance_credits) - Number(account.spent_credits) - Number(account.reserved_credits));
  }

  private async expireWorkerLeases(timestamp: string) {
    await this.client.query("UPDATE cutpilot_worker_leases SET status = $2 WHERE status = $1 AND expires_at <= $3", ["active", "expired", timestamp]);
  }

  private async reserveCredits(input: { projectId: string; jobId: string; action: CreditTransaction["action"]; credits: number; note: string }) {
    const accountRows = await this.client.query<Row>(
      `
      SELECT p.credit_account_id, a.balance_credits, a.spent_credits, a.reserved_credits
      FROM cutpilot_projects p
      JOIN cutpilot_credit_accounts a ON a.id = p.credit_account_id
      WHERE p.id = $1
      FOR UPDATE
    `,
      [input.projectId]
    );
    const account = accountRows.rows[0];
    if (!account) throw new Error("Project not found");

    const balance = Number(account.balance_credits);
    const spent = Number(account.spent_credits);
    const reserved = Number(account.reserved_credits);
    const available = Math.max(0, balance - spent - reserved);
    if (available < input.credits) throw new CreditReservationError(input.credits, available);

    const nextReserved = reserved + input.credits;
    const timestamp = now();
    await this.client.query("UPDATE cutpilot_credit_accounts SET reserved_credits = $2, updated_at = $3 WHERE id = $1", [
      account.credit_account_id,
      nextReserved,
      timestamp
    ]);
    await this.client.query(
      `
      INSERT INTO cutpilot_credit_transactions (
        id, project_id, job_id, kind, action, credits, provider_cost_usd,
        margin_policy_version, balance_after, note, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `,
      [
        uid("ctx"),
        input.projectId,
        input.jobId,
        "reserve",
        input.action,
        input.credits,
        0,
        "sandbox-v1",
        json({ spent, reserved: nextReserved, available: Math.max(0, balance - spent - nextReserved) }),
        input.note,
        timestamp
      ]
    );
  }

  private async refundReservedCredits(input: { projectId: string; jobId: string; action: CreditTransaction["action"]; credits: number; note: string }) {
    const accountRows = await this.client.query<Row>(
      `
      SELECT p.credit_account_id, a.balance_credits, a.spent_credits, a.reserved_credits
      FROM cutpilot_projects p
      JOIN cutpilot_credit_accounts a ON a.id = p.credit_account_id
      WHERE p.id = $1
      FOR UPDATE
    `,
      [input.projectId]
    );
    const account = accountRows.rows[0];
    if (!account) return;
    const reserved = Math.max(0, Number(account.reserved_credits) - input.credits);
    const spent = Number(account.spent_credits);
    const balance = Number(account.balance_credits);
    const timestamp = now();
    await this.client.query("UPDATE cutpilot_credit_accounts SET reserved_credits = $2, updated_at = $3 WHERE id = $1", [
      account.credit_account_id,
      reserved,
      timestamp
    ]);
    await this.client.query(
      `
      INSERT INTO cutpilot_credit_transactions (
        id, project_id, job_id, kind, action, credits, provider_cost_usd,
        margin_policy_version, balance_after, note, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `,
      [
        uid("ctx"),
        input.projectId,
        input.jobId,
        "refund",
        input.action,
        input.credits,
        0,
        "sandbox-v1",
        json({ spent, reserved, available: Math.max(0, balance - reserved) }),
        input.note,
        timestamp
      ]
    );
  }

  private async captureReservedCredits(input: { projectId: string; jobId: string; action: CreditTransaction["action"]; credits: number; note: string }) {
    const accountRows = await this.client.query<Row>(
      `
      SELECT p.credit_account_id, a.balance_credits, a.spent_credits, a.reserved_credits
      FROM cutpilot_projects p
      JOIN cutpilot_credit_accounts a ON a.id = p.credit_account_id
      WHERE p.id = $1
      FOR UPDATE
    `,
      [input.projectId]
    );
    const account = accountRows.rows[0];
    if (!account) return;
    const reserved = Math.max(0, Number(account.reserved_credits) - input.credits);
    const spent = Number(account.spent_credits) + input.credits;
    const balance = Number(account.balance_credits);
    const timestamp = now();
    await this.client.query("UPDATE cutpilot_credit_accounts SET spent_credits = $2, reserved_credits = $3, updated_at = $4 WHERE id = $1", [
      account.credit_account_id,
      spent,
      reserved,
      timestamp
    ]);
    await this.client.query(
      `
      INSERT INTO cutpilot_credit_transactions (
        id, project_id, job_id, kind, action, credits, provider_cost_usd,
        margin_policy_version, balance_after, note, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `,
      [
        uid("ctx"),
        input.projectId,
        input.jobId,
        "capture",
        input.action,
        input.credits,
        Number((input.credits * 0.035).toFixed(2)),
        "sandbox-v1",
        json({ spent, reserved, available: Math.max(0, balance - spent - reserved) }),
        input.note,
        timestamp
      ]
    );
  }

  private async insertMediaArtifact(input: Omit<MediaArtifact, "id" | "createdAt">) {
    const createdAt = now();
    const artifact: MediaArtifact = {
      id: uid("art"),
      ...input,
      createdAt
    };
    await this.client.query(
      `
      INSERT INTO cutpilot_media_artifacts (
        id, project_id, owner_type, owner_id, source_job_id, kind, role,
        url, storage_key, content_type, bytes, status, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `,
      [
        artifact.id,
        artifact.projectId,
        artifact.ownerType,
        artifact.ownerId,
        artifact.sourceJobId,
        artifact.kind,
        artifact.role,
        artifact.url,
        artifact.storageKey,
        artifact.contentType,
        artifact.bytes,
        artifact.status,
        artifact.createdAt
      ]
    );
    return artifact;
  }

  private async workerCompletionReceipt(input: {
    kind: WorkerDispatchKind;
    jobId: string;
    projectId: string;
    status: JobStatus;
    completedAt: string;
    error: ErrorResponse | null;
  }): Promise<WorkerCompletionReceipt> {
    const artifacts = (await this.client.query<Row>("SELECT * FROM cutpilot_media_artifacts WHERE source_job_id = $1 ORDER BY created_at ASC", [input.jobId])).rows.map(rowMediaArtifact);
    const creditTransactions = (await this.client.query<Row>("SELECT * FROM cutpilot_credit_transactions WHERE job_id = $1 ORDER BY created_at ASC", [input.jobId])).rows.map(rowCreditTransaction);
    const status = terminalCompletionStatus(input.status);
    return {
      completionKey: `${input.kind}:${input.jobId}:${status}`,
      kind: input.kind,
      jobId: input.jobId,
      projectId: input.projectId,
      status,
      completedAt: input.completedAt,
      error: input.error,
      artifacts,
      creditTransactions,
      summary: {
        artifactCount: artifacts.length,
        storedArtifacts: artifacts.filter((artifact) => artifact.status === "stored").length,
        externalArtifacts: artifacts.filter((artifact) => artifact.status === "external").length,
        capturedCredits: sumCredits(creditTransactions, "capture"),
        refundedCredits: sumCredits(creditTransactions, "refund")
      }
    };
  }

  async createProject(input: LiveProjectCreateInput): Promise<Project> {
    const records = buildLiveProjectCreateRecords(input);
    await this.client.query("BEGIN");
    try {
      await this.client.query(
        `
        INSERT INTO cutpilot_credit_accounts (id, balance_credits, spent_credits, reserved_credits, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [records.creditAccountId, 1240, 0, 0, records.project.createdAt, records.project.updatedAt]
      );
      await this.client.query(
        `
        INSERT INTO cutpilot_projects (
          id, credit_account_id, title, idea, intent, status, aspect, target_duration_sec,
          progress, characters, thumb_url, default_render_job_id, credits, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `,
        [
          records.project.id,
          records.creditAccountId,
          records.project.title,
          records.project.idea,
          records.project.intent,
          records.project.status,
          records.project.aspect,
          records.project.targetDurationSec,
          json(records.project.progress),
          json(records.project.characters),
          records.project.thumbUrl,
          records.project.defaultRenderJobId,
          json(records.project.credits),
          records.project.createdAt,
          records.project.updatedAt
        ]
      );
      for (const scene of records.scenes) {
        await this.client.query(
          `
          INSERT INTO cutpilot_scenes (id, project_id, order_index, title, setting, time_of_day)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
          [scene.id, scene.projectId, scene.order, scene.title, scene.setting, scene.timeOfDay]
        );
      }
      for (const shot of records.shots) {
        await this.client.query(
          `
          INSERT INTO cutpilot_shots (
            id, project_id, scene_id, order_index, title, duration_sec, saec, requirements,
            status, selected_take_id, quality_flags, reference_image_ids, direction_spec
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `,
          [
            shot.id,
            shot.projectId,
            shot.sceneId,
            shot.order,
            shot.title,
            shot.durationSec,
            json(shot.saec),
            json(shot.requirements),
            shot.status,
            shot.selectedTakeId,
            json(shot.qualityFlags),
            json(shot.referenceImageIds),
            json(shot.directionSpec)
          ]
        );
      }
      await this.client.query(
        `
        INSERT INTO cutpilot_reference_boards (
          project_id, product_images, character_images, location_images, style_images,
          keyframes, thumbnails, logos, backgrounds, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `,
        [
          records.project.id,
          json(records.referenceBoard.productImages),
          json(records.referenceBoard.characterImages),
          json(records.referenceBoard.locationImages),
          json(records.referenceBoard.styleImages),
          json(records.referenceBoard.keyframes),
          json(records.referenceBoard.thumbnails),
          json(records.referenceBoard.logos),
          json(records.referenceBoard.backgrounds),
          records.project.updatedAt
        ]
      );
      await this.client.query(
        `
        INSERT INTO cutpilot_project_edit_states (project_id, captions, bgm, voiceover, transitions, commands, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [
          records.project.id,
          json(records.editState.captions),
          json(records.editState.bgm),
          json(records.editState.voiceover),
          records.editState.transitions,
          json(records.editState.commands),
          records.project.updatedAt
        ]
      );
      await this.client.query("COMMIT");
      return records.project;
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async updateShotDirection(shotId: string, patch: Partial<DirectionSpec>): Promise<Shot> {
    await this.client.query("BEGIN");
    try {
      const shots = await this.client.query<Row>("SELECT * FROM cutpilot_shots WHERE id = $1 FOR UPDATE", [shotId]);
      const currentRow = shots.rows[0];
      if (!currentRow) throw new Error("Shot not found");

      const current = rowShot(currentRow);
      const directionSpec = mergeDirectionPatch(current.directionSpec, patch);
      const updated = await this.client.query<Row>("UPDATE cutpilot_shots SET direction_spec = $2::jsonb WHERE id = $1 RETURNING *", [
        shotId,
        json(directionSpec)
      ]);
      await this.client.query("COMMIT");
      return rowShot(updated.rows[0] || { ...currentRow, direction_spec: directionSpec });
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async selectTake(shotId: string, takeId: string): Promise<Shot> {
    await this.client.query("BEGIN");
    try {
      const shots = await this.client.query<Row>("SELECT * FROM cutpilot_shots WHERE id = $1 FOR UPDATE", [shotId]);
      const currentRow = shots.rows[0];
      if (!currentRow) throw new Error("Selectable take not found");
      const current = rowShot(currentRow);

      const takes = await this.client.query<Row>("SELECT * FROM cutpilot_takes WHERE id = $1 AND shot_id = $2 AND project_id = $3 LIMIT 1 FOR UPDATE", [
        takeId,
        shotId,
        current.projectId
      ]);
      const take = takes.rows[0];
      if (!take || take.status !== "done") throw new Error("Selectable take not found");

      const updated = await this.client.query<Row>(
        "UPDATE cutpilot_shots SET selected_take_id = $2, status = $3 WHERE id = $1 RETURNING *",
        [shotId, takeId, "selected"]
      );
      const projectShots = await this.client.query<Row>("SELECT status, selected_take_id FROM cutpilot_shots WHERE project_id = $1", [current.projectId]);
      await this.client.query("UPDATE cutpilot_projects SET progress = $2, status = $3, updated_at = $4 WHERE id = $1", [
        current.projectId,
        json(projectProgressFromShots(projectShots.rows as Array<{ status: string; selected_take_id: unknown }>)),
        projectStatusFromShots(projectShots.rows as Array<{ status: string; selected_take_id: unknown }>),
        now()
      ]);
      await this.client.query("COMMIT");
      return rowShot(updated.rows[0] || { ...currentRow, selected_take_id: takeId, status: "selected" });
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async updateStoryboard(projectId: string, input: LiveStoryboardUpdateInput): Promise<ProjectBundle | null> {
    await this.client.query("BEGIN");
    try {
      await this.requireProject(projectId);
      for (const patch of input.scenes || []) {
        await this.client.query(
          `
          UPDATE cutpilot_scenes SET
            order_index = COALESCE($3, order_index),
            title = COALESCE($4, title),
            setting = COALESCE($5, setting),
            time_of_day = COALESCE($6, time_of_day)
          WHERE id = $1 AND project_id = $2
        `,
          [
            patch.id,
            projectId,
            typeof patch.order === "number" ? patch.order : null,
            typeof patch.title === "string" && patch.title.trim() ? patch.title.trim() : null,
            typeof patch.setting === "string" ? patch.setting : null,
            typeof patch.timeOfDay === "string" ? patch.timeOfDay : null
          ]
        );
      }

      for (const patch of input.shots || []) {
        const shotRows = await this.client.query<Row>("SELECT * FROM cutpilot_shots WHERE id = $1 AND project_id = $2 FOR UPDATE", [patch.id, projectId]);
        const shotRow = shotRows.rows[0];
        if (!shotRow) continue;
        const shot = rowShot(shotRow);
        const before = JSON.stringify({
          sceneId: shot.sceneId,
          order: shot.order,
          title: shot.title,
          durationSec: shot.durationSec,
          saec: shot.saec,
          requirements: shot.requirements,
          directionSpec: shot.directionSpec
        });

        let sceneId = shot.sceneId;
        if (typeof patch.sceneId === "string") {
          const scenes = await this.client.query<Row>("SELECT id FROM cutpilot_scenes WHERE id = $1 AND project_id = $2 LIMIT 1", [patch.sceneId, projectId]);
          if (scenes.rows[0]) sceneId = patch.sceneId;
        }
        const nextShot: Shot = {
          ...shot,
          sceneId,
          order: typeof patch.order === "number" ? patch.order : shot.order,
          title: typeof patch.title === "string" && patch.title.trim() ? patch.title.trim() : shot.title,
          durationSec: typeof patch.durationSec === "number" ? Math.max(1, Math.min(16, patch.durationSec)) : shot.durationSec,
          saec: patch.saec ? { ...shot.saec, ...patch.saec } : shot.saec,
          requirements: patch.requirements ? { ...shot.requirements, ...patch.requirements } : shot.requirements,
          directionSpec: patch.directionSpec ? mergeDirectionPatch(shot.directionSpec, patch.directionSpec) : shot.directionSpec
        };
        const after = JSON.stringify({
          sceneId: nextShot.sceneId,
          order: nextShot.order,
          title: nextShot.title,
          durationSec: nextShot.durationSec,
          saec: nextShot.saec,
          requirements: nextShot.requirements,
          directionSpec: nextShot.directionSpec
        });
        if (before !== after) {
          nextShot.selectedTakeId = null;
          nextShot.qualityFlags = [];
          if (nextShot.status === "selected" || nextShot.status === "reviewing" || nextShot.status === "failed") nextShot.status = "pending";
        }

        await this.client.query(
          `
          UPDATE cutpilot_shots SET
            scene_id = $2,
            order_index = $3,
            title = $4,
            duration_sec = $5,
            saec = $6,
            requirements = $7,
            status = $8,
            selected_take_id = $9,
            quality_flags = $10,
            direction_spec = $11
          WHERE id = $1
        `,
          [
            nextShot.id,
            nextShot.sceneId,
            nextShot.order,
            nextShot.title,
            nextShot.durationSec,
            json(nextShot.saec),
            json(nextShot.requirements),
            nextShot.status,
            nextShot.selectedTakeId,
            json(nextShot.qualityFlags),
            json(nextShot.directionSpec)
          ]
        );
      }

      const projectShots = await this.client.query<Row>("SELECT status, selected_take_id FROM cutpilot_shots WHERE project_id = $1", [projectId]);
      await this.client.query("UPDATE cutpilot_projects SET progress = $2, status = $3, updated_at = $4 WHERE id = $1", [
        projectId,
        json(projectProgressFromShots(projectShots.rows as Array<{ status: string; selected_take_id: unknown }>)),
        projectStatusFromShots(projectShots.rows as Array<{ status: string; selected_take_id: unknown }>),
        now()
      ]);
      const bundle = await new PostgresLivePersistenceReadAdapter(this.client).getProjectBundle(projectId);
      await this.client.query("COMMIT");
      return bundle;
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async applyEdit(projectId: string, command?: string): Promise<EditState> {
    await this.client.query("BEGIN");
    try {
      await this.requireProject(projectId);
      const updatedAt = now();
      const current = await this.getLockedEditState(projectId);
      const editState: EditState = {
        ...current,
        commands: command ? [...current.commands, { command, createdAt: updatedAt }] : current.commands
      };
      const updated = await this.upsertEditState(editState, updatedAt);
      await this.client.query("UPDATE cutpilot_projects SET status = $2, updated_at = $3 WHERE id = $1", [projectId, "edited", updatedAt]);
      await this.client.query("COMMIT");
      return updated;
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async setAudio(projectId: string, patch: LiveEditAudioPatch): Promise<EditState> {
    await this.client.query("BEGIN");
    try {
      await this.requireProject(projectId);
      const updatedAt = now();
      const current = await this.getLockedEditState(projectId);
      const editState: EditState = { ...current, ...patch };
      const updated = await this.upsertEditState(editState, updatedAt);
      await this.client.query("UPDATE cutpilot_projects SET updated_at = $2 WHERE id = $1", [projectId, updatedAt]);
      await this.client.query("COMMIT");
      return updated;
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async setDefaultRender(projectId: string, renderJobId: string) {
    await this.client.query("BEGIN");
    try {
      await this.requireProject(projectId);
      const renderJobs = await this.client.query<Row>(
        "SELECT * FROM cutpilot_render_jobs WHERE id = $1 AND project_id = $2 LIMIT 1 FOR UPDATE",
        [renderJobId, projectId]
      );
      const renderJob = renderJobs.rows[0];
      if (!renderJob) throw new Error("Render job not found");
      if (renderJob.status !== "done") throw new Error("Only completed renders can be the default version");

      const updatedAt = now();
      const thumbUrl = nullableString(renderJob.output_url) || nullableString(renderJob.share_url);
      await this.client.query("UPDATE cutpilot_projects SET default_render_job_id = $2, thumb_url = $3, updated_at = $4 WHERE id = $1", [
        projectId,
        renderJobId,
        thumbUrl,
        updatedAt
      ]);
      const bundle = await new PostgresLivePersistenceReadAdapter(this.client).getProjectBundle(projectId);
      await this.client.query("COMMIT");
      return bundle;
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async createWorkerLease(input: Partial<WorkerLeaseRequest> = {}): Promise<WorkerLeaseResult> {
    await this.client.query("BEGIN");
    try {
      const request = normalizeWorkerLeaseRequest(input);
      const timestamp = now();
      await this.expireWorkerLeases(timestamp);
      const requestedKind = workerKind(request.kind);
      const activeLeaseRows = await this.client.query<Row>("SELECT dispatch_key FROM cutpilot_worker_leases WHERE status = $1", ["active"]);
      const leasedDispatchKeys = new Set(activeLeaseRows.rows.map((row) => String(row.dispatch_key)));
      const dispatch = await new PostgresLivePersistenceReadAdapter(this.client).getWorkerDispatchSnapshot();
      const item = dispatch.items.find((candidate) => {
        if (requestedKind && candidate.kind !== requestedKind) return false;
        return !leasedDispatchKeys.has(candidate.dispatchKey);
      });

      if (!item) {
        await this.client.query("COMMIT");
        return { lease: null, item: null, reason: "no_available_work" };
      }

      const leasedAt = new Date(timestamp);
      const lease: WorkerLease = {
        id: uid("wlease"),
        token: randomUUID(),
        dispatchKey: item.dispatchKey,
        kind: item.kind,
        jobId: item.jobId,
        projectId: item.projectId,
        workerId: request.workerId,
        status: "active",
        leasedAt: timestamp,
        expiresAt: new Date(leasedAt.getTime() + clampWorkerLeaseTtl(request.ttlSec) * 1000).toISOString(),
        releasedAt: null
      };

      await this.client.query(
        `
        INSERT INTO cutpilot_worker_leases (
          id, token, dispatch_key, kind, job_id, project_id, worker_id,
          status, leased_at, expires_at, released_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `,
        [
          lease.id,
          lease.token,
          lease.dispatchKey,
          lease.kind,
          lease.jobId,
          lease.projectId,
          lease.workerId,
          lease.status,
          lease.leasedAt,
          lease.expiresAt,
          lease.releasedAt
        ]
      );
      await this.client.query("COMMIT");
      return { lease, item, reason: "leased" };
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async releaseWorkerLease(leaseId: string, token: string | null | undefined): Promise<WorkerLeaseReleaseResult> {
    await this.client.query("BEGIN");
    try {
      const timestamp = now();
      await this.expireWorkerLeases(timestamp);
      const leaseRows = await this.client.query<Row>("SELECT * FROM cutpilot_worker_leases WHERE id = $1 LIMIT 1 FOR UPDATE", [leaseId]);
      const lease = leaseRows.rows[0] ? rowWorkerLease(leaseRows.rows[0]) : null;
      if (!lease) {
        await this.client.query("COMMIT");
        return { leaseId, released: false, status: null, reason: "not_found" };
      }
      if (lease.token !== token) {
        await this.client.query("COMMIT");
        return { leaseId, released: false, status: lease.status, reason: "token_mismatch" };
      }
      if (lease.status !== "active") {
        await this.client.query("COMMIT");
        return { leaseId, released: false, status: lease.status, reason: "not_active" };
      }

      await this.client.query("UPDATE cutpilot_worker_leases SET status = $2, released_at = $3 WHERE id = $1", [leaseId, "released", timestamp]);
      await this.client.query("COMMIT");
      return { leaseId, released: true, status: "released", reason: "released" };
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async renewWorkerLease(leaseId: string, input: { token?: string | null; ttlSec?: number } = {}): Promise<WorkerLeaseRenewResult> {
    await this.client.query("BEGIN");
    try {
      const timestamp = now();
      await this.expireWorkerLeases(timestamp);
      const leaseRows = await this.client.query<Row>("SELECT * FROM cutpilot_worker_leases WHERE id = $1 LIMIT 1 FOR UPDATE", [leaseId]);
      const lease = leaseRows.rows[0] ? rowWorkerLease(leaseRows.rows[0]) : null;
      if (!lease) {
        await this.client.query("COMMIT");
        return { leaseId, renewed: false, lease: null, status: null, reason: "not_found" };
      }
      if (lease.token !== input.token) {
        await this.client.query("COMMIT");
        return { leaseId, renewed: false, lease, status: lease.status, reason: "token_mismatch" };
      }
      if (lease.status !== "active") {
        await this.client.query("COMMIT");
        return { leaseId, renewed: false, lease, status: lease.status, reason: "not_active" };
      }

      const expiresAt = new Date(new Date(timestamp).getTime() + clampWorkerLeaseTtl(input.ttlSec) * 1000).toISOString();
      await this.client.query("UPDATE cutpilot_worker_leases SET expires_at = $2 WHERE id = $1", [leaseId, expiresAt]);
      await this.client.query("COMMIT");
      return { leaseId, renewed: true, lease: { ...lease, expiresAt }, status: "active", reason: "renewed" };
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async completeWorkerLease(leaseId: string, input: Partial<WorkerLeaseCompletionInput> = {}): Promise<WorkerLeaseCompletionResult> {
    await this.client.query("BEGIN");
    try {
      const timestamp = now();
      await this.expireWorkerLeases(timestamp);
      const leaseRows = await this.client.query<Row>("SELECT * FROM cutpilot_worker_leases WHERE id = $1 LIMIT 1 FOR UPDATE", [leaseId]);
      const lease = leaseRows.rows[0] ? rowWorkerLease(leaseRows.rows[0]) : null;
      if (!lease) {
        await this.client.query("COMMIT");
        return { leaseId, completed: false, lease: null, receipt: null, reason: "not_found" };
      }
      if (lease.token !== input.token) {
        await this.client.query("COMMIT");
        return { leaseId, completed: false, lease, receipt: null, reason: "token_mismatch" };
      }
      if (lease.status !== "active") {
        await this.client.query("COMMIT");
        return { leaseId, completed: false, lease, receipt: null, reason: "not_active" };
      }
      if (input.status !== "succeeded" && input.status !== "failed") {
        await this.client.query("COMMIT");
        return { leaseId, completed: false, lease, receipt: null, reason: "unsupported_status" };
      }

      const completion = await this.completeLeasedWorkerJob(lease, input as WorkerLeaseCompletionInput, timestamp);
      if (completion.reason !== "completed") {
        await this.client.query("COMMIT");
        return { leaseId, completed: false, lease, receipt: null, reason: completion.reason };
      }

      const releasedLease: WorkerLease = { ...lease, status: "released", releasedAt: timestamp };
      await this.client.query("UPDATE cutpilot_worker_leases SET status = $2, released_at = $3 WHERE id = $1", [leaseId, "released", timestamp]);
      await this.client.query("COMMIT");
      return { leaseId, completed: true, lease: releasedLease, receipt: completion.receipt, reason: "completed" };
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  private async completeLeasedWorkerJob(
    lease: WorkerLease,
    input: WorkerLeaseCompletionInput,
    timestamp: string
  ): Promise<{ reason: WorkerLeaseCompletionResult["reason"]; receipt: WorkerCompletionReceipt | null }> {
    if (lease.kind === "image_generation") return this.completeLeasedImageJob(lease, input, timestamp);
    if (lease.kind === "provider_generation") return this.completeLeasedGenerationJob(lease, input, timestamp);
    if (lease.kind === "render") return this.completeLeasedRenderJob(lease, input, timestamp);
    return { reason: "unsupported_status", receipt: null };
  }

  private async completeLeasedImageJob(
    lease: WorkerLease,
    input: WorkerLeaseCompletionInput,
    timestamp: string
  ): Promise<{ reason: WorkerLeaseCompletionResult["reason"]; receipt: WorkerCompletionReceipt | null }> {
    const jobs = await this.client.query<Row>("SELECT * FROM cutpilot_image_jobs WHERE id = $1 LIMIT 1 FOR UPDATE", [lease.jobId]);
    const job = jobs.rows[0];
    if (!job || !isActiveJobStatus(job.status)) return { reason: "job_not_active", receipt: null };
    if (input.status === "succeeded" && !validLiveCompletionOutput(lease, input, job)) return { reason: "invalid_outputs", receipt: null };

    if (input.status === "failed") {
      const error = workerError(input, "IMAGE_WORKER_FAILED", "Image generation worker failed.");
      const variants = jsonValue<ImageVariant[]>(job.variants, []).map((variant) => ({ ...variant, status: "failed" }));
      await this.client.query("UPDATE cutpilot_image_jobs SET status = $2, progress = $3, eta_sec = $4, stage = $5, error = $6, variants = $7, updated_at = $8 WHERE id = $1", [
        lease.jobId,
        "failed",
        1,
        0,
        "failed",
        json(error),
        json(variants),
        timestamp
      ]);
      await this.refundReservedCredits({
        projectId: lease.projectId,
        jobId: lease.jobId,
        action: "generateImages",
        credits: Number(job.count) * 4,
        note: "Image Maker variants failed by worker and were refunded"
      });
      return {
        reason: "completed",
        receipt: await this.workerCompletionReceipt({ kind: lease.kind, jobId: lease.jobId, projectId: lease.projectId, status: "failed", completedAt: timestamp, error })
      };
    }

    const variants = jsonValue<ImageVariant[]>(job.variants, []);
    const size = imageSize(job.aspect as Aspect);
    const nextVariants: ImageVariant[] = [];
    for (const [index, variant] of variants.entries()) {
      const outputVariant = input.outputs?.imageVariants?.find((item) => item.variantId === variant.id) || input.outputs?.imageVariants?.[index];
      const assetId = variant.assetId || uid("img");
      const imageUrl = outputVariant?.imageUrl || variant.url || `mock://image/${assetId}.png`;
      const thumbUrl = outputVariant?.thumbUrl || variant.thumbUrl || imageUrl;
      if (!variant.assetId) {
        await this.client.query(
          `
          INSERT INTO cutpilot_image_assets (
            id, project_id, kind, role, source, label, prompt, url, thumb_url,
            aspect, width, height, rights, created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        `,
          [
            assetId,
            lease.projectId,
            "image",
            job.role,
            "image_maker",
            `${job.purpose} ${variant.label}`,
            `${job.prompt} / ${job.style}`,
            imageUrl,
            thumbUrl,
            job.aspect,
            size.width,
            size.height,
            json({ status: "generated", note: "Generated by Image Maker worker." }),
            timestamp,
            timestamp
          ]
        );
      }
      await this.insertMediaArtifact({
        projectId: lease.projectId,
        ownerType: "imageAsset",
        ownerId: assetId,
        sourceJobId: lease.jobId,
        kind: "image",
        role: "image_asset",
        url: imageUrl,
        storageKey: outputVariant?.imageStorageKey || imageVariantStorageKey(lease.projectId, lease.jobId, variant.id, "image_asset"),
        contentType: "image/png",
        bytes: null,
        status: "stored"
      });
      await this.insertMediaArtifact({
        projectId: lease.projectId,
        ownerType: "imageAsset",
        ownerId: assetId,
        sourceJobId: lease.jobId,
        kind: "image",
        role: "image_thumbnail",
        url: thumbUrl,
        storageKey: outputVariant?.thumbnailStorageKey || imageVariantStorageKey(lease.projectId, lease.jobId, variant.id, "image_thumbnail"),
        contentType: "image/jpeg",
        bytes: null,
        status: "stored"
      });
      nextVariants.push({ ...variant, assetId, status: "done", url: imageUrl, thumbUrl, scoreLabel: index === 0 ? "추천" : variant.scoreLabel });
    }

    await this.client.query("UPDATE cutpilot_image_jobs SET status = $2, progress = $3, eta_sec = $4, stage = $5, error = $6, variants = $7, updated_at = $8 WHERE id = $1", [
      lease.jobId,
      "done",
      1,
      0,
      "done",
      null,
      json(nextVariants),
      timestamp
    ]);
    await this.captureReservedCredits({
      projectId: lease.projectId,
      jobId: lease.jobId,
      action: "generateImages",
      credits: Number(job.count) * 4,
      note: "Image Maker variants completed by worker"
    });
    return {
      reason: "completed",
      receipt: await this.workerCompletionReceipt({ kind: lease.kind, jobId: lease.jobId, projectId: lease.projectId, status: "done", completedAt: timestamp, error: null })
    };
  }

  private async completeLeasedGenerationJob(
    lease: WorkerLease,
    input: WorkerLeaseCompletionInput,
    timestamp: string
  ): Promise<{ reason: WorkerLeaseCompletionResult["reason"]; receipt: WorkerCompletionReceipt | null }> {
    const jobs = await this.client.query<Row>("SELECT * FROM cutpilot_generation_jobs WHERE id = $1 LIMIT 1 FOR UPDATE", [lease.jobId]);
    const job = jobs.rows[0];
    if (!job || !isActiveJobStatus(job.status)) return { reason: "job_not_active", receipt: null };
    if (input.status === "succeeded" && !validLiveCompletionOutput(lease, input, job)) return { reason: "invalid_outputs", receipt: null };
    const takeRows = await this.client.query<Row>("SELECT * FROM cutpilot_takes WHERE id = $1 LIMIT 1 FOR UPDATE", [job.take_id]);
    const take = takeRows.rows[0] || null;
    const shotRows = await this.client.query<Row>("SELECT * FROM cutpilot_shots WHERE id = $1 LIMIT 1 FOR UPDATE", [job.shot_id]);
    const shot = shotRows.rows[0] || null;
    const credits = take?.upgrade_source_take_id ? 22 : 6;
    const action: CreditTransaction["action"] = take?.upgrade_source_take_id ? "upgradeTake" : "generateShot";

    if (input.status === "failed") {
      const error = workerError(input, "PROVIDER_WORKER_FAILED", "Provider generation worker failed.");
      await this.client.query("UPDATE cutpilot_generation_jobs SET status = $2, progress = $3, eta_sec = $4, stage = $5, error = $6, updated_at = $7 WHERE id = $1", [
        lease.jobId,
        "failed",
        1,
        0,
        "failed",
        json(error),
        timestamp
      ]);
      await this.client.query("UPDATE cutpilot_provider_attempts SET status = $2, completed_at = $3, error_code = $4, retryable = $5, fallback_suggested = $6 WHERE generation_job_id = $1 AND status IN ('queued', 'submitted', 'polling')", [
        lease.jobId,
        "failed",
        timestamp,
        error.code,
        error.retryable,
        error.fallbackSuggested
      ]);
      if (take) {
        await this.client.query("UPDATE cutpilot_takes SET status = $2, video_url = $3, poster_url = $4, metrics = $5 WHERE id = $1", [
          take.id,
          "failed",
          null,
          null,
          json({})
        ]);
      }
      if (shot) {
        await this.client.query("UPDATE cutpilot_shots SET status = $2, quality_flags = $3 WHERE id = $1", [
          shot.id,
          "failed",
          json([{ axis: "motion", score: 2, hint: "Generation failed. Retry this shot for another take." }])
        ]);
      }
      await this.refundReservedCredits({ projectId: lease.projectId, jobId: lease.jobId, action, credits, note: "Video take generation failed by worker and was refunded" });
      await this.refreshProjectProgress(lease.projectId, timestamp);
      return {
        reason: "completed",
        receipt: await this.workerCompletionReceipt({ kind: lease.kind, jobId: lease.jobId, projectId: lease.projectId, status: "failed", completedAt: timestamp, error })
      };
    }

    const videoUrl = input.outputs?.videoUrl || `mock://video/${lease.jobId}.mp4`;
    const posterUrl = input.outputs?.posterUrl || null;
    await this.client.query("UPDATE cutpilot_generation_jobs SET status = $2, progress = $3, eta_sec = $4, stage = $5, error = $6, updated_at = $7 WHERE id = $1", [
      lease.jobId,
      "done",
      1,
      0,
      "done",
      null,
      timestamp
    ]);
    await this.client.query("UPDATE cutpilot_provider_attempts SET status = $2, completed_at = $3, error_code = $4, retryable = $5, fallback_suggested = $6 WHERE generation_job_id = $1 AND status IN ('queued', 'submitted', 'polling')", [
      lease.jobId,
      "succeeded",
      timestamp,
      null,
      false,
      false
    ]);
    if (take) {
      await this.client.query("UPDATE cutpilot_takes SET status = $2, video_url = $3, poster_url = $4, metrics = $5 WHERE id = $1", [
        take.id,
        "done",
        videoUrl,
        posterUrl,
        json({ fidelity: 0.84, consistency: 0.82, motion: 0.78, overall: 0.82 })
      ]);
      await this.insertMediaArtifact({
        projectId: lease.projectId,
        ownerType: "take",
        ownerId: String(take.id),
        sourceJobId: lease.jobId,
        kind: "video",
        role: "take_video",
        url: videoUrl,
        storageKey: input.outputs?.videoStorageKey || takeStorageKey(lease.projectId, String(take.id), "take_video"),
        contentType: "video/mp4",
        bytes: null,
        status: "stored"
      });
      if (posterUrl) {
        await this.insertMediaArtifact({
          projectId: lease.projectId,
          ownerType: "take",
          ownerId: String(take.id),
          sourceJobId: lease.jobId,
          kind: "image",
          role: "take_poster",
          url: posterUrl,
          storageKey: input.outputs?.posterStorageKey || takeStorageKey(lease.projectId, String(take.id), "take_poster"),
          contentType: "image/jpeg",
          bytes: null,
          status: "stored"
        });
      }
    }
    if (shot) {
      await this.client.query("UPDATE cutpilot_shots SET status = $2, selected_take_id = COALESCE(selected_take_id, $3), quality_flags = $4 WHERE id = $1", [
        shot.id,
        "reviewing",
        job.take_id,
        json([])
      ]);
    }
    await this.captureReservedCredits({ projectId: lease.projectId, jobId: lease.jobId, action, credits, note: "Video take generation completed by worker" });
    await this.refreshProjectProgress(lease.projectId, timestamp);
    return {
      reason: "completed",
      receipt: await this.workerCompletionReceipt({ kind: lease.kind, jobId: lease.jobId, projectId: lease.projectId, status: "done", completedAt: timestamp, error: null })
    };
  }

  private async completeLeasedRenderJob(
    lease: WorkerLease,
    input: WorkerLeaseCompletionInput,
    timestamp: string
  ): Promise<{ reason: WorkerLeaseCompletionResult["reason"]; receipt: WorkerCompletionReceipt | null }> {
    const jobs = await this.client.query<Row>("SELECT * FROM cutpilot_render_jobs WHERE id = $1 LIMIT 1 FOR UPDATE", [lease.jobId]);
    const job = jobs.rows[0];
    if (!job || !isActiveJobStatus(job.status)) return { reason: "job_not_active", receipt: null };
    if (input.status === "succeeded" && !validLiveCompletionOutput(lease, input, job)) return { reason: "invalid_outputs", receipt: null };

    if (input.status === "failed") {
      const error = workerError(input, "RENDER_WORKER_FAILED", "Render worker failed.");
      await this.client.query("UPDATE cutpilot_render_jobs SET status = $2, progress = $3, eta_sec = $4, error = $5, updated_at = $6 WHERE id = $1", [
        lease.jobId,
        "failed",
        1,
        0,
        json(error),
        timestamp
      ]);
      const spec = jsonValue<ExportSpec>(job.spec, { resolution: "1080p", cut: "full", aspect: "9:16", caption: "burn-in" });
      await this.refundReservedCredits({ projectId: lease.projectId, jobId: lease.jobId, action: "startRender", credits: 16, note: `${spec.cut} render failed by worker and was refunded` });
      const activeRenderRows = await this.client.query<Row>("SELECT id FROM cutpilot_render_jobs WHERE project_id = $1 AND status IN ('queued', 'running') LIMIT 1", [lease.projectId]);
      if (!activeRenderRows.rows[0]) {
        await this.client.query("UPDATE cutpilot_projects SET status = $2, updated_at = $3 WHERE id = $1 AND status = $4", [lease.projectId, "edited", timestamp, "rendering"]);
      }
      return {
        reason: "completed",
        receipt: await this.workerCompletionReceipt({ kind: lease.kind, jobId: lease.jobId, projectId: lease.projectId, status: "failed", completedAt: timestamp, error })
      };
    }

    const outputUrl = input.outputs?.renderOutputUrl || input.outputs?.videoUrl || `mock://render/${lease.jobId}.mp4`;
    const shareUrl = input.outputs?.shareUrl || null;
    await this.client.query("UPDATE cutpilot_render_jobs SET status = $2, progress = $3, eta_sec = $4, stage = $5, output_url = $6, share_url = $7, error = $8, updated_at = $9 WHERE id = $1", [
      lease.jobId,
      "done",
      1,
      0,
      "done",
      outputUrl,
      shareUrl,
      null,
      timestamp
    ]);
    await this.insertMediaArtifact({
      projectId: lease.projectId,
      ownerType: "renderJob",
      ownerId: lease.jobId,
      sourceJobId: lease.jobId,
      kind: "video",
      role: "render_output",
      url: outputUrl,
      storageKey: input.outputs?.renderStorageKey || renderStorageKey(lease.projectId, lease.jobId),
      contentType: "video/mp4",
      bytes: null,
      status: "stored"
    });
    const spec = jsonValue<ExportSpec>(job.spec, { resolution: "1080p", cut: "full", aspect: "9:16", caption: "burn-in" });
    await this.captureReservedCredits({ projectId: lease.projectId, jobId: lease.jobId, action: "startRender", credits: 16, note: `${spec.cut} render completed by worker` });
    await this.client.query("UPDATE cutpilot_projects SET default_render_job_id = COALESCE(default_render_job_id, $2), updated_at = $3 WHERE id = $1", [
      lease.projectId,
      lease.jobId,
      timestamp
    ]);
    const unfinishedRows = await this.client.query<Row>("SELECT id FROM cutpilot_render_jobs WHERE project_id = $1 AND status != $2 LIMIT 1", [lease.projectId, "done"]);
    if (!unfinishedRows.rows[0]) {
      await this.client.query("UPDATE cutpilot_projects SET status = $2, thumb_url = COALESCE(thumb_url, $3), updated_at = $4 WHERE id = $1", [
        lease.projectId,
        "done",
        outputUrl,
        timestamp
      ]);
    }
    return {
      reason: "completed",
      receipt: await this.workerCompletionReceipt({ kind: lease.kind, jobId: lease.jobId, projectId: lease.projectId, status: "done", completedAt: timestamp, error: null })
    };
  }

  private async refreshProjectProgress(projectId: string, timestamp: string) {
    const projectShots = await this.client.query<Row>("SELECT status, selected_take_id FROM cutpilot_shots WHERE project_id = $1", [projectId]);
    await this.client.query("UPDATE cutpilot_projects SET progress = $2, status = $3, updated_at = $4 WHERE id = $1", [
      projectId,
      json(projectProgressFromShots(projectShots.rows as Array<{ status: string; selected_take_id: unknown }>)),
      projectStatusFromShots(projectShots.rows as Array<{ status: string; selected_take_id: unknown }>),
      timestamp
    ]);
  }

  async startRender(projectId: string, input: LiveStartRenderInput): Promise<{ jobs: RenderJob[] }> {
    await this.client.query("BEGIN");
    try {
      await this.requireProject(projectId);
      const activeRows = await this.client.query<Row>(
        "SELECT spec FROM cutpilot_render_jobs WHERE project_id = $1 AND status IN ('queued', 'running') FOR UPDATE",
        [projectId]
      );
      const activeSpecs = new Set(
        activeRows.rows.map((row) =>
          renderSpecKey(jsonValue<ExportSpec>(row.spec, { resolution: "1080p", cut: "full", aspect: "9:16", caption: "burn-in" }))
        )
      );
      const nextSpecs = input.specs.filter((spec) => !activeSpecs.has(renderSpecKey(spec)));
      if (!nextSpecs.length) throw new Error("Render job already active");

      const requiredCredits = nextSpecs.length * 16;
      const available = await this.availableCredits(projectId);
      if (available < requiredCredits) throw new CreditReservationError(requiredCredits, available);

      const bundle = await new PostgresLivePersistenceReadAdapter(this.client).getProjectBundle(projectId);
      if (!bundle) throw new Error("Project not found");
      const jobs: RenderJob[] = [];

      for (let index = 0; index < nextSpecs.length; index += 1) {
        const spec = nextSpecs[index];
        const preview = buildLiveRenderPreview(bundle, spec);
        const timestamp = now();
        const job: RenderJob = {
          id: uid("rnd"),
          projectId,
          retryOfJobId: input.retryOfJobId || null,
          spec,
          stage: "assemble",
          progress: 0,
          status: "queued",
          outputUrl: null,
          shareUrl: null,
          etaSec: 90 - index * 14,
          dueAt: Date.now() + 4200 + index * 1200,
          createdAt: timestamp,
          updatedAt: timestamp,
          error: null,
          rightsReview: preview.rightsReview,
          renderPlan: preview.renderPlan
        };
        await this.reserveCredits({
          projectId,
          jobId: job.id,
          action: "startRender",
          credits: 16,
          note: `${job.spec.cut} render reserved`
        });
        await this.client.query(
          `
          INSERT INTO cutpilot_render_jobs (
            id, project_id, retry_of_job_id, spec, stage, progress, status,
            output_url, share_url, eta_sec, due_at, error, rights_review,
            render_plan, created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        `,
          [
            job.id,
            job.projectId,
            job.retryOfJobId,
            json(job.spec),
            job.stage,
            job.progress,
            job.status,
            job.outputUrl,
            job.shareUrl,
            job.etaSec,
            job.dueAt,
            job.error ? json(job.error) : null,
            json(job.rightsReview),
            json(job.renderPlan),
            job.createdAt,
            job.updatedAt
          ]
        );
        jobs.push(job);
      }

      await this.client.query("UPDATE cutpilot_projects SET status = $2, updated_at = $3 WHERE id = $1", [projectId, "rendering", now()]);
      await this.client.query("COMMIT");
      return { jobs };
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async generateShot(shotId: string, input: LiveShotGenerateInput = {}): Promise<{ takes: Take[]; jobs: GenerationJob[] }> {
    await this.client.query("BEGIN");
    try {
      const shotRows = await this.client.query<Row>("SELECT * FROM cutpilot_shots WHERE id = $1 FOR UPDATE", [shotId]);
      const shotRow = shotRows.rows[0];
      if (!shotRow) throw new Error("Shot not found");

      const currentShot = rowShot(shotRow);
      const takeCount = Math.max(1, Math.min(input.takeCount || 3, 3));
      const tier = input.tier || currentShot.requirements.tier || "fast";
      const shot: Shot = {
        ...currentShot,
        status: "generating",
        requirements: { ...currentShot.requirements, tier },
        qualityFlags: []
      };
      const referenceRows = await this.client.query<Row>(
        `
        SELECT u.asset_id, u.role, u.mode, a.url, a.rights
        FROM cutpilot_asset_usages u
        JOIN cutpilot_image_assets a ON a.id = u.asset_id AND a.project_id = u.project_id
        WHERE u.project_id = $1 AND u.target = $2 AND u.target_id = $3
      `,
        [shot.projectId, "shot", shot.id]
      );
      const references = referenceRows.rows.map(rowGenerationReference);
      const takes: Take[] = [];
      const jobs: GenerationJob[] = [];

      await this.client.query("UPDATE cutpilot_shots SET status = $2, requirements = $3, quality_flags = $4 WHERE id = $1", [
        shot.id,
        shot.status,
        json(shot.requirements),
        json(shot.qualityFlags)
      ]);

      for (let index = 0; index < takeCount; index += 1) {
        const promptPackage = generationPromptPackage(shot, references);
        const routing = chooseProviderRoute(shot, promptPackage, index);
        const createdAt = now();
        const take: Take = {
          id: uid("tak"),
          shotId: shot.id,
          projectId: shot.projectId,
          label: takeLabel(index),
          status: "queued",
          videoUrl: null,
          posterUrl: null,
          durationSec: shot.durationSec,
          tier,
          engineUsed: `${routing.selected.provider}:${routing.selected.model}`,
          metrics: {},
          createdAt
        };
        const attempt = providerAttempt(routing.selected, createdAt);
        const job: GenerationJob = {
          id: uid("gen"),
          shotId: shot.id,
          takeId: take.id,
          projectId: shot.projectId,
          retryOfJobId: input.retryOfJobId || null,
          status: "queued",
          progress: 0,
          etaSec: 6,
          stage: "queued",
          shouldFail: false,
          dueAt: Date.now() + 2500 + (shot.order % 4) * 650,
          createdAt,
          updatedAt: createdAt,
          error: null,
          promptPackage,
          routing,
          providerAttempts: [attempt]
        };

        await this.reserveCredits({
          projectId: shot.projectId,
          jobId: job.id,
          action: "generateShot",
          credits: 6,
          note: "Video take generation reserved"
        });
        await this.client.query(
          `
          INSERT INTO cutpilot_takes (
            id, shot_id, project_id, label, status, video_url, poster_url,
            duration_sec, tier, engine_used, metrics, created_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `,
          [
            take.id,
            take.shotId,
            take.projectId,
            take.label,
            take.status,
            take.videoUrl,
            take.posterUrl,
            take.durationSec,
            take.tier,
            take.engineUsed,
            json(take.metrics),
            take.createdAt
          ]
        );
        await this.client.query(
          `
          INSERT INTO cutpilot_generation_jobs (
            id, project_id, shot_id, take_id, retry_of_job_id, status, progress,
            eta_sec, stage, should_fail, due_at, error, prompt_package, routing,
            created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        `,
          [
            job.id,
            job.projectId,
            job.shotId,
            job.takeId,
            job.retryOfJobId,
            job.status,
            job.progress,
            job.etaSec,
            job.stage,
            job.shouldFail,
            job.dueAt,
            job.error ? json(job.error) : null,
            json(job.promptPackage),
            json(job.routing),
            job.createdAt,
            job.updatedAt
          ]
        );
        await this.client.query(
          `
          INSERT INTO cutpilot_provider_attempts (
            id, generation_job_id, provider, model, request_id, status,
            started_at, completed_at, latency_ms, error_code, retryable, fallback_suggested
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `,
          [
            attempt.id,
            job.id,
            attempt.provider,
            attempt.model,
            attempt.requestId,
            attempt.status,
            attempt.startedAt,
            attempt.completedAt,
            attempt.latencyMs,
            attempt.errorCode,
            attempt.retryable,
            attempt.fallbackSuggested
          ]
        );
        takes.push(take);
        jobs.push(job);
      }

      const projectShots = await this.client.query<Row>("SELECT status, selected_take_id FROM cutpilot_shots WHERE project_id = $1", [shot.projectId]);
      await this.client.query("UPDATE cutpilot_projects SET progress = $2, status = $3, updated_at = $4 WHERE id = $1", [
        shot.projectId,
        json(projectProgressFromShots(projectShots.rows as Array<{ status: string; selected_take_id: unknown }>)),
        projectStatusFromShots(projectShots.rows as Array<{ status: string; selected_take_id: unknown }>),
        now()
      ]);
      await this.client.query("COMMIT");
      return { takes, jobs };
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async generateAll(projectId: string, input: LiveGenerateAllInput = {}): Promise<{ jobs: GenerationJob[] }> {
    const projects = await this.client.query<Row>("SELECT id FROM cutpilot_projects WHERE id = $1 LIMIT 1", [projectId]);
    if (!projects.rows[0]) throw new Error("Project not found");

    const shotRows = await this.client.query<Row>("SELECT * FROM cutpilot_shots WHERE project_id = $1 ORDER BY order_index", [projectId]);
    const targetShots = shotRows.rows.map(rowShot).filter((shot) => shot.status === "pending" || shot.status === "failed");
    const requiredCredits = targetShots.length * 18;
    const available = await this.availableCredits(projectId);
    if (available < requiredCredits) throw new CreditReservationError(requiredCredits, available);

    const jobs: GenerationJob[] = [];
    for (const shot of targetShots) {
      const generated = await this.generateShot(shot.id, { tier: input.tier || "fast", takeCount: 3 });
      jobs.push(...generated.jobs);
    }
    return { jobs };
  }

  async upgradeTake(takeId: string, input: LiveTakeUpgradeInput = {}): Promise<{ take: Take; job: GenerationJob }> {
    await this.client.query("BEGIN");
    try {
      const sourceRows = await this.client.query<Row>("SELECT * FROM cutpilot_takes WHERE id = $1 LIMIT 1 FOR UPDATE", [takeId]);
      const sourceRow = sourceRows.rows[0];
      if (!sourceRow || sourceRow.status !== "done") throw new Error("Done take not found");
      const source = rowTake(sourceRow);

      const shotRows = await this.client.query<Row>("SELECT * FROM cutpilot_shots WHERE id = $1 FOR UPDATE", [source.shotId]);
      const shotRow = shotRows.rows[0];
      if (!shotRow) throw new Error("Source shot not found");
      const currentShot = rowShot(shotRow);
      const shot: Shot = {
        ...currentShot,
        status: "generating",
        requirements: { ...currentShot.requirements, tier: "final" }
      };
      const referenceRows = await this.client.query<Row>(
        `
        SELECT u.asset_id, u.role, u.mode, a.url, a.rights
        FROM cutpilot_asset_usages u
        JOIN cutpilot_image_assets a ON a.id = u.asset_id AND a.project_id = u.project_id
        WHERE u.project_id = $1 AND u.target = $2 AND u.target_id = $3
      `,
        [shot.projectId, "shot", shot.id]
      );
      const promptPackage = generationPromptPackage(shot, referenceRows.rows.map(rowGenerationReference));
      const routing = chooseProviderRoute(shot, promptPackage, 0);
      const createdAt = now();
      const take: Take = {
        id: uid("tak"),
        shotId: shot.id,
        projectId: shot.projectId,
        label: "Publish",
        status: "queued",
        videoUrl: null,
        posterUrl: null,
        durationSec: shot.durationSec,
        tier: "final",
        engineUsed: `${routing.selected.provider}:${routing.selected.model}`,
        metrics: {},
        createdAt,
        upgradeSourceTakeId: source.id,
        upgradeMode: input.mode || "final_regenerate"
      };
      const attempt = providerAttempt(routing.selected, createdAt);
      const job: GenerationJob = {
        id: uid("gen"),
        shotId: shot.id,
        takeId: take.id,
        projectId: shot.projectId,
        retryOfJobId: null,
        status: "queued",
        progress: 0,
        etaSec: 6,
        stage: "queued",
        shouldFail: false,
        dueAt: Date.now() + 2500 + (shot.order % 4) * 650,
        createdAt,
        updatedAt: createdAt,
        error: null,
        promptPackage,
        routing,
        providerAttempts: [attempt]
      };

      await this.reserveCredits({
        projectId: shot.projectId,
        jobId: job.id,
        action: "upgradeTake",
        credits: 22,
        note: "Publishing quality upgrade reserved"
      });
      await this.client.query("UPDATE cutpilot_shots SET status = $2, requirements = $3 WHERE id = $1", [
        shot.id,
        shot.status,
        json(shot.requirements)
      ]);
      await this.client.query(
        `
        INSERT INTO cutpilot_takes (
          id, shot_id, project_id, label, status, video_url, poster_url,
          duration_sec, tier, engine_used, metrics, created_at,
          upgrade_source_take_id, upgrade_mode
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `,
        [
          take.id,
          take.shotId,
          take.projectId,
          take.label,
          take.status,
          take.videoUrl,
          take.posterUrl,
          take.durationSec,
          take.tier,
          take.engineUsed,
          json(take.metrics),
          take.createdAt,
          take.upgradeSourceTakeId,
          take.upgradeMode
        ]
      );
      await this.client.query(
        `
        INSERT INTO cutpilot_generation_jobs (
          id, project_id, shot_id, take_id, retry_of_job_id, status, progress,
          eta_sec, stage, should_fail, due_at, error, prompt_package, routing,
          created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `,
        [
          job.id,
          job.projectId,
          job.shotId,
          job.takeId,
          job.retryOfJobId,
          job.status,
          job.progress,
          job.etaSec,
          job.stage,
          job.shouldFail,
          job.dueAt,
          job.error ? json(job.error) : null,
          json(job.promptPackage),
          json(job.routing),
          job.createdAt,
          job.updatedAt
        ]
      );
      await this.client.query(
        `
        INSERT INTO cutpilot_provider_attempts (
          id, generation_job_id, provider, model, request_id, status,
          started_at, completed_at, latency_ms, error_code, retryable, fallback_suggested
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `,
        [
          attempt.id,
          job.id,
          attempt.provider,
          attempt.model,
          attempt.requestId,
          attempt.status,
          attempt.startedAt,
          attempt.completedAt,
          attempt.latencyMs,
          attempt.errorCode,
          attempt.retryable,
          attempt.fallbackSuggested
        ]
      );

      const projectShots = await this.client.query<Row>("SELECT status, selected_take_id FROM cutpilot_shots WHERE project_id = $1", [shot.projectId]);
      await this.client.query("UPDATE cutpilot_projects SET progress = $2, status = $3, updated_at = $4 WHERE id = $1", [
        shot.projectId,
        json(projectProgressFromShots(projectShots.rows as Array<{ status: string; selected_take_id: unknown }>)),
        projectStatusFromShots(projectShots.rows as Array<{ status: string; selected_take_id: unknown }>),
        now()
      ]);
      await this.client.query("COMMIT");
      return { take, job };
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async createImageJob(input: LiveImageJobInput): Promise<{ job: ImageJob }> {
    await this.client.query("BEGIN");
    try {
      const prompt = input.prompt.trim();
      if (!prompt) throw new Error("Image prompt is required");
      const count = Math.max(1, Math.min(input.count || 4, 4));
      const timestamp = now();
      const variants: ImageVariant[] = Array.from({ length: count }, (_, index) => ({
        id: uid("ivar"),
        assetId: null,
        label: String.fromCharCode(65 + index),
        status: "queued",
        url: null,
        thumbUrl: null,
        scoreLabel: imageVariantScoreLabel(index)
      }));
      const job: ImageJob = {
        id: uid("ijob"),
        projectId: input.projectId,
        retryOfJobId: input.retryOfJobId || null,
        status: "queued",
        progress: 0,
        etaSec: 8,
        stage: "queued",
        prompt,
        purpose: input.purpose,
        role: input.role,
        aspect: input.aspect,
        style: input.style?.trim() || "clean commercial visual",
        count,
        variants,
        dueAt: Date.now() + 3600,
        createdAt: timestamp,
        updatedAt: timestamp,
        error: null
      };

      await this.reserveCredits({
        projectId: input.projectId,
        jobId: job.id,
        action: "generateImages",
        credits: count * 4,
        note: "Image Maker variants reserved"
      });
      await this.client.query(
        `
        INSERT INTO cutpilot_image_jobs (
          id, project_id, retry_of_job_id, status, progress, eta_sec, stage,
          prompt, purpose, role, aspect, style, count, variants, due_at,
          error, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      `,
        [
          job.id,
          job.projectId,
          job.retryOfJobId,
          job.status,
          job.progress,
          job.etaSec,
          job.stage,
          job.prompt,
          job.purpose,
          job.role,
          job.aspect,
          job.style,
          job.count,
          json(job.variants),
          job.dueAt,
          job.error ? json(job.error) : null,
          job.createdAt,
          job.updatedAt
        ]
      );
      await this.client.query("COMMIT");
      return { job };
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async registerExternalImage(input: LiveExternalImageInput): Promise<ImageAsset> {
    await this.client.query("BEGIN");
    try {
      const projects = await this.client.query<Row>("SELECT id, aspect FROM cutpilot_projects WHERE id = $1 FOR UPDATE", [input.projectId]);
      const project = projects.rows[0];
      if (!project) throw new Error("Project not found");

      const timestamp = now();
      const aspect = input.aspect || (project.aspect as Aspect);
      const size = imageSize(aspect);
      const label = input.label.trim();
      const url = input.url.trim();
      const asset: ImageAsset = {
        id: uid("img"),
        projectId: input.projectId,
        kind: "image",
        role: input.role,
        source: "external",
        label,
        prompt: input.prompt?.trim() || "External image",
        url,
        thumbUrl: url,
        aspect,
        width: size.width,
        height: size.height,
        rights: {
          status: input.rightsConfirmed ? "user_confirmed" : "needs_review",
          note: input.rightsConfirmed ? "User confirmed image usage rights." : "Image usage rights require review."
        },
        createdAt: timestamp,
        updatedAt: timestamp
      };
      await this.client.query(
        `
        INSERT INTO cutpilot_image_assets (
          id, project_id, kind, role, source, label, prompt, url, thumb_url,
          aspect, width, height, rights, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `,
        [
          asset.id,
          asset.projectId,
          asset.kind,
          asset.role,
          asset.source,
          asset.label,
          asset.prompt,
          asset.url,
          asset.thumbUrl,
          asset.aspect,
          asset.width,
          asset.height,
          json(asset.rights),
          asset.createdAt,
          asset.updatedAt
        ]
      );

      const boardRows = await this.client.query<Row>("SELECT * FROM cutpilot_reference_boards WHERE project_id = $1 FOR UPDATE", [input.projectId]);
      const board = rowReferenceBoard(boardRows.rows[0] || null, input.projectId);
      const bucket = boardBucket(asset.role);
      if (!board[bucket].includes(asset.id)) board[bucket] = [...board[bucket], asset.id];
      await this.upsertReferenceBoard(board, timestamp);
      await this.client.query("UPDATE cutpilot_projects SET updated_at = $2 WHERE id = $1", [input.projectId, timestamp]);
      await this.client.query("COMMIT");
      return asset;
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async attachImageToShot(shotId: string, input: LiveShotReferenceInput): Promise<Shot> {
    await this.client.query("BEGIN");
    try {
      const shots = await this.client.query<Row>("SELECT * FROM cutpilot_shots WHERE id = $1 FOR UPDATE", [shotId]);
      const shotRow = shots.rows[0];
      const assets = await this.client.query<Row>("SELECT * FROM cutpilot_image_assets WHERE id = $1 FOR UPDATE", [input.assetId]);
      const assetRow = assets.rows[0];
      if (!shotRow || !assetRow || String(shotRow.project_id) !== String(assetRow.project_id)) {
        throw new Error("Shot or image asset not found");
      }

      const shot = rowShot(shotRow);
      const referenceImageIds = shot.referenceImageIds.includes(input.assetId) ? shot.referenceImageIds : [...shot.referenceImageIds, input.assetId];
      await this.client.query(
        `
        INSERT INTO cutpilot_asset_usages (asset_id, project_id, target, target_id, role, mode, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (asset_id, target, target_id, mode) DO NOTHING
      `,
        [input.assetId, shot.projectId, "shot", shot.id, assetRow.role, input.mode, now()]
      );

      const boardRows = await this.client.query<Row>("SELECT * FROM cutpilot_reference_boards WHERE project_id = $1 FOR UPDATE", [shot.projectId]);
      const board = rowReferenceBoard(boardRows.rows[0] || null, shot.projectId);
      const bucket = boardBucket(assetRow.role as ImageAssetRole);
      if (!board[bucket].includes(input.assetId)) board[bucket] = [...board[bucket], input.assetId];
      await this.upsertReferenceBoard(board, now());

      const requirements = nextReferenceRequirements(shot, await this.referenceUsageModes(shot.projectId, shot.id), await this.projectIntent(shot.projectId));
      const updated = await this.client.query<Row>(
        "UPDATE cutpilot_shots SET reference_image_ids = $2, requirements = $3 WHERE id = $1 RETURNING *",
        [shot.id, json(referenceImageIds), json(requirements)]
      );
      await this.client.query("COMMIT");
      return rowShot(updated.rows[0] || { ...shotRow, reference_image_ids: referenceImageIds, requirements });
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async detachImageFromShot(shotId: string, assetId: string): Promise<Shot> {
    await this.client.query("BEGIN");
    try {
      const shots = await this.client.query<Row>("SELECT * FROM cutpilot_shots WHERE id = $1 FOR UPDATE", [shotId]);
      const shotRow = shots.rows[0];
      const assets = await this.client.query<Row>("SELECT * FROM cutpilot_image_assets WHERE id = $1 FOR UPDATE", [assetId]);
      const assetRow = assets.rows[0];
      if (!shotRow || !assetRow || String(shotRow.project_id) !== String(assetRow.project_id)) {
        throw new Error("Shot or image asset not found");
      }

      const shot = rowShot(shotRow);
      const referenceImageIds = shot.referenceImageIds.filter((id) => id !== assetId);
      await this.client.query("DELETE FROM cutpilot_asset_usages WHERE asset_id = $1 AND project_id = $2 AND target = $3 AND target_id = $4", [
        assetId,
        shot.projectId,
        "shot",
        shot.id
      ]);

      const requirements = nextReferenceRequirements(shot, await this.referenceUsageModes(shot.projectId, shot.id), await this.projectIntent(shot.projectId));
      const updated = await this.client.query<Row>(
        "UPDATE cutpilot_shots SET reference_image_ids = $2, requirements = $3 WHERE id = $1 RETURNING *",
        [shot.id, json(referenceImageIds), json(requirements)]
      );
      await this.client.query("COMMIT");
      return rowShot(updated.rows[0] || { ...shotRow, reference_image_ids: referenceImageIds, requirements });
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async deleteImageAsset(projectId: string, assetId: string, options: { force?: boolean } = {}): Promise<AssetDeleteResult> {
    await this.client.query("BEGIN");
    try {
      const assets = await this.client.query<Row>("SELECT * FROM cutpilot_image_assets WHERE id = $1 AND project_id = $2 FOR UPDATE", [assetId, projectId]);
      if (!assets.rows[0]) throw new Error("Image asset not found");

      const usageRows = await this.client.query<Row>("SELECT * FROM cutpilot_asset_usages WHERE project_id = $1 AND asset_id = $2", [projectId, assetId]);
      const usageCount = usageRows.rows.length;
      if (usageCount && !options.force) {
        const remainingAssets = await this.countProjectImageAssets(projectId);
        await this.client.query("COMMIT");
        return { deleted: false, assetId, blockedByUsage: true, usageCount, remainingAssets };
      }

      const shotRows = await this.client.query<Row>(
        "SELECT * FROM cutpilot_shots WHERE project_id = $1 AND reference_image_ids ? $2 FOR UPDATE",
        [projectId, assetId]
      );
      await this.client.query("DELETE FROM cutpilot_asset_usages WHERE project_id = $1 AND asset_id = $2", [projectId, assetId]);
      const intent = await this.projectIntent(projectId);
      for (const shotRow of shotRows.rows) {
        const shot = rowShot(shotRow);
        const referenceImageIds = shot.referenceImageIds.filter((id) => id !== assetId);
        const requirements = nextReferenceRequirements(shot, await this.referenceUsageModes(projectId, shot.id), intent);
        await this.client.query("UPDATE cutpilot_shots SET reference_image_ids = $2, requirements = $3 WHERE id = $1", [
          shot.id,
          json(referenceImageIds),
          json(requirements)
        ]);
      }

      const boardRows = await this.client.query<Row>("SELECT * FROM cutpilot_reference_boards WHERE project_id = $1 FOR UPDATE", [projectId]);
      if (boardRows.rows[0]) await this.upsertReferenceBoard(removeAssetFromReferenceBoard(rowReferenceBoard(boardRows.rows[0], projectId), assetId), now());
      await this.client.query(
        `
        UPDATE cutpilot_image_jobs
        SET variants = COALESCE((
          SELECT jsonb_agg(
            CASE
              WHEN variant->>'assetId' = $2 THEN jsonb_set(variant, '{assetId}', 'null'::jsonb)
              ELSE variant
            END
          )
          FROM jsonb_array_elements(variants) AS variant
        ), '[]'::jsonb),
        updated_at = $3
        WHERE project_id = $1
      `,
        [projectId, assetId, now()]
      );
      await this.client.query("DELETE FROM cutpilot_media_artifacts WHERE project_id = $1 AND owner_type = $2 AND owner_id = $3", [
        projectId,
        "imageAsset",
        assetId
      ]);
      await this.client.query("DELETE FROM cutpilot_image_assets WHERE id = $1 AND project_id = $2", [assetId, projectId]);
      const remainingAssets = await this.countProjectImageAssets(projectId);
      await this.client.query("COMMIT");
      return { deleted: true, assetId, blockedByUsage: false, usageCount, remainingAssets };
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  private async workerRetryRecordForSource(sourceJobId: string) {
    const rows = await this.client.query<Row>("SELECT * FROM cutpilot_worker_retry_records WHERE source_job_id = $1 LIMIT 1", [sourceJobId]);
    return rows.rows[0] ? rowWorkerRetryRecord(rows.rows[0]) : null;
  }

  private async replacementForWorkerRetryRecord(record: WorkerRetryRecord) {
    const snapshot = await new PostgresLivePersistenceReadAdapter(this.client).getWorkerRetryExecutionSnapshot();
    return snapshot.items.find((item) => item.record.sourceJobId === record.sourceJobId)?.replacement || null;
  }

  private async alreadyExecutedWorkerRetryResult(record: WorkerRetryRecord): Promise<WorkerRetryExecutionResult> {
    const replacement = await this.replacementForWorkerRetryRecord(record);
    return {
      sourceJobId: record.sourceJobId,
      executed: Boolean(replacement),
      action: record.action,
      replacement,
      retryRecord: record,
      reason: replacement ? "already_executed" : "replacement_missing"
    };
  }

  private async recordWorkerRetry(projectId: string, sourceJobId: string, action: WorkerRetryAction, replacement: QueueJobSnapshot) {
    await this.client.query("BEGIN");
    try {
      const existingRows = await this.client.query<Row>("SELECT * FROM cutpilot_worker_retry_records WHERE source_job_id = $1 LIMIT 1 FOR UPDATE", [
        sourceJobId
      ]);
      if (existingRows.rows[0]) {
        await this.client.query("COMMIT");
        return rowWorkerRetryRecord(existingRows.rows[0]);
      }

      const timestamp = now();
      const record: WorkerRetryRecord = {
        id: uid("wretry"),
        sourceJobId,
        action,
        replacementJobId: replacement.id,
        replacementKind: replacement.kind,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      await this.client.query(
        `
        INSERT INTO cutpilot_worker_retry_records (
          id, project_id, source_job_id, action, replacement_job_id,
          replacement_kind, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
        [record.id, projectId, record.sourceJobId, record.action, record.replacementJobId, record.replacementKind, record.createdAt, record.updatedAt]
      );
      await this.client.query("COMMIT");
      return record;
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  private async workerRetryExecutedResult(
    sourceJobId: string,
    action: WorkerRetryAction,
    projectId: string,
    replacement: QueueJobSnapshot
  ): Promise<WorkerRetryExecutionResult> {
    const retryRecord = await this.recordWorkerRetry(projectId, sourceJobId, action, replacement);
    if (retryRecord.replacementJobId !== replacement.id) {
      const recordedReplacement = await this.replacementForWorkerRetryRecord(retryRecord);
      return {
        sourceJobId,
        executed: Boolean(recordedReplacement),
        action: retryRecord.action,
        replacement: recordedReplacement,
        retryRecord,
        reason: recordedReplacement ? "already_executed" : "replacement_missing"
      };
    }
    return { sourceJobId, executed: true, action, replacement, retryRecord, reason: "executed" };
  }

  async executeWorkerRetry(sourceJobId: string): Promise<WorkerRetryExecutionResult> {
    const existingRecord = await this.workerRetryRecordForSource(sourceJobId);
    if (existingRecord) return this.alreadyExecutedWorkerRetryResult(existingRecord);

    const item = (await new PostgresLivePersistenceReadAdapter(this.client).getWorkerRetryPlan()).items.find(
      (candidate) => candidate.receipt.jobId === sourceJobId
    );
    if (!item) return { sourceJobId, executed: false, action: null, replacement: null, retryRecord: null, reason: "not_found" };
    if (!item.retryable) {
      return { sourceJobId, executed: false, action: item.action, replacement: null, retryRecord: null, reason: "not_retryable" };
    }

    try {
      if (item.action === "retry_image_generation") {
        const sourceRows = await this.client.query<Row>("SELECT * FROM cutpilot_image_jobs WHERE id = $1 LIMIT 1", [sourceJobId]);
        const source = sourceRows.rows[0];
        if (!source) return { sourceJobId, executed: false, action: item.action, replacement: null, retryRecord: null, reason: "not_found" };

        const retry = await this.createImageJob({
          projectId: String(source.project_id),
          prompt: String(source.prompt),
          purpose: source.purpose as ImageMakerPurpose,
          role: source.role as ImageAssetRole,
          aspect: source.aspect as Aspect,
          style: String(source.style),
          count: Number(source.count),
          retryOfJobId: sourceJobId
        });
        return this.workerRetryExecutedResult(sourceJobId, item.action, retry.job.projectId, imageSnapshot(retry.job));
      }

      if (item.action === "retry_provider_generation") {
        const sourceRows = await this.client.query<Row>("SELECT * FROM cutpilot_generation_jobs WHERE id = $1 LIMIT 1", [sourceJobId]);
        const source = sourceRows.rows[0];
        if (!source) return { sourceJobId, executed: false, action: item.action, replacement: null, retryRecord: null, reason: "not_found" };

        const promptPackage = jsonValue<GenerationPromptPackage>(source.prompt_package, {} as GenerationPromptPackage);
        const retry = await this.generateShot(String(source.shot_id), {
          tier: promptPackage.requirements?.tier || "fast",
          takeCount: 1,
          retryOfJobId: sourceJobId
        });
        const replacementJob = retry.jobs[0];
        if (!replacementJob) return { sourceJobId, executed: false, action: item.action, replacement: null, retryRecord: null, reason: "retry_failed" };
        return this.workerRetryExecutedResult(sourceJobId, item.action, replacementJob.projectId, generationSnapshot(replacementJob));
      }

      if (item.action === "retry_render") {
        const sourceRows = await this.client.query<Row>("SELECT * FROM cutpilot_render_jobs WHERE id = $1 LIMIT 1", [sourceJobId]);
        const source = sourceRows.rows[0];
        if (!source) return { sourceJobId, executed: false, action: item.action, replacement: null, retryRecord: null, reason: "not_found" };

        const spec = jsonValue<ExportSpec>(source.spec, { resolution: "1080p", cut: "full", aspect: "9:16", caption: "burn-in" });
        const retry = await this.startRender(String(source.project_id), { specs: [spec], retryOfJobId: sourceJobId });
        const replacementJob = retry.jobs[0];
        if (!replacementJob) return { sourceJobId, executed: false, action: item.action, replacement: null, retryRecord: null, reason: "retry_failed" };
        return this.workerRetryExecutedResult(sourceJobId, item.action, replacementJob.projectId, renderSnapshot(replacementJob));
      }

      return { sourceJobId, executed: false, action: item.action, replacement: null, retryRecord: null, reason: "unsupported_action" };
    } catch {
      return { sourceJobId, executed: false, action: item.action, replacement: null, retryRecord: null, reason: "retry_failed" };
    }
  }

  async cancelJob(jobId: string): Promise<CancelJobResult> {
    await this.client.query("BEGIN");
    try {
      if (jobId.startsWith("gen_")) {
        const jobs = await this.client.query<Row>("SELECT * FROM cutpilot_generation_jobs WHERE id = $1 LIMIT 1 FOR UPDATE", [jobId]);
        const job = jobs.rows[0];
        if (!job) {
          await this.client.query("COMMIT");
          return { jobId, kind: null, projectId: null, cancelled: false, status: null, refundedCredits: 0, reason: "job not found" };
        }
        if (!isActiveJobStatus(job.status)) {
          await this.client.query("COMMIT");
          return { jobId, kind: "generationJob", projectId: String(job.project_id), cancelled: false, status: job.status as JobStatus, refundedCredits: 0, reason: "job is not active" };
        }
        const timestamp = now();
        const takes = await this.client.query<Row>("SELECT * FROM cutpilot_takes WHERE id = $1 LIMIT 1 FOR UPDATE", [job.take_id]);
        const take = takes.rows[0] || null;
        const credits = take?.upgrade_source_take_id ? 22 : 6;
        const action: CreditTransaction["action"] = take?.upgrade_source_take_id ? "upgradeTake" : "generateShot";
        await this.client.query("UPDATE cutpilot_generation_jobs SET status = $2, progress = $3, eta_sec = $4, stage = $5, error = $6, updated_at = $7 WHERE id = $1", [
          jobId,
          "cancelled",
          1,
          0,
          "cancelled",
          json(cancelledError()),
          timestamp
        ]);
        await this.client.query("UPDATE cutpilot_provider_attempts SET status = $2, completed_at = $3 WHERE generation_job_id = $1 AND status IN ('queued', 'submitted', 'polling')", [
          jobId,
          "cancelled",
          timestamp
        ]);
        if (take) {
          await this.client.query("UPDATE cutpilot_takes SET status = $2, video_url = $3, poster_url = $4, metrics = $5 WHERE id = $1", [
            take.id,
            "cancelled",
            null,
            null,
            json({})
          ]);
        }
        await this.refundReservedCredits({ projectId: String(job.project_id), jobId, action, credits, note: "Generation job cancelled and reserved credits refunded" });
        const projectShots = await this.client.query<Row>("SELECT status, selected_take_id FROM cutpilot_shots WHERE project_id = $1", [job.project_id]);
        await this.client.query("UPDATE cutpilot_projects SET progress = $2, status = $3, updated_at = $4 WHERE id = $1", [
          job.project_id,
          json(projectProgressFromShots(projectShots.rows as Array<{ status: string; selected_take_id: unknown }>)),
          projectStatusFromShots(projectShots.rows as Array<{ status: string; selected_take_id: unknown }>),
          timestamp
        ]);
        await this.client.query("COMMIT");
        return { jobId, kind: "generationJob", projectId: String(job.project_id), cancelled: true, status: "cancelled", refundedCredits: credits, reason: "cancelled" };
      }

      if (jobId.startsWith("ijob_")) {
        const jobs = await this.client.query<Row>("SELECT * FROM cutpilot_image_jobs WHERE id = $1 LIMIT 1 FOR UPDATE", [jobId]);
        const job = jobs.rows[0];
        if (!job) {
          await this.client.query("COMMIT");
          return { jobId, kind: null, projectId: null, cancelled: false, status: null, refundedCredits: 0, reason: "job not found" };
        }
        if (!isActiveJobStatus(job.status)) {
          await this.client.query("COMMIT");
          return { jobId, kind: "imageJob", projectId: String(job.project_id), cancelled: false, status: job.status as JobStatus, refundedCredits: 0, reason: "job is not active" };
        }
        const credits = Number(job.count) * 4;
        const variants = jsonValue<Array<Record<string, unknown>>>(job.variants, []).map((variant) => ({ ...variant, status: "cancelled" }));
        await this.client.query("UPDATE cutpilot_image_jobs SET status = $2, progress = $3, eta_sec = $4, error = $5, variants = $6, updated_at = $7 WHERE id = $1", [
          jobId,
          "cancelled",
          1,
          0,
          json(cancelledError()),
          json(variants),
          now()
        ]);
        await this.refundReservedCredits({ projectId: String(job.project_id), jobId, action: "generateImages", credits, note: "Image job cancelled and reserved credits refunded" });
        await this.client.query("COMMIT");
        return { jobId, kind: "imageJob", projectId: String(job.project_id), cancelled: true, status: "cancelled", refundedCredits: credits, reason: "cancelled" };
      }

      if (jobId.startsWith("rnd_")) {
        const jobs = await this.client.query<Row>("SELECT * FROM cutpilot_render_jobs WHERE id = $1 LIMIT 1 FOR UPDATE", [jobId]);
        const job = jobs.rows[0];
        if (!job) {
          await this.client.query("COMMIT");
          return { jobId, kind: null, projectId: null, cancelled: false, status: null, refundedCredits: 0, reason: "job not found" };
        }
        if (!isActiveJobStatus(job.status)) {
          await this.client.query("COMMIT");
          return { jobId, kind: "renderJob", projectId: String(job.project_id), cancelled: false, status: job.status as JobStatus, refundedCredits: 0, reason: "job is not active" };
        }
        const timestamp = now();
        await this.client.query("UPDATE cutpilot_render_jobs SET status = $2, progress = $3, eta_sec = $4, error = $5, updated_at = $6 WHERE id = $1", [
          jobId,
          "cancelled",
          1,
          0,
          json(cancelledError()),
          timestamp
        ]);
        await this.refundReservedCredits({ projectId: String(job.project_id), jobId, action: "startRender", credits: 16, note: "Render job cancelled and reserved credits refunded" });
        const activeRenderRows = await this.client.query<Row>("SELECT id FROM cutpilot_render_jobs WHERE project_id = $1 AND status IN ('queued', 'running') LIMIT 1", [job.project_id]);
        if (!activeRenderRows.rows[0]) {
          await this.client.query("UPDATE cutpilot_projects SET status = $2, updated_at = $3 WHERE id = $1 AND status = $4", [job.project_id, "edited", timestamp, "rendering"]);
        }
        await this.client.query("COMMIT");
        return { jobId, kind: "renderJob", projectId: String(job.project_id), cancelled: true, status: "cancelled", refundedCredits: 16, reason: "cancelled" };
      }

      await this.client.query("COMMIT");
      return { jobId, kind: null, projectId: null, cancelled: false, status: null, refundedCredits: 0, reason: "job not found" };
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }
}
