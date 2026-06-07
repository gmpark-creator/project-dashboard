import { createHash } from "node:crypto";
import type {
  AssetUsage,
  CreditTransaction,
  EditState,
  GenerationJob,
  ImageAsset,
  ImageJob,
  MediaArtifact,
  Project,
  ProjectBundle,
  ProviderAttempt,
  ReferenceBoard,
  RenderJob,
  Scene,
  Shot,
  StudioState,
  Take,
  WorkerLease,
  WorkerLeaseSnapshot
} from "../domain/types";
import type { PgQueryable } from "./live-persistence-migrations";
import { buildQueueSnapshotFromJobs } from "./queue-snapshot";
import { buildWorkerCompletionSnapshotFromJobs } from "./worker-completions";
import { buildWorkerDispatchSnapshotFromJobs } from "./worker-dispatch";

type Row = Record<string, unknown>;

function jsonValue<T>(value: unknown, fallback: T): T {
  if (value === null || typeof value === "undefined") return fallback;
  if (typeof value === "string") return JSON.parse(value) as T;
  return value as T;
}

function iso(value: unknown) {
  return value instanceof Date ? value.toISOString() : String(value);
}

function nullableString(value: unknown) {
  return value === null || typeof value === "undefined" ? null : String(value);
}

function nullableNumber(value: unknown) {
  if (value === null || typeof value === "undefined") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function rowProject(row: Row): Project {
  return {
    id: String(row.id),
    title: String(row.title),
    idea: String(row.idea),
    intent: row.intent as Project["intent"],
    status: row.status as Project["status"],
    aspect: row.aspect as Project["aspect"],
    targetDurationSec: Number(row.target_duration_sec),
    progress: jsonValue<Project["progress"]>(row.progress, { shotsDone: 0, shotsTotal: 0 }),
    characters: jsonValue<Project["characters"]>(row.characters, []),
    thumbUrl: nullableString(row.thumb_url),
    defaultRenderJobId: nullableString(row.default_render_job_id),
    credits: jsonValue<Project["credits"]>(row.credits, { spent: 0, estimateRemaining: 0 }),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at)
  };
}

function rowScene(row: Row): Scene {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    order: Number(row.order_index),
    title: String(row.title),
    setting: String(row.setting),
    timeOfDay: String(row.time_of_day)
  };
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
    createdAt: iso(row.created_at)
  };
  const upgradeSourceTakeId = nullableString(row.upgrade_source_take_id);
  const upgradeMode = nullableString(row.upgrade_mode);
  if (upgradeSourceTakeId) take.upgradeSourceTakeId = upgradeSourceTakeId;
  if (upgradeMode) take.upgradeMode = upgradeMode as Take["upgradeMode"];
  return take;
}

function rowProviderAttempt(row: Row): ProviderAttempt {
  return {
    id: String(row.id),
    provider: String(row.provider),
    model: String(row.model),
    requestId: nullableString(row.request_id),
    status: row.status as ProviderAttempt["status"],
    startedAt: iso(row.started_at),
    completedAt: row.completed_at ? iso(row.completed_at) : null,
    latencyMs: nullableNumber(row.latency_ms),
    errorCode: nullableString(row.error_code),
    retryable: Boolean(row.retryable),
    fallbackSuggested: Boolean(row.fallback_suggested)
  };
}

function rowGenerationJob(row: Row, attempts: ProviderAttempt[]): GenerationJob {
  return {
    id: String(row.id),
    shotId: String(row.shot_id),
    takeId: String(row.take_id),
    projectId: String(row.project_id),
    retryOfJobId: nullableString(row.retry_of_job_id),
    status: row.status as GenerationJob["status"],
    progress: Number(row.progress),
    etaSec: nullableNumber(row.eta_sec),
    stage: String(row.stage),
    shouldFail: Boolean(row.should_fail),
    dueAt: Number(row.due_at),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
    error: jsonValue<GenerationJob["error"]>(row.error, null),
    promptPackage: jsonValue<GenerationJob["promptPackage"]>(row.prompt_package, {} as GenerationJob["promptPackage"]),
    routing: jsonValue<GenerationJob["routing"]>(row.routing, {} as GenerationJob["routing"]),
    providerAttempts: attempts
  };
}

function rowImageAsset(row: Row): ImageAsset {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    kind: "image",
    role: row.role as ImageAsset["role"],
    source: row.source as ImageAsset["source"],
    label: String(row.label),
    prompt: String(row.prompt),
    url: String(row.url),
    thumbUrl: String(row.thumb_url),
    aspect: row.aspect as ImageAsset["aspect"],
    width: Number(row.width),
    height: Number(row.height),
    rights: jsonValue<ImageAsset["rights"]>(row.rights, { status: "needs_review", note: "" }),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at)
  };
}

function rowImageJob(row: Row): ImageJob {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    retryOfJobId: nullableString(row.retry_of_job_id),
    status: row.status as ImageJob["status"],
    progress: Number(row.progress),
    etaSec: nullableNumber(row.eta_sec),
    stage: row.stage as ImageJob["stage"],
    prompt: String(row.prompt),
    purpose: row.purpose as ImageJob["purpose"],
    role: row.role as ImageJob["role"],
    aspect: row.aspect as ImageJob["aspect"],
    style: String(row.style),
    count: Number(row.count),
    variants: jsonValue<ImageJob["variants"]>(row.variants, []),
    dueAt: Number(row.due_at),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
    error: jsonValue<ImageJob["error"]>(row.error, null)
  };
}

function rowRenderJob(row: Row): RenderJob {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    retryOfJobId: nullableString(row.retry_of_job_id),
    spec: jsonValue<RenderJob["spec"]>(row.spec, { resolution: "1080p", cut: "full", aspect: "9:16", caption: "burn-in" }),
    stage: row.stage as RenderJob["stage"],
    progress: Number(row.progress),
    status: row.status as RenderJob["status"],
    outputUrl: nullableString(row.output_url),
    shareUrl: nullableString(row.share_url),
    etaSec: nullableNumber(row.eta_sec),
    dueAt: Number(row.due_at),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
    error: jsonValue<RenderJob["error"]>(row.error, null),
    rightsReview: jsonValue<RenderJob["rightsReview"]>(row.rights_review, { required: false, assetIds: [], items: [] }),
    renderPlan: jsonValue<RenderJob["renderPlan"]>(row.render_plan, {} as RenderJob["renderPlan"])
  };
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

function rowAssetUsage(row: Row): AssetUsage {
  return {
    assetId: String(row.asset_id),
    role: row.role as AssetUsage["role"],
    target: row.target as AssetUsage["target"],
    targetId: String(row.target_id),
    mode: row.mode as AssetUsage["mode"],
    createdAt: iso(row.created_at)
  };
}

function defaultReferenceBoard(projectId: string, usages: AssetUsage[]): ReferenceBoard {
  return {
    projectId,
    productImages: [],
    characterImages: [],
    locationImages: [],
    styleImages: [],
    keyframes: [],
    thumbnails: [],
    logos: [],
    backgrounds: [],
    usages
  };
}

function rowReferenceBoard(row: Row | null, projectId: string, usages: AssetUsage[]): ReferenceBoard {
  if (!row) return defaultReferenceBoard(projectId, usages);
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
    usages
  };
}

function defaultEditState(projectId: string): EditState {
  return {
    projectId,
    captions: { enabled: true, mode: "burn-in", source: "script-first" },
    bgm: { enabled: true, track: "licensed track", ducking: true },
    voiceover: { enabled: false, voice: "Voice A", source: "licensed_tts" },
    transitions: "soft",
    commands: []
  };
}

function rowEditState(row: Row | null, projectId: string): EditState {
  if (!row) return defaultEditState(projectId);
  return {
    projectId,
    captions: jsonValue<EditState["captions"]>(row.captions, defaultEditState(projectId).captions),
    bgm: jsonValue<EditState["bgm"]>(row.bgm, defaultEditState(projectId).bgm),
    voiceover: jsonValue<EditState["voiceover"]>(row.voiceover, defaultEditState(projectId).voiceover),
    transitions: row.transitions as EditState["transitions"],
    commands: jsonValue<EditState["commands"]>(row.commands, [])
  };
}

function bestDoneTake(takes: Take[], shot: Shot) {
  return takes
    .filter((take) => take.shotId === shot.id && take.status === "done")
    .sort((a, b) => (b.metrics.overall || 0) - (a.metrics.overall || 0))[0] || null;
}

function selectedOrBestTake(takes: Take[], shot: Shot) {
  return takes.find((take) => take.id === shot.selectedTakeId && take.shotId === shot.id) || bestDoneTake(takes, shot);
}

export function buildLiveRenderSourceHash(input: { projectId: string; shots: Shot[]; takes: Take[]; imageAssets: ImageAsset[]; editState: EditState }) {
  const payload = {
    projectId: input.projectId,
    shots: [...input.shots].sort((a, b) => a.order - b.order).map((shot) => {
      const take = selectedOrBestTake(input.takes, shot);
      const referenceImageIds = [...shot.referenceImageIds].sort();
      return {
        id: shot.id,
        sceneId: shot.sceneId,
        order: shot.order,
        title: shot.title,
        durationSec: shot.durationSec,
        status: shot.status,
        effectiveTake: take
          ? {
              id: take.id,
              status: take.status,
              videoUrl: take.videoUrl,
              posterUrl: take.posterUrl,
              durationSec: take.durationSec,
              tier: take.tier,
              metrics: take.metrics,
              upgradeSourceTakeId: take.upgradeSourceTakeId || null,
              upgradeMode: take.upgradeMode || null
            }
          : null,
        references: referenceImageIds.map((assetId) => {
          const asset = input.imageAssets.find((item) => item.id === assetId && item.projectId === input.projectId);
          return asset
            ? {
                assetId: asset.id,
                label: asset.label,
                role: asset.role,
                rightsStatus: asset.rights.status,
                rightsNote: asset.rights.note
              }
            : { assetId, missing: true };
        })
      };
    }),
    edit: input.editState
  };
  return `sha256:${createHash("sha256").update(JSON.stringify(payload)).digest("hex")}`;
}

function attemptsByJob(rows: Row[]) {
  const grouped = new Map<string, ProviderAttempt[]>();
  for (const row of rows) {
    const jobId = String(row.generation_job_id);
    grouped.set(jobId, [...(grouped.get(jobId) || []), rowProviderAttempt(row)]);
  }
  return grouped;
}

export class PostgresLivePersistenceReadAdapter {
  constructor(private readonly client: PgQueryable) {}

  async listProjects(): Promise<Project[]> {
    const projects = await this.client.query<Row>(`
      SELECT p.*
      FROM cutpilot_projects p
      ORDER BY p.updated_at DESC
    `);
    return projects.rows.map(rowProject);
  }

  async listImageAssets(projectId: string): Promise<ImageAsset[]> {
    const imageAssets = await this.client.query<Row>("SELECT * FROM cutpilot_image_assets WHERE project_id = $1 ORDER BY created_at ASC", [projectId]);
    return imageAssets.rows.map(rowImageAsset);
  }

  async getJob(jobId: string): Promise<GenerationJob | ImageJob | RenderJob | null> {
    if (jobId.startsWith("gen_")) {
      const jobs = await this.client.query<Row>("SELECT * FROM cutpilot_generation_jobs WHERE id = $1 LIMIT 1", [jobId]);
      const row = jobs.rows[0];
      if (!row) return null;
      const attemptRows = await this.client.query<Row>("SELECT * FROM cutpilot_provider_attempts WHERE generation_job_id = $1 ORDER BY started_at ASC", [jobId]);
      return rowGenerationJob(row, attemptRows.rows.map(rowProviderAttempt));
    }
    if (jobId.startsWith("ijob_")) {
      const jobs = await this.client.query<Row>("SELECT * FROM cutpilot_image_jobs WHERE id = $1 LIMIT 1", [jobId]);
      return jobs.rows[0] ? rowImageJob(jobs.rows[0]) : null;
    }
    if (jobId.startsWith("rnd_")) {
      const jobs = await this.client.query<Row>("SELECT * FROM cutpilot_render_jobs WHERE id = $1 LIMIT 1", [jobId]);
      return jobs.rows[0] ? rowRenderJob(jobs.rows[0]) : null;
    }
    return null;
  }

  async getQueueSnapshot() {
    const generationJobs = (await this.client.query<Row>("SELECT * FROM cutpilot_generation_jobs ORDER BY created_at ASC")).rows.map((row) =>
      rowGenerationJob(row, [])
    );
    const imageJobs = (await this.client.query<Row>("SELECT * FROM cutpilot_image_jobs ORDER BY created_at ASC")).rows.map(rowImageJob);
    const renderJobs = (await this.client.query<Row>("SELECT * FROM cutpilot_render_jobs ORDER BY created_at ASC")).rows.map(rowRenderJob);
    return buildQueueSnapshotFromJobs({ generationJobs, imageJobs, renderJobs });
  }

  async getWorkerDispatchSnapshot() {
    const generationJobs = (await this.client.query<Row>("SELECT * FROM cutpilot_generation_jobs ORDER BY due_at ASC")).rows.map((row) =>
      rowGenerationJob(row, [])
    );
    const imageJobs = (await this.client.query<Row>("SELECT * FROM cutpilot_image_jobs ORDER BY due_at ASC")).rows.map(rowImageJob);
    const renderJobs = (await this.client.query<Row>("SELECT * FROM cutpilot_render_jobs ORDER BY due_at ASC")).rows.map(rowRenderJob);
    return buildWorkerDispatchSnapshotFromJobs({ generationJobs, imageJobs, renderJobs });
  }

  async getWorkerLeaseSnapshot(): Promise<WorkerLeaseSnapshot> {
    const leases = (await this.client.query<Row>("SELECT * FROM cutpilot_worker_leases ORDER BY leased_at DESC")).rows.map(rowWorkerLease);
    return {
      generatedAt: new Date().toISOString(),
      summary: {
        total: leases.length,
        active: leases.filter((lease) => lease.status === "active").length,
        released: leases.filter((lease) => lease.status === "released").length,
        expired: leases.filter((lease) => lease.status === "expired").length
      },
      leases
    };
  }

  async getWorkerCompletionSnapshot() {
    const generationJobs = (await this.client.query<Row>("SELECT * FROM cutpilot_generation_jobs ORDER BY updated_at DESC")).rows.map((row) =>
      rowGenerationJob(row, [])
    );
    const imageJobs = (await this.client.query<Row>("SELECT * FROM cutpilot_image_jobs ORDER BY updated_at DESC")).rows.map(rowImageJob);
    const renderJobs = (await this.client.query<Row>("SELECT * FROM cutpilot_render_jobs ORDER BY updated_at DESC")).rows.map(rowRenderJob);
    const mediaArtifacts = (await this.client.query<Row>("SELECT * FROM cutpilot_media_artifacts ORDER BY created_at ASC")).rows.map(rowMediaArtifact);
    const creditTransactions = (await this.client.query<Row>("SELECT * FROM cutpilot_credit_transactions ORDER BY created_at ASC")).rows.map(rowCreditTransaction);
    return buildWorkerCompletionSnapshotFromJobs({ generationJobs, imageJobs, renderJobs, mediaArtifacts, creditTransactions });
  }

  async getProjectBundle(projectId: string): Promise<ProjectBundle | null> {
    const projects = await this.client.query<Row>(
      `
      SELECT p.*, a.balance_credits, a.spent_credits, a.reserved_credits
      FROM cutpilot_projects p
      JOIN cutpilot_credit_accounts a ON a.id = p.credit_account_id
      WHERE p.id = $1
      LIMIT 1
    `,
      [projectId]
    );
    const projectRow = projects.rows[0];
    if (!projectRow) return null;

    const project = rowProject(projectRow);
    const credits: StudioState["credits"] = {
      balance: Number(projectRow.balance_credits),
      spent: Number(projectRow.spent_credits),
      reserved: Number(projectRow.reserved_credits)
    };
    const scenes = (await this.client.query<Row>("SELECT * FROM cutpilot_scenes WHERE project_id = $1 ORDER BY order_index ASC", [projectId])).rows.map(rowScene);
    const shots = (await this.client.query<Row>("SELECT * FROM cutpilot_shots WHERE project_id = $1 ORDER BY order_index ASC", [projectId])).rows.map(rowShot);
    const takes = (await this.client.query<Row>("SELECT * FROM cutpilot_takes WHERE project_id = $1 ORDER BY created_at ASC", [projectId])).rows.map(rowTake);
    const attemptRows = (
      await this.client.query<Row>(
        `
        SELECT pa.*
        FROM cutpilot_provider_attempts pa
        JOIN cutpilot_generation_jobs gj ON gj.id = pa.generation_job_id
        WHERE gj.project_id = $1
        ORDER BY pa.started_at ASC
      `,
        [projectId]
      )
    ).rows;
    const attempts = attemptsByJob(attemptRows);
    const generationJobs = (
      await this.client.query<Row>("SELECT * FROM cutpilot_generation_jobs WHERE project_id = $1 ORDER BY created_at ASC", [projectId])
    ).rows.map((row) => rowGenerationJob(row, attempts.get(String(row.id)) || []));
    const renderJobs = (await this.client.query<Row>("SELECT * FROM cutpilot_render_jobs WHERE project_id = $1 ORDER BY created_at ASC", [projectId])).rows.map(rowRenderJob);
    const imageAssets = (await this.client.query<Row>("SELECT * FROM cutpilot_image_assets WHERE project_id = $1 ORDER BY created_at ASC", [projectId])).rows.map(rowImageAsset);
    const imageJobs = (await this.client.query<Row>("SELECT * FROM cutpilot_image_jobs WHERE project_id = $1 ORDER BY created_at ASC", [projectId])).rows.map(rowImageJob);
    const usages = (await this.client.query<Row>("SELECT * FROM cutpilot_asset_usages WHERE project_id = $1 ORDER BY created_at ASC", [projectId])).rows.map(rowAssetUsage);
    const referenceBoardRow = (await this.client.query<Row>("SELECT * FROM cutpilot_reference_boards WHERE project_id = $1 LIMIT 1", [projectId])).rows[0] || null;
    const editStateRow = (await this.client.query<Row>("SELECT * FROM cutpilot_project_edit_states WHERE project_id = $1 LIMIT 1", [projectId])).rows[0] || null;
    const creditTransactions = (
      await this.client.query<Row>("SELECT * FROM cutpilot_credit_transactions WHERE project_id = $1 ORDER BY created_at ASC", [projectId])
    ).rows.map(rowCreditTransaction);
    const mediaArtifacts = (await this.client.query<Row>("SELECT * FROM cutpilot_media_artifacts WHERE project_id = $1 ORDER BY created_at ASC", [projectId])).rows.map(rowMediaArtifact);
    const editState = rowEditState(editStateRow, projectId);

    return {
      project,
      scenes,
      shots,
      takes,
      generationJobs,
      renderJobs,
      imageAssets,
      imageJobs,
      referenceBoard: rowReferenceBoard(referenceBoardRow, projectId, usages),
      editState,
      credits,
      creditTransactions,
      mediaArtifacts,
      renderSourceHash: buildLiveRenderSourceHash({ projectId, shots, takes, imageAssets, editState })
    };
  }
}
