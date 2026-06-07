import assert from "node:assert/strict";
import { buildLiveProjectCreateRecords } from "../src/server/live-project-builder";
import { PostgresLivePersistenceWriteAdapter } from "../src/server/live-persistence-write-adapter";
import type { PgQueryable } from "../src/server/live-persistence-migrations";
import { CreditReservationError } from "../src/server/mock-service";

class FakeClient implements PgQueryable {
  queries: Array<{ sql: string; params?: unknown[] }> = [];
  failOnShotInsert = false;
  projectExists = true;
  projectAspect = "9:16";
  defaultRenderJobId: string | null = null;
  projectThumbUrl: string | null = null;
  editRows: Record<string, unknown>[] = [];
  generationJobRow: Record<string, unknown> | null = null;
  imageJobRow: Record<string, unknown> | null = null;
  renderJobRow: Record<string, unknown> | null = null;
  sceneRows: Record<string, unknown>[] = [];
  shotRows: Record<string, unknown>[] = [];
  takeRow: Record<string, unknown> | null = null;
  imageAssetRow: Record<string, unknown> | null = null;
  imageAssetRows: Record<string, unknown>[] = [];
  mediaArtifactRows: Record<string, unknown>[] = [];
  creditTransactionRows: Record<string, unknown>[] = [];
  imageAssetDeleted = false;
  assetUsageRows: Record<string, unknown>[] = [];
  projectIntent = "product_ad";
  creditBalance = 1240;
  creditSpent = 0;
  creditReserved = 0;
  creditTransactionCount = 0;
  activeRenderExists = false;
  workerLeaseRows: Record<string, unknown>[] = [];

  async query<T extends Record<string, unknown> = Record<string, unknown>>(sql: string, params?: unknown[]) {
    this.queries.push({ sql, params });
    if (this.failOnShotInsert && sql.includes("INSERT INTO cutpilot_shots")) throw new Error("shot insert failed");
    if (sql.includes("SELECT id, aspect FROM cutpilot_projects")) {
      const projectRow = { id: params?.[0], aspect: this.projectAspect } as unknown as T;
      return { rows: this.projectExists ? [projectRow] : [] };
    }
    if (sql.includes("SELECT p.*, a.balance_credits")) {
      const projectRow = this.bundleProjectRow() as unknown as T;
      return { rows: this.projectExists ? [projectRow] : [] };
    }
    if (sql.includes("SELECT id FROM cutpilot_projects")) {
      const projectRow = { id: params?.[0] } as unknown as T;
      return { rows: this.projectExists ? [projectRow] : [] };
    }
    if (sql.includes("SELECT intent FROM cutpilot_projects")) {
      const projectRow = { intent: this.projectIntent } as unknown as T;
      return { rows: this.projectExists ? [projectRow] : [] };
    }
    if (sql.includes("SELECT * FROM cutpilot_render_jobs WHERE id")) {
      const renderJobRow = this.renderJobRow as unknown as T;
      return { rows: this.renderJobRow ? [renderJobRow] : [] };
    }
    if (sql.includes("SELECT spec FROM cutpilot_render_jobs")) {
      const active = this.renderJobRow && (this.renderJobRow.status === "queued" || this.renderJobRow.status === "running");
      return { rows: active ? ([{ spec: this.renderJobRow?.spec } as unknown as T]) : [] };
    }
    if (sql.includes("SELECT * FROM cutpilot_generation_jobs WHERE id")) return { rows: this.generationJobRow ? ([this.generationJobRow as unknown as T]) : [] };
    if (sql.includes("SELECT * FROM cutpilot_image_jobs WHERE id")) return { rows: this.imageJobRow ? ([this.imageJobRow as unknown as T]) : [] };
    if (sql.includes("SELECT id FROM cutpilot_render_jobs WHERE project_id")) return { rows: this.activeRenderExists ? ([{ id: "rnd_active" } as unknown as T]) : [] };
    if (sql.includes("SELECT * FROM cutpilot_render_jobs WHERE project_id")) {
      const renderJobRow = this.renderJobRow as unknown as T;
      return { rows: this.renderJobRow ? [renderJobRow] : [] };
    }
    if (sql.includes("SELECT id FROM cutpilot_scenes")) {
      const scene = this.sceneRows.find((row) => row.id === params?.[0] && row.project_id === params?.[1]);
      return { rows: scene ? ([{ id: scene.id } as unknown as T]) : [] };
    }
    if (sql.includes("UPDATE cutpilot_scenes SET")) {
      const scene = this.sceneRows.find((row) => row.id === params?.[0] && row.project_id === params?.[1]);
      if (scene) {
        if (typeof params?.[2] === "number") scene.order_index = params[2];
        if (typeof params?.[3] === "string") scene.title = params[3];
        if (typeof params?.[4] === "string") scene.setting = params[4];
        if (typeof params?.[5] === "string") scene.time_of_day = params[5];
      }
      return { rows: [] as T[] };
    }
    if (sql.includes("SELECT * FROM cutpilot_project_edit_states")) return { rows: this.editRows as T[] };
    if (sql.includes("SELECT COUNT(*) AS count FROM cutpilot_image_assets")) {
      const countRow = { count: this.imageAssetRow && !this.imageAssetDeleted ? 1 : 0 } as unknown as T;
      return { rows: [countRow] };
    }
    if (sql.includes("INSERT INTO cutpilot_project_edit_states") && sql.includes("ON CONFLICT")) {
      const updated = {
        project_id: params?.[0],
        captions: params?.[1],
        bgm: params?.[2],
        voiceover: params?.[3],
        transitions: params?.[4],
        commands: params?.[5]
      } as unknown as T;
      return { rows: [updated] };
    }
    if (sql.includes("INSERT INTO cutpilot_image_assets")) {
      this.imageAssetRows.push({
        id: params?.[0],
        project_id: params?.[1],
        kind: params?.[2],
        role: params?.[3],
        source: params?.[4],
        label: params?.[5],
        prompt: params?.[6],
        url: params?.[7],
        thumb_url: params?.[8],
        aspect: params?.[9],
        width: params?.[10],
        height: params?.[11],
        rights: params?.[12],
        created_at: params?.[13],
        updated_at: params?.[14]
      });
      return { rows: [] as T[] };
    }
    if (sql.includes("INSERT INTO cutpilot_reference_boards")) return { rows: [] as T[] };
    if (sql.includes("INSERT INTO cutpilot_asset_usages")) {
      const usage = { asset_id: params?.[0], project_id: params?.[1], target: params?.[2], target_id: params?.[3], role: params?.[4], mode: params?.[5] };
      if (!this.assetUsageRows.some((row) => row.asset_id === usage.asset_id && row.target_id === usage.target_id && row.mode === usage.mode)) {
        this.assetUsageRows.push(usage);
      }
      return { rows: [] as T[] };
    }
    if (sql.includes("DELETE FROM cutpilot_asset_usages WHERE asset_id = $1")) {
      this.assetUsageRows = this.assetUsageRows.filter((row) => !(row.asset_id === params?.[0] && row.project_id === params?.[1] && row.target === params?.[2] && row.target_id === params?.[3]));
      return { rows: [] as T[] };
    }
    if (sql.includes("DELETE FROM cutpilot_asset_usages WHERE project_id = $1")) {
      this.assetUsageRows = this.assetUsageRows.filter((row) => !(row.project_id === params?.[0] && row.asset_id === params?.[1]));
      return { rows: [] as T[] };
    }
    if (sql.includes("UPDATE cutpilot_image_jobs SET status = $2")) {
      if (this.imageJobRow && this.imageJobRow.id === params?.[0]) {
        this.imageJobRow.status = params?.[1];
        this.imageJobRow.progress = params?.[2];
        this.imageJobRow.eta_sec = params?.[3];
        if (sql.includes("stage = $5")) {
          this.imageJobRow.stage = params?.[4];
          this.imageJobRow.error = params?.[5];
          this.imageJobRow.variants = typeof params?.[6] === "string" ? JSON.parse(params[6]) : params?.[6];
          this.imageJobRow.updated_at = params?.[7];
        } else {
          this.imageJobRow.error = params?.[4];
          this.imageJobRow.variants = typeof params?.[5] === "string" ? JSON.parse(params[5]) : params?.[5];
          this.imageJobRow.updated_at = params?.[6];
        }
      }
      return { rows: [] as T[] };
    }
    if (sql.includes("UPDATE cutpilot_image_jobs")) return { rows: [] as T[] };
    if (sql.includes("DELETE FROM cutpilot_media_artifacts")) return { rows: [] as T[] };
    if (sql.includes("DELETE FROM cutpilot_image_assets")) {
      this.imageAssetDeleted = true;
      return { rows: [] as T[] };
    }
    if (sql.includes("UPDATE cutpilot_projects SET default_render_job_id")) {
      this.defaultRenderJobId = String(params?.[1]);
      this.projectThumbUrl = typeof params?.[2] === "string" ? params[2] : null;
      return { rows: [] as T[] };
    }
    if (sql.includes("UPDATE cutpilot_projects")) return { rows: [] as T[] };
    if (sql.includes("SELECT p.credit_account_id")) {
      const account = { credit_account_id: "acct_live", balance_credits: this.creditBalance, spent_credits: this.creditSpent, reserved_credits: this.creditReserved } as unknown as T;
      return { rows: this.projectExists ? [account] : [] };
    }
    if (sql.includes("UPDATE cutpilot_credit_accounts SET spent_credits")) {
      this.creditSpent = Number(params?.[1] || 0);
      this.creditReserved = Number(params?.[2] || 0);
      return { rows: [] as T[] };
    }
    if (sql.includes("UPDATE cutpilot_credit_accounts")) {
      this.creditReserved = Number(params?.[1] || 0);
      return { rows: [] as T[] };
    }
    if (sql.includes("INSERT INTO cutpilot_credit_transactions")) {
      this.creditTransactionCount += 1;
      this.creditTransactionRows.push({
        id: params?.[0],
        project_id: params?.[1],
        job_id: params?.[2],
        kind: params?.[3],
        action: params?.[4],
        credits: params?.[5],
        provider_cost_usd: params?.[6],
        margin_policy_version: params?.[7],
        balance_after: params?.[8],
        note: params?.[9],
        created_at: params?.[10]
      });
      return { rows: [] as T[] };
    }
    if (sql.includes("INSERT INTO cutpilot_image_jobs")) return { rows: [] as T[] };
    if (sql.includes("INSERT INTO cutpilot_takes")) return { rows: [] as T[] };
    if (sql.includes("INSERT INTO cutpilot_generation_jobs")) return { rows: [] as T[] };
    if (sql.includes("INSERT INTO cutpilot_provider_attempts")) return { rows: [] as T[] };
    if (sql.includes("INSERT INTO cutpilot_render_jobs")) return { rows: [] as T[] };
    if (sql.includes("UPDATE cutpilot_generation_jobs")) return { rows: [] as T[] };
    if (sql.includes("UPDATE cutpilot_provider_attempts")) return { rows: [] as T[] };
    if (sql.includes("UPDATE cutpilot_takes")) return { rows: [] as T[] };
    if (sql.includes("UPDATE cutpilot_render_jobs")) return { rows: [] as T[] };
    if (sql.includes("INSERT INTO cutpilot_media_artifacts")) {
      this.mediaArtifactRows.push({
        id: params?.[0],
        project_id: params?.[1],
        owner_type: params?.[2],
        owner_id: params?.[3],
        source_job_id: params?.[4],
        kind: params?.[5],
        role: params?.[6],
        url: params?.[7],
        storage_key: params?.[8],
        content_type: params?.[9],
        bytes: params?.[10],
        status: params?.[11],
        created_at: params?.[12]
      });
      return { rows: [] as T[] };
    }
    if (sql.includes("SELECT * FROM cutpilot_media_artifacts WHERE source_job_id")) {
      return { rows: this.mediaArtifactRows.filter((row) => row.source_job_id === params?.[0]) as T[] };
    }
    if (sql.includes("SELECT * FROM cutpilot_credit_transactions WHERE job_id")) {
      return { rows: this.creditTransactionRows.filter((row) => row.job_id === params?.[0]) as T[] };
    }
    if (sql.includes("UPDATE cutpilot_worker_leases SET status = $2 WHERE status = $1")) {
      this.workerLeaseRows = this.workerLeaseRows.map((lease) =>
        lease.status === params?.[0] && new Date(String(lease.expires_at)).getTime() <= new Date(String(params?.[2])).getTime()
          ? { ...lease, status: params?.[1] }
          : lease
      );
      return { rows: [] as T[] };
    }
    if (sql.includes("SELECT * FROM cutpilot_worker_leases WHERE id")) {
      const lease = this.workerLeaseRows.find((row) => row.id === params?.[0]);
      return { rows: lease ? ([lease as unknown as T]) : [] };
    }
    if (sql.includes("UPDATE cutpilot_worker_leases SET status = $2, released_at = $3 WHERE id = $1")) {
      this.workerLeaseRows = this.workerLeaseRows.map((lease) =>
        lease.id === params?.[0] ? { ...lease, status: params?.[1], released_at: params?.[2] } : lease
      );
      return { rows: [] as T[] };
    }
    if (sql.includes("UPDATE cutpilot_worker_leases SET expires_at = $2 WHERE id = $1")) {
      this.workerLeaseRows = this.workerLeaseRows.map((lease) => (lease.id === params?.[0] ? { ...lease, expires_at: params?.[1] } : lease));
      return { rows: [] as T[] };
    }
    if (sql.includes("SELECT dispatch_key FROM cutpilot_worker_leases")) {
      return { rows: this.workerLeaseRows.filter((lease) => lease.status === params?.[0]).map((lease) => ({ dispatch_key: lease.dispatch_key })) as unknown as T[] };
    }
    if (sql.includes("INSERT INTO cutpilot_worker_leases")) {
      this.workerLeaseRows.push({
        id: params?.[0],
        token: params?.[1],
        dispatch_key: params?.[2],
        kind: params?.[3],
        job_id: params?.[4],
        project_id: params?.[5],
        worker_id: params?.[6],
        status: params?.[7],
        leased_at: params?.[8],
        expires_at: params?.[9],
        released_at: params?.[10]
      });
      return { rows: [] as T[] };
    }
    if (sql.includes("SELECT status, selected_take_id FROM cutpilot_shots WHERE project_id")) {
      const rows = this.shotRows.map((shot) => ({ status: shot.status, selected_take_id: shot.selected_take_id })) as unknown as T[];
      return { rows };
    }
    if (sql.includes("SELECT * FROM cutpilot_shots WHERE project_id") && sql.includes("reference_image_ids")) {
      const rows = this.shotRows.filter((shot) => Array.isArray(shot.reference_image_ids) && shot.reference_image_ids.includes(params?.[1] as string)) as T[];
      return { rows };
    }
    if (sql.includes("SELECT * FROM cutpilot_shots WHERE id = $1")) {
      const shot = this.shotRows.find((row) => row.id === params?.[0]);
      return { rows: shot ? ([shot as unknown as T]) : [] };
    }
    if (sql.includes("SELECT * FROM cutpilot_shots")) return { rows: this.shotRows as T[] };
    if (sql.includes("SELECT * FROM cutpilot_takes WHERE id")) return { rows: this.takeRow ? ([this.takeRow as unknown as T]) : [] };
    if (sql.includes("SELECT * FROM cutpilot_takes WHERE project_id")) return { rows: this.takeRow ? ([this.takeRow as unknown as T]) : [] };
    if (sql.includes("SELECT * FROM cutpilot_image_assets WHERE id")) return { rows: this.imageAssetRow ? ([this.imageAssetRow as unknown as T]) : [] };
    if (sql.includes("SELECT * FROM cutpilot_generation_jobs ORDER BY due_at")) return { rows: this.generationJobRow ? ([this.generationJobRow as unknown as T]) : [] };
    if (sql.includes("SELECT * FROM cutpilot_image_jobs ORDER BY due_at")) return { rows: this.imageJobRow ? ([this.imageJobRow as unknown as T]) : [] };
    if (sql.includes("SELECT * FROM cutpilot_render_jobs ORDER BY due_at")) return { rows: this.renderJobRow ? ([this.renderJobRow as unknown as T]) : [] };
    if (sql.includes("FROM cutpilot_asset_usages u")) return { rows: [] as T[] };
    if (sql.includes("SELECT mode FROM cutpilot_asset_usages")) return { rows: this.assetUsageRows.map((row) => ({ mode: row.mode })) as unknown as T[] };
    if (sql.includes("SELECT * FROM cutpilot_asset_usages WHERE project_id")) return { rows: this.assetUsageRows as T[] };
    if (
      sql.includes("SELECT * FROM cutpilot_scenes") ||
      sql.includes("SELECT * FROM cutpilot_takes") ||
      sql.includes("SELECT pa.*") ||
      sql.includes("SELECT * FROM cutpilot_generation_jobs") ||
      sql.includes("SELECT * FROM cutpilot_image_assets") ||
      sql.includes("SELECT * FROM cutpilot_image_jobs") ||
      sql.includes("SELECT * FROM cutpilot_asset_usages") ||
      sql.includes("SELECT * FROM cutpilot_reference_boards") ||
      sql.includes("SELECT * FROM cutpilot_credit_transactions") ||
      sql.includes("SELECT * FROM cutpilot_media_artifacts")
    ) {
      return { rows: [] as T[] };
    }
    if (sql.includes("UPDATE cutpilot_shots SET selected_take_id")) {
      const current = this.shotRows[0];
      if (current) {
        current.selected_take_id = params?.[1];
        current.status = params?.[2];
      }
      const updated = current ? (current as unknown as T) : null;
      return { rows: updated ? [updated] : [] };
    }
    if (sql.includes("UPDATE cutpilot_shots SET reference_image_ids")) {
      const current = this.shotRows[0];
      if (current) {
        current.reference_image_ids = typeof params?.[1] === "string" ? JSON.parse(params[1]) : params?.[1];
        current.requirements = typeof params?.[2] === "string" ? JSON.parse(params[2]) : params?.[2];
      }
      const updated = current ? (current as unknown as T) : null;
      return { rows: updated ? [updated] : [] };
    }
    if (sql.includes("UPDATE cutpilot_shots SET status = $2, requirements = $3, quality_flags = $4")) {
      const current = this.shotRows.find((shot) => shot.id === params?.[0]) || this.shotRows[0];
      if (current) {
        current.status = params?.[1];
        current.requirements = typeof params?.[2] === "string" ? JSON.parse(params[2]) : params?.[2];
        current.quality_flags = typeof params?.[3] === "string" ? JSON.parse(params[3]) : params?.[3];
      }
      return { rows: [] as T[] };
    }
    if (sql.includes("UPDATE cutpilot_shots SET status = $2, requirements = $3 WHERE id = $1")) {
      const current = this.shotRows.find((shot) => shot.id === params?.[0]) || this.shotRows[0];
      if (current) {
        current.status = params?.[1];
        current.requirements = typeof params?.[2] === "string" ? JSON.parse(params[2]) : params?.[2];
      }
      return { rows: [] as T[] };
    }
    if (sql.includes("UPDATE cutpilot_shots SET") && sql.includes("scene_id = $2")) {
      const current = this.shotRows.find((shot) => shot.id === params?.[0]) || this.shotRows[0];
      if (current) {
        current.scene_id = params?.[1];
        current.order_index = params?.[2];
        current.title = params?.[3];
        current.duration_sec = params?.[4];
        current.saec = typeof params?.[5] === "string" ? JSON.parse(params[5]) : params?.[5];
        current.requirements = typeof params?.[6] === "string" ? JSON.parse(params[6]) : params?.[6];
        current.status = params?.[7];
        current.selected_take_id = params?.[8] ?? null;
        current.quality_flags = typeof params?.[9] === "string" ? JSON.parse(params[9]) : params?.[9];
        current.direction_spec = typeof params?.[10] === "string" ? JSON.parse(params[10]) : params?.[10];
      }
      return { rows: [] as T[] };
    }
    if (sql.includes("UPDATE cutpilot_shots")) {
      const current = this.shotRows[0];
      const updated = current ? ({ ...current, direction_spec: params?.[1] } as unknown as T) : null;
      return { rows: updated ? [updated] : [] };
    }
    return { rows: [] as T[] };
  }

  private bundleProjectRow() {
    return {
      id: "prj_live",
      credit_account_id: "acct_live",
      title: "Live project",
      idea: "Create a live project",
      intent: "product_ad",
      status: "edited",
      aspect: "9:16",
      target_duration_sec: 30,
      progress: { shotsDone: 0, shotsTotal: 0 },
      characters: [],
      thumb_url: this.projectThumbUrl,
      default_render_job_id: this.defaultRenderJobId,
      credits: { spent: 0, estimateRemaining: 180 },
      created_at: "2026-06-07T00:00:00.000Z",
      updated_at: "2026-06-07T00:00:00.000Z",
      balance_credits: 1240,
      spent_credits: 0,
      reserved_credits: 0
    };
  }
}

function fakeShotRow(): Record<string, unknown> {
  return {
    id: "sht_live",
    project_id: "prj_live",
    scene_id: "scn_live",
    order_index: 0,
    title: "Opening frame",
    duration_sec: 3,
    saec: {
      subject: "Product",
      action: "Show",
      environment: "Studio",
      camera: "push",
      framing: "wide",
      lighting: "soft",
      style: "clean",
      negative: ""
    },
    requirements: {
      tier: "fast",
      aspect: "9:16",
      imageToVideo: false,
      needsLipsyncAudio: false,
      motionHeavy: false,
      characterLock: false,
      characterId: null,
      region: "US"
    },
    status: "pending",
    selected_take_id: null,
    quality_flags: [],
    reference_image_ids: [],
    direction_spec: { camera: "push", composition: "center", lighting: "soft", motion: "slow", style: "clean", avoid: ["blur"], notes: "" }
  };
}

function fakeSceneRow(): Record<string, unknown> {
  return {
    id: "scn_live",
    project_id: "prj_live",
    order_index: 0,
    title: "Opening",
    setting: "Studio",
    time_of_day: "day"
  };
}

function fakeImageAssetRow() {
  return {
    id: "img_ref",
    project_id: "prj_live",
    kind: "image",
    role: "product",
    source: "external",
    label: "Reference",
    prompt: "Reference image",
    url: "https://assets.cutpilot.local/reference.png",
    thumb_url: "https://assets.cutpilot.local/reference.png",
    aspect: "9:16",
    width: 1080,
    height: 1920,
    rights: { status: "user_confirmed", note: "ok" },
    created_at: "2026-06-07T00:00:00.000Z",
    updated_at: "2026-06-07T00:00:00.000Z"
  };
}

function fakeTakeRow(status: "queued" | "running" | "done" | "failed" = "done") {
  return {
    id: "tak_done",
    shot_id: "sht_live",
    project_id: "prj_live",
    label: "A",
    status,
    video_url: "https://assets.cutpilot.local/takes/tak_done.mp4",
    poster_url: "https://assets.cutpilot.local/takes/tak_done.jpg",
    duration_sec: 3,
    tier: "fast",
    engine_used: "mock",
    metrics: { overall: 0.9 },
    created_at: "2026-06-07T00:00:00.000Z"
  };
}

function fakeGenerationJobRow(status: "queued" | "running" | "done" | "failed" | "cancelled" = "queued") {
  return {
    id: "gen_live",
    project_id: "prj_live",
    shot_id: "sht_live",
    take_id: "tak_done",
    retry_of_job_id: null,
    status,
    progress: 0,
    eta_sec: 25,
    stage: "queued",
    should_fail: false,
    due_at: Date.now(),
    error: null,
    prompt_package: {},
    routing: {},
    created_at: "2026-06-07T00:00:00.000Z",
    updated_at: "2026-06-07T00:00:00.000Z"
  };
}

function fakeWorkerLeaseRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "wlease_live",
    token: "lease-token",
    dispatch_key: "provider_generation:gen_live",
    kind: "provider_generation",
    job_id: "gen_live",
    project_id: "prj_live",
    worker_id: "worker-live",
    status: "active",
    leased_at: "2026-06-07T00:00:00.000Z",
    expires_at: "2999-01-01T00:00:00.000Z",
    released_at: null,
    ...overrides
  };
}

function fakeDispatchGenerationJobRow(status: "queued" | "running" | "done" | "failed" | "cancelled" = "queued") {
  return {
    ...fakeGenerationJobRow(status),
    prompt_package: {
      projectId: "prj_live",
      shotId: "sht_live",
      durationSec: 3,
      saec: { subject: "Product", action: "Show", environment: "Studio", camera: "push", framing: "wide", lighting: "soft", style: "clean", negative: "" },
      directionSpec: { camera: "push", composition: "center", lighting: "soft", motion: "slow", style: "clean", avoid: [], notes: "" },
      requirements: {
        tier: "fast",
        aspect: "9:16",
        imageToVideo: false,
        needsLipsyncAudio: false,
        motionHeavy: false,
        characterLock: false,
        characterId: null,
        region: "US"
      },
      references: [],
      routingHints: {
        startFrameAssetId: null,
        lastFrameAssetId: null,
        styleReferenceAssetIds: [],
        characterReferenceAssetIds: [],
        productReferenceAssetIds: [],
        backgroundReferenceAssetIds: [],
        rightsReviewRequired: false
      }
    },
    routing: {
      ruleId: "mock",
      selected: { provider: "mock", model: "mock-video" },
      candidates: [{ provider: "mock", model: "mock-video" }],
      rejected: [],
      splitTakeIndex: 0,
      fallbackEnabled: true,
      hiddenFromUser: true
    }
  };
}

function fakeImageJobRow(status: "queued" | "running" | "done" | "failed" | "cancelled" = "queued") {
  return {
    id: "ijob_live",
    project_id: "prj_live",
    retry_of_job_id: null,
    status,
    progress: 0,
    eta_sec: 25,
    stage: "queued",
    prompt: "Image",
    purpose: "product",
    role: "product",
    aspect: "9:16",
    style: "clean",
    count: 2,
    variants: [{ id: "var_a", assetId: null, label: "A", status: "queued", url: null, thumbUrl: null, scoreLabel: "review" }],
    due_at: Date.now(),
    error: null,
    created_at: "2026-06-07T00:00:00.000Z",
    updated_at: "2026-06-07T00:00:00.000Z"
  };
}

function fakeEditRow() {
  return {
    project_id: "prj_live",
    captions: { enabled: true, mode: "burn-in", source: "script-first" },
    bgm: { enabled: true, track: "licensed track", ducking: true },
    voiceover: { enabled: false, voice: "Voice A", source: "licensed_tts" },
    transitions: "soft",
    commands: []
  };
}

function fakeRenderJob(status: "queued" | "running" | "done" | "failed" = "done") {
  return {
    id: "rnd_done",
    project_id: "prj_live",
    retry_of_job_id: null,
    spec: { resolution: "1080p", cut: "15s", aspect: "9:16", caption: "burn-in" },
    stage: "done",
    progress: status === "done" ? 100 : 20,
    status,
    output_url: "https://assets.cutpilot.local/renders/rnd_done.mp4",
    share_url: "https://cutpilot.local/share/rnd_done",
    eta_sec: null,
    due_at: Date.now(),
    created_at: "2026-06-07T00:00:00.000Z",
    updated_at: "2026-06-07T00:00:00.000Z",
    error: null,
    rights_review: { required: false, assetIds: [], items: [] },
    render_plan: { timeline: [], audioMix: true, captions: true }
  };
}

async function main() {
  const records = buildLiveProjectCreateRecords({
    idea: "Launch a live Postgres project",
    intent: "product_ad",
    advanced: { aspect: "9:16", durationSec: 30, tier: "fast" }
  });
  assert.equal(records.project.status, "storyboarded", "live project builder should create storyboarded projects");
  assert.equal(records.scenes.length, 4, "live project builder should create default scenes");
  assert.equal(records.shots.length, 10, "live project builder should create default shots");
  assert.equal(records.project.progress.shotsTotal, 10, "live project builder should set project progress totals");
  assert.equal(records.referenceBoard.productImages.length, 0, "live project builder should create an empty reference board");

  const client = new FakeClient();
  const adapter = new PostgresLivePersistenceWriteAdapter(client);
  const project = await adapter.createProject({
    idea: "Create a live project through the write adapter",
    intent: "product_ad",
    advanced: { aspect: "9:16", durationSec: 30, tier: "fast" }
  });
  assert.ok(project.id.startsWith("prj_"), "live write adapter should return the created project");
  assert.equal(client.queries[0].sql, "BEGIN", "live write adapter should begin a transaction");
  assert.ok(client.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_credit_accounts")), "live write adapter should insert a credit account");
  assert.ok(client.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_projects")), "live write adapter should insert the project");
  assert.equal(client.queries.filter((query) => query.sql.includes("INSERT INTO cutpilot_scenes")).length, 4, "live write adapter should insert scenes");
  assert.equal(client.queries.filter((query) => query.sql.includes("INSERT INTO cutpilot_shots")).length, 10, "live write adapter should insert shots");
  assert.ok(client.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_reference_boards")), "live write adapter should insert the reference board");
  assert.ok(client.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_project_edit_states")), "live write adapter should insert edit state");
  assert.equal(client.queries.at(-1)?.sql, "COMMIT", "live write adapter should commit successful creation");

  const failingClient = new FakeClient();
  failingClient.failOnShotInsert = true;
  await assert.rejects(
    () =>
      new PostgresLivePersistenceWriteAdapter(failingClient).createProject({
        idea: "Rollback a live project",
        intent: "product_ad"
      }),
    /shot insert failed/,
    "live write adapter should surface insert errors"
  );
  assert.equal(failingClient.queries.at(-1)?.sql, "ROLLBACK", "live write adapter should roll back failed creation");

  const renderClient = new FakeClient();
  renderClient.shotRows = [fakeShotRow()];
  renderClient.takeRow = fakeTakeRow("done");
  const renderResult = await new PostgresLivePersistenceWriteAdapter(renderClient).startRender("prj_live", {
    specs: [{ resolution: "720p", cut: "6s", aspect: "9:16", caption: "none" }]
  });
  assert.equal(renderResult.jobs.length, 1, "live render enqueue should create render jobs");
  assert.equal(renderResult.jobs[0].status, "queued", "live render enqueue should start jobs queued");
  assert.equal(renderResult.jobs[0].stage, "assemble", "live render enqueue should start at the assemble stage");
  assert.equal(renderResult.jobs[0].renderPlan.shots.length, 1, "live render enqueue should include available done takes in the render plan");
  assert.equal(renderClient.creditReserved, 16, "live render enqueue should reserve render credits");
  assert.equal(renderClient.creditTransactionCount, 1, "live render enqueue should record a reserve transaction");
  assert.ok(renderClient.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_render_jobs")), "live render enqueue should insert render jobs");
  assert.ok(renderClient.queries.some((query) => query.sql.includes("UPDATE cutpilot_projects SET status")), "live render enqueue should mark projects rendering");
  assert.equal(renderClient.queries.at(-1)?.sql, "COMMIT", "live render enqueue should commit successful jobs");

  const duplicateRenderClient = new FakeClient();
  duplicateRenderClient.renderJobRow = fakeRenderJob("queued");
  await assert.rejects(
    () =>
      new PostgresLivePersistenceWriteAdapter(duplicateRenderClient).startRender("prj_live", {
        specs: [duplicateRenderClient.renderJobRow?.spec as { resolution: "1080p"; cut: "15s"; aspect: "9:16"; caption: "burn-in" }]
      }),
    /Render job already active/,
    "live render enqueue should reject fully duplicated active specs"
  );
  assert.equal(duplicateRenderClient.queries.at(-1)?.sql, "ROLLBACK", "live render enqueue should roll back duplicate requests");

  const workerLeaseClient = new FakeClient();
  workerLeaseClient.generationJobRow = fakeDispatchGenerationJobRow("queued");
  const workerLeaseResult = await new PostgresLivePersistenceWriteAdapter(workerLeaseClient).createWorkerLease({
    workerId: " worker-live ",
    kind: "provider_generation",
    ttlSec: 30
  });
  assert.equal(workerLeaseResult.reason, "leased", "live worker lease creation should lease available dispatch work");
  assert.equal(workerLeaseResult.lease?.workerId, "worker-live", "live worker lease creation should trim worker ids");
  assert.equal(workerLeaseResult.item?.kind, "provider_generation", "live worker lease creation should preserve dispatch item kinds");
  assert.equal(workerLeaseClient.workerLeaseRows.length, 1, "live worker lease creation should insert a lease row");
  assert.equal(workerLeaseClient.workerLeaseRows[0].dispatch_key, "provider_generation:gen_live", "live worker lease creation should persist dispatch keys");
  assert.equal(workerLeaseClient.queries.at(-1)?.sql, "COMMIT", "live worker lease creation should commit successful leases");

  const busyWorkerLeaseClient = new FakeClient();
  busyWorkerLeaseClient.generationJobRow = fakeDispatchGenerationJobRow("queued");
  busyWorkerLeaseClient.workerLeaseRows = [fakeWorkerLeaseRow({ id: "wlease_busy", token: "token", worker_id: "worker-busy" })];
  const busyWorkerLeaseResult = await new PostgresLivePersistenceWriteAdapter(busyWorkerLeaseClient).createWorkerLease({
    workerId: "worker-live",
    kind: "provider_generation",
    ttlSec: 30
  });
  assert.equal(busyWorkerLeaseResult.reason, "no_available_work", "live worker lease creation should skip actively leased dispatch keys");
  assert.equal(busyWorkerLeaseResult.lease, null, "live worker lease creation should not create leases when no work is available");

  const releaseLeaseClient = new FakeClient();
  releaseLeaseClient.workerLeaseRows = [fakeWorkerLeaseRow()];
  const releaseLeaseResult = await new PostgresLivePersistenceWriteAdapter(releaseLeaseClient).releaseWorkerLease("wlease_live", "lease-token");
  assert.equal(releaseLeaseResult.released, true, "live worker lease release should release active leases with matching tokens");
  assert.equal(releaseLeaseResult.reason, "released", "live worker lease release should report success");
  assert.equal(releaseLeaseClient.workerLeaseRows[0].status, "released", "live worker lease release should persist released status");
  assert.ok(releaseLeaseClient.workerLeaseRows[0].released_at, "live worker lease release should persist release timestamps");
  assert.equal(releaseLeaseClient.queries.at(-1)?.sql, "COMMIT", "live worker lease release should commit successful releases");

  const wrongReleaseLeaseClient = new FakeClient();
  wrongReleaseLeaseClient.workerLeaseRows = [fakeWorkerLeaseRow()];
  const wrongReleaseLeaseResult = await new PostgresLivePersistenceWriteAdapter(wrongReleaseLeaseClient).releaseWorkerLease("wlease_live", "wrong-token");
  assert.equal(wrongReleaseLeaseResult.released, false, "live worker lease release should reject token mismatches");
  assert.equal(wrongReleaseLeaseResult.reason, "token_mismatch", "live worker lease release should report token mismatches");
  assert.equal(wrongReleaseLeaseClient.workerLeaseRows[0].status, "active", "live worker lease release should not mutate token mismatches");

  const renewLeaseClient = new FakeClient();
  const renewalOriginalExpiry = new Date(Date.now() + 30_000).toISOString();
  renewLeaseClient.workerLeaseRows = [fakeWorkerLeaseRow({ expires_at: renewalOriginalExpiry })];
  const renewLeaseResult = await new PostgresLivePersistenceWriteAdapter(renewLeaseClient).renewWorkerLease("wlease_live", {
    token: "lease-token",
    ttlSec: 120
  });
  assert.equal(renewLeaseResult.renewed, true, "live worker lease renewal should renew active leases with matching tokens");
  assert.equal(renewLeaseResult.reason, "renewed", "live worker lease renewal should report success");
  assert.equal(renewLeaseResult.lease?.status, "active", "live worker lease renewal should keep leases active");
  assert.ok(
    new Date(String(renewLeaseClient.workerLeaseRows[0].expires_at)).getTime() > new Date(renewalOriginalExpiry).getTime(),
    "live worker lease renewal should persist extended expiries"
  );
  assert.equal(renewLeaseClient.queries.at(-1)?.sql, "COMMIT", "live worker lease renewal should commit successful renewals");

  const expiredRenewLeaseClient = new FakeClient();
  expiredRenewLeaseClient.workerLeaseRows = [fakeWorkerLeaseRow({ expires_at: "2000-01-01T00:00:00.000Z" })];
  const expiredRenewLeaseResult = await new PostgresLivePersistenceWriteAdapter(expiredRenewLeaseClient).renewWorkerLease("wlease_live", {
    token: "lease-token",
    ttlSec: 120
  });
  assert.equal(expiredRenewLeaseResult.renewed, false, "live worker lease renewal should reject expired leases");
  assert.equal(expiredRenewLeaseResult.reason, "not_active", "live worker lease renewal should report expired leases as not active");

  const completeImageLeaseClient = new FakeClient();
  completeImageLeaseClient.imageJobRow = fakeImageJobRow("queued");
  completeImageLeaseClient.workerLeaseRows = [
    fakeWorkerLeaseRow({ dispatch_key: "image_generation:ijob_live", kind: "image_generation", job_id: "ijob_live" })
  ];
  const originalRuntimeMode = process.env.CUTPILOT_RUNTIME_MODE;
  try {
    process.env.CUTPILOT_RUNTIME_MODE = "production";
    const missingStorageCompletion = await new PostgresLivePersistenceWriteAdapter(completeImageLeaseClient).completeWorkerLease("wlease_live", {
      token: "lease-token",
      status: "succeeded",
      outputs: { imageVariants: [{ variantId: "var_a", imageUrl: "https://assets.cutpilot.local/images/var_a.png" }] }
    });
    assert.equal(missingStorageCompletion.completed, false, "live worker completion should reject missing production storage keys");
    assert.equal(missingStorageCompletion.reason, "invalid_outputs", "live worker completion should report invalid production outputs");

    const imageStorageKey = "projects/prj_live/imageJob/ijob_live/variants/var_a/image_asset";
    const thumbnailStorageKey = "projects/prj_live/imageJob/ijob_live/variants/var_a/image_thumbnail";
    const imageCompletion = await new PostgresLivePersistenceWriteAdapter(completeImageLeaseClient).completeWorkerLease("wlease_live", {
      token: "lease-token",
      status: "succeeded",
      outputs: {
        imageVariants: [
          {
            variantId: "var_a",
            imageUrl: "https://assets.cutpilot.local/images/var_a.png",
            imageStorageKey,
            thumbnailStorageKey
          }
        ]
      }
    });
    assert.equal(imageCompletion.completed, true, "live worker completion should complete image jobs with valid storage keys");
    assert.equal(imageCompletion.reason, "completed", "live worker completion should report completed image jobs");
    assert.equal(imageCompletion.receipt?.status, "succeeded", "live worker completion should return a succeeded receipt");
    assert.equal(imageCompletion.receipt?.summary.artifactCount, 2, "live worker completion should record image and thumbnail artifacts");
    assert.equal(imageCompletion.receipt?.summary.capturedCredits, 8, "live worker completion should capture reserved image credits");
    assert.equal(completeImageLeaseClient.workerLeaseRows[0].status, "released", "live worker completion should release completed leases");
    assert.equal(completeImageLeaseClient.imageJobRow?.status, "done", "live worker completion should persist completed image jobs");
    assert.equal(completeImageLeaseClient.mediaArtifactRows[0].storage_key, imageStorageKey, "live worker completion should persist worker storage keys");
  } finally {
    if (typeof originalRuntimeMode === "undefined") delete process.env.CUTPILOT_RUNTIME_MODE;
    else process.env.CUTPILOT_RUNTIME_MODE = originalRuntimeMode;
  }

  const imageJobClient = new FakeClient();
  const imageJobResult = await new PostgresLivePersistenceWriteAdapter(imageJobClient).createImageJob({
    projectId: "prj_live",
    prompt: " hero product render ",
    purpose: "product",
    role: "product",
    aspect: "9:16",
    count: 2
  });
  assert.ok(imageJobResult.job.id.startsWith("ijob_"), "live image job enqueue should create an image job id");
  assert.equal(imageJobResult.job.status, "queued", "live image job enqueue should start jobs queued");
  assert.equal(imageJobResult.job.prompt, "hero product render", "live image job enqueue should trim prompts");
  assert.equal(imageJobResult.job.variants.length, 2, "live image job enqueue should create requested variants");
  assert.equal(imageJobClient.creditReserved, 8, "live image job enqueue should reserve image generation credits");
  assert.equal(imageJobClient.creditTransactionCount, 1, "live image job enqueue should record a reserve transaction");
  assert.ok(imageJobClient.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_image_jobs")), "live image job enqueue should insert image jobs");
  assert.ok(imageJobClient.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_credit_transactions") && query.params?.[3] === "reserve"), "live image job enqueue should persist reserve ledger entries");
  assert.equal(imageJobClient.queries.at(-1)?.sql, "COMMIT", "live image job enqueue should commit successful jobs");

  const insufficientCreditClient = new FakeClient();
  insufficientCreditClient.creditBalance = 4;
  insufficientCreditClient.creditReserved = 4;
  await assert.rejects(
    () =>
      new PostgresLivePersistenceWriteAdapter(insufficientCreditClient).createImageJob({
        projectId: "prj_live",
        prompt: "expensive image",
        purpose: "product",
        role: "product",
        aspect: "9:16",
        count: 2
      }),
    (error) => error instanceof CreditReservationError && error.estimate.shortfallCredits === 8,
    "live image job enqueue should reject insufficient credits with the normalized credit error"
  );
  assert.equal(insufficientCreditClient.queries.at(-1)?.sql, "ROLLBACK", "live image job enqueue should roll back credit failures");
  assert.equal(
    insufficientCreditClient.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_image_jobs")),
    false,
    "live image job enqueue should not insert jobs when credit reservation fails"
  );

  const shotGenerateClient = new FakeClient();
  shotGenerateClient.shotRows = [fakeShotRow()];
  const shotGenerateResult = await new PostgresLivePersistenceWriteAdapter(shotGenerateClient).generateShot("sht_live", {
    tier: "final",
    takeCount: 2
  });
  assert.equal(shotGenerateResult.takes.length, 2, "live shot generation should create requested takes");
  assert.equal(shotGenerateResult.jobs.length, 2, "live shot generation should create requested jobs");
  assert.equal(shotGenerateResult.takes[0].tier, "final", "live shot generation should apply the requested tier");
  assert.equal(shotGenerateResult.jobs[0].providerAttempts.length, 1, "live shot generation should create a queued provider attempt");
  assert.equal(shotGenerateResult.jobs[0].promptPackage.shotId, "sht_live", "live shot generation should preserve prompt package shot ids");
  assert.equal(shotGenerateClient.creditReserved, 12, "live shot generation should reserve per-take credits");
  assert.equal(shotGenerateClient.creditTransactionCount, 2, "live shot generation should record one reserve transaction per job");
  assert.equal(shotGenerateClient.shotRows[0].status, "generating", "live shot generation should mark shots generating");
  assert.equal((shotGenerateClient.shotRows[0].requirements as Record<string, unknown>).tier, "final", "live shot generation should persist the requested shot tier");
  assert.ok(shotGenerateClient.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_takes")), "live shot generation should insert takes");
  assert.ok(shotGenerateClient.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_generation_jobs")), "live shot generation should insert generation jobs");
  assert.ok(shotGenerateClient.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_provider_attempts")), "live shot generation should insert provider attempts");
  assert.ok(shotGenerateClient.queries.some((query) => query.sql.includes("UPDATE cutpilot_projects SET progress")), "live shot generation should refresh project progress");
  assert.equal(shotGenerateClient.queries.at(-1)?.sql, "COMMIT", "live shot generation should commit successful jobs");

  const shotCreditClient = new FakeClient();
  shotCreditClient.shotRows = [fakeShotRow()];
  shotCreditClient.creditBalance = 0;
  await assert.rejects(
    () => new PostgresLivePersistenceWriteAdapter(shotCreditClient).generateShot("sht_live", { tier: "fast", takeCount: 1 }),
    (error) => error instanceof CreditReservationError && error.estimate.shortfallCredits === 6,
    "live shot generation should reject insufficient credits with the normalized credit error"
  );
  assert.equal(shotCreditClient.queries.at(-1)?.sql, "ROLLBACK", "live shot generation should roll back credit failures");
  assert.equal(
    shotCreditClient.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_generation_jobs")),
    false,
    "live shot generation should not insert jobs when the first credit reservation fails"
  );

  const generateAllClient = new FakeClient();
  const generateAllPendingShot = fakeShotRow();
  generateAllPendingShot.id = "sht_pending";
  generateAllPendingShot.order_index = 0;
  generateAllPendingShot.status = "pending";
  const generateAllFailedShot = fakeShotRow();
  generateAllFailedShot.id = "sht_failed";
  generateAllFailedShot.order_index = 1;
  generateAllFailedShot.status = "failed";
  const generateAllSelectedShot = fakeShotRow();
  generateAllSelectedShot.id = "sht_selected";
  generateAllSelectedShot.order_index = 2;
  generateAllSelectedShot.status = "selected";
  generateAllSelectedShot.selected_take_id = "tak_done";
  generateAllClient.shotRows = [generateAllPendingShot, generateAllFailedShot, generateAllSelectedShot];
  const generateAllResult = await new PostgresLivePersistenceWriteAdapter(generateAllClient).generateAll("prj_live", { tier: "economy" });
  assert.equal(generateAllResult.jobs.length, 6, "live generate-all should enqueue three takes for each pending or failed shot");
  assert.equal(generateAllClient.creditReserved, 36, "live generate-all should reserve credits for targeted shots");
  assert.equal(generateAllClient.creditTransactionCount, 6, "live generate-all should record per-job reserve transactions");
  assert.equal(generateAllClient.shotRows.find((shot) => shot.id === "sht_pending")?.status, "generating", "live generate-all should update pending shots");
  assert.equal(generateAllClient.shotRows.find((shot) => shot.id === "sht_failed")?.status, "generating", "live generate-all should update failed shots");
  assert.equal(generateAllClient.shotRows.find((shot) => shot.id === "sht_selected")?.status, "selected", "live generate-all should skip selected shots");
  assert.ok(generateAllClient.queries.some((query) => query.sql.includes("SELECT * FROM cutpilot_shots WHERE project_id")), "live generate-all should inspect project shots");
  assert.equal(generateAllClient.queries.filter((query) => query.sql === "COMMIT").length, 2, "live generate-all should commit each targeted shot generation");

  const upgradeClient = new FakeClient();
  upgradeClient.shotRows = [fakeShotRow()];
  upgradeClient.takeRow = fakeTakeRow("done");
  const upgradeResult = await new PostgresLivePersistenceWriteAdapter(upgradeClient).upgradeTake("tak_done", { mode: "enhance" });
  assert.equal(upgradeResult.take.tier, "final", "live take upgrade should create a final-tier take");
  assert.equal(upgradeResult.take.upgradeSourceTakeId, "tak_done", "live take upgrade should preserve the source take id");
  assert.equal(upgradeResult.take.upgradeMode, "enhance", "live take upgrade should persist the requested mode");
  assert.equal(upgradeResult.job.providerAttempts.length, 1, "live take upgrade should create an initial provider attempt");
  assert.equal(upgradeClient.creditReserved, 22, "live take upgrade should reserve upgrade credits");
  assert.equal(upgradeClient.creditTransactionCount, 1, "live take upgrade should record a reserve transaction");
  assert.equal(upgradeClient.shotRows[0].status, "generating", "live take upgrade should mark the source shot generating");
  assert.equal((upgradeClient.shotRows[0].requirements as Record<string, unknown>).tier, "final", "live take upgrade should persist final shot tier");
  assert.ok(upgradeClient.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_takes") && query.sql.includes("upgrade_source_take_id")), "live take upgrade should insert an upgrade take");
  assert.ok(upgradeClient.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_generation_jobs")), "live take upgrade should insert a generation job");
  assert.ok(upgradeClient.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_provider_attempts")), "live take upgrade should insert a provider attempt");
  assert.equal(upgradeClient.queries.at(-1)?.sql, "COMMIT", "live take upgrade should commit successful jobs");

  const unfinishedUpgradeClient = new FakeClient();
  unfinishedUpgradeClient.takeRow = fakeTakeRow("running");
  await assert.rejects(
    () => new PostgresLivePersistenceWriteAdapter(unfinishedUpgradeClient).upgradeTake("tak_done", { mode: "enhance" }),
    /Done take not found/,
    "live take upgrade should reject unfinished source takes"
  );
  assert.equal(unfinishedUpgradeClient.queries.at(-1)?.sql, "ROLLBACK", "live take upgrade should roll back unfinished source takes");

  const directionClient = new FakeClient();
  directionClient.shotRows = [fakeShotRow()];
  const updatedShot = await new PostgresLivePersistenceWriteAdapter(directionClient).updateShotDirection("sht_live", {
    motion: "locked",
    avoid: [" flicker ", ""]
  });
  assert.equal(updatedShot.directionSpec.motion, "locked", "live write adapter should merge direction patches");
  assert.deepEqual(updatedShot.directionSpec.avoid, ["flicker"], "live write adapter should normalize direction avoid terms");
  assert.equal(directionClient.queries[0].sql, "BEGIN", "live direction update should begin a transaction");
  assert.ok(directionClient.queries.some((query) => query.sql.includes("SELECT * FROM cutpilot_shots") && query.sql.includes("FOR UPDATE")), "live direction update should lock the shot row");
  assert.ok(directionClient.queries.some((query) => query.sql.includes("UPDATE cutpilot_shots")), "live direction update should update shot direction spec");
  assert.equal(directionClient.queries.at(-1)?.sql, "COMMIT", "live direction update should commit successful updates");

  const missingShotClient = new FakeClient();
  await assert.rejects(
    () => new PostgresLivePersistenceWriteAdapter(missingShotClient).updateShotDirection("sht_missing", { camera: "locked" }),
    /Shot not found/,
    "live direction update should surface missing shots"
  );
  assert.equal(missingShotClient.queries.at(-1)?.sql, "ROLLBACK", "live direction update should roll back missing shot updates");

  const selectTakeClient = new FakeClient();
  selectTakeClient.shotRows = [fakeShotRow()];
  selectTakeClient.takeRow = fakeTakeRow("done");
  const selectedShot = await new PostgresLivePersistenceWriteAdapter(selectTakeClient).selectTake("sht_live", "tak_done");
  assert.equal(selectedShot.selectedTakeId, "tak_done", "live take selection should persist selected take id");
  assert.equal(selectedShot.status, "selected", "live take selection should mark shots selected");
  assert.ok(selectTakeClient.queries.some((query) => query.sql.includes("SELECT * FROM cutpilot_takes") && query.sql.includes("FOR UPDATE")), "live take selection should lock the take row");
  assert.ok(selectTakeClient.queries.some((query) => query.sql.includes("UPDATE cutpilot_shots SET selected_take_id")), "live take selection should update the shot");
  assert.ok(selectTakeClient.queries.some((query) => query.sql.includes("UPDATE cutpilot_projects SET progress")), "live take selection should refresh project progress");
  assert.equal(selectTakeClient.queries.at(-1)?.sql, "COMMIT", "live take selection should commit successful selections");

  const queuedTakeClient = new FakeClient();
  queuedTakeClient.shotRows = [fakeShotRow()];
  queuedTakeClient.takeRow = fakeTakeRow("running");
  await assert.rejects(
    () => new PostgresLivePersistenceWriteAdapter(queuedTakeClient).selectTake("sht_live", "tak_done"),
    /Selectable take not found/,
    "live take selection should reject unfinished takes"
  );
  assert.equal(queuedTakeClient.queries.at(-1)?.sql, "ROLLBACK", "live take selection should roll back unfinished takes");

  const storyboardClient = new FakeClient();
  const storyboardShot = fakeShotRow();
  storyboardShot.status = "selected";
  storyboardShot.selected_take_id = "tak_done";
  storyboardShot.quality_flags = [{ axis: "motion", score: 0.4, hint: "Retry" }];
  storyboardClient.sceneRows = [fakeSceneRow()];
  storyboardClient.shotRows = [storyboardShot];
  const storyboardBundle = await new PostgresLivePersistenceWriteAdapter(storyboardClient).updateStoryboard("prj_live", {
    scenes: [{ id: "scn_live", title: " New opening " }],
    shots: [{ id: "sht_live", title: " Updated shot ", durationSec: 30, directionSpec: { avoid: [" blur ", ""] } }]
  });
  assert.equal(storyboardClient.sceneRows[0].title, "New opening", "live storyboard update should update scene fields");
  assert.equal(storyboardBundle?.shots[0].title, "Updated shot", "live storyboard update should return the updated shot");
  assert.equal(storyboardBundle?.shots[0].durationSec, 16, "live storyboard update should clamp shot duration");
  assert.equal(storyboardBundle?.shots[0].selectedTakeId, null, "live storyboard update should clear selected takes after shot changes");
  assert.equal(storyboardBundle?.shots[0].status, "pending", "live storyboard update should reset selected shots to pending");
  assert.deepEqual(storyboardBundle?.shots[0].directionSpec.avoid, ["blur"], "live storyboard update should normalize direction avoid terms");
  assert.ok(storyboardClient.queries.some((query) => query.sql.includes("UPDATE cutpilot_projects SET progress")), "live storyboard update should refresh project progress");
  assert.equal(storyboardClient.queries.at(-1)?.sql, "COMMIT", "live storyboard update should commit successful updates");

  const missingStoryboardProjectClient = new FakeClient();
  missingStoryboardProjectClient.projectExists = false;
  await assert.rejects(
    () => new PostgresLivePersistenceWriteAdapter(missingStoryboardProjectClient).updateStoryboard("prj_missing", { scenes: [], shots: [] }),
    /Project not found/,
    "live storyboard update should surface missing projects"
  );
  assert.equal(missingStoryboardProjectClient.queries.at(-1)?.sql, "ROLLBACK", "live storyboard update should roll back missing projects");

  const cancelGenerationClient = new FakeClient();
  cancelGenerationClient.generationJobRow = fakeGenerationJobRow("queued");
  cancelGenerationClient.takeRow = fakeTakeRow("queued");
  cancelGenerationClient.shotRows = [fakeShotRow()];
  cancelGenerationClient.creditReserved = 6;
  const cancelledGeneration = await new PostgresLivePersistenceWriteAdapter(cancelGenerationClient).cancelJob("gen_live");
  assert.equal(cancelledGeneration.cancelled, true, "live generation cancellation should cancel active jobs");
  assert.equal(cancelledGeneration.refundedCredits, 6, "live generation cancellation should refund generation credits");
  assert.equal(cancelGenerationClient.creditReserved, 0, "live generation cancellation should reduce reserved credits");
  assert.equal(cancelGenerationClient.creditTransactionCount, 1, "live generation cancellation should record a refund transaction");
  assert.ok(cancelGenerationClient.queries.some((query) => query.sql.includes("UPDATE cutpilot_generation_jobs")), "live generation cancellation should update the generation job");
  assert.ok(cancelGenerationClient.queries.some((query) => query.sql.includes("UPDATE cutpilot_takes")), "live generation cancellation should cancel the take");
  assert.equal(cancelGenerationClient.queries.at(-1)?.sql, "COMMIT", "live generation cancellation should commit successful cancellations");

  const cancelImageClient = new FakeClient();
  cancelImageClient.imageJobRow = fakeImageJobRow("running");
  cancelImageClient.creditReserved = 8;
  const cancelledImage = await new PostgresLivePersistenceWriteAdapter(cancelImageClient).cancelJob("ijob_live");
  assert.equal(cancelledImage.cancelled, true, "live image cancellation should cancel active jobs");
  assert.equal(cancelledImage.refundedCredits, 8, "live image cancellation should refund image credits");
  assert.equal(cancelImageClient.creditTransactionCount, 1, "live image cancellation should record a refund transaction");

  const cancelRenderClient = new FakeClient();
  cancelRenderClient.renderJobRow = fakeRenderJob("running");
  cancelRenderClient.creditReserved = 16;
  const cancelledRender = await new PostgresLivePersistenceWriteAdapter(cancelRenderClient).cancelJob("rnd_done");
  assert.equal(cancelledRender.cancelled, true, "live render cancellation should cancel active jobs");
  assert.equal(cancelledRender.refundedCredits, 16, "live render cancellation should refund render credits");
  assert.ok(cancelRenderClient.queries.some((query) => query.sql.includes("UPDATE cutpilot_render_jobs")), "live render cancellation should update render jobs");

  const missingCancelClient = new FakeClient();
  const missingCancel = await new PostgresLivePersistenceWriteAdapter(missingCancelClient).cancelJob("gen_missing");
  assert.equal(missingCancel.kind, null, "live job cancellation should return not found-shaped results for missing jobs");
  assert.equal(missingCancel.cancelled, false, "live job cancellation should not cancel missing jobs");

  const editClient = new FakeClient();
  editClient.editRows = [fakeEditRow()];
  const edited = await new PostgresLivePersistenceWriteAdapter(editClient).applyEdit("prj_live", "trim opening");
  assert.equal(edited.commands.length, 1, "live edit update should append edit commands");
  assert.equal(edited.commands[0].command, "trim opening", "live edit update should preserve the edit command");
  assert.ok(editClient.queries.some((query) => query.sql.includes("SELECT id FROM cutpilot_projects") && query.sql.includes("FOR UPDATE")), "live edit update should lock the project row");
  assert.ok(editClient.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_project_edit_states") && query.sql.includes("ON CONFLICT")), "live edit update should upsert edit state");
  assert.ok(editClient.queries.some((query) => query.sql.includes("UPDATE cutpilot_projects SET status")), "live edit update should mark projects edited");
  assert.equal(editClient.queries.at(-1)?.sql, "COMMIT", "live edit update should commit successful updates");

  const audioClient = new FakeClient();
  const audio = await new PostgresLivePersistenceWriteAdapter(audioClient).setAudio("prj_live", {
    transitions: "none",
    captions: { enabled: false, mode: "srt", source: "script-first" }
  });
  assert.equal(audio.transitions, "none", "live audio update should apply transition patches");
  assert.equal(audio.captions.enabled, false, "live audio update should apply caption patches");
  assert.ok(audioClient.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_project_edit_states") && query.sql.includes("ON CONFLICT")), "live audio update should upsert edit state");
  assert.equal(audioClient.queries.at(-1)?.sql, "COMMIT", "live audio update should commit successful updates");

  const missingProjectClient = new FakeClient();
  missingProjectClient.projectExists = false;
  await assert.rejects(
    () => new PostgresLivePersistenceWriteAdapter(missingProjectClient).setAudio("prj_missing", { transitions: "none" }),
    /Project not found/,
    "live edit state updates should surface missing projects"
  );
  assert.equal(missingProjectClient.queries.at(-1)?.sql, "ROLLBACK", "live edit state updates should roll back missing projects");

  const externalImageClient = new FakeClient();
  externalImageClient.projectAspect = "4:5";
  const externalImage = await new PostgresLivePersistenceWriteAdapter(externalImageClient).registerExternalImage({
    projectId: "prj_live",
    label: " Product reference ",
    role: "product",
    url: " https://assets.cutpilot.local/reference.png ",
    rightsConfirmed: true
  });
  assert.ok(externalImage.id.startsWith("img_"), "live external image registration should create an image asset id");
  assert.equal(externalImage.label, "Product reference", "live external image registration should trim labels");
  assert.equal(externalImage.url, "https://assets.cutpilot.local/reference.png", "live external image registration should trim URLs");
  assert.equal(externalImage.aspect, "4:5", "live external image registration should default to the project aspect");
  assert.equal(externalImage.width, 1280, "live external image registration should derive image width from aspect");
  assert.equal(externalImage.rights.status, "user_confirmed", "live external image registration should persist confirmed rights");
  assert.ok(externalImageClient.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_image_assets")), "live external image registration should insert image assets");
  assert.ok(externalImageClient.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_reference_boards") && query.sql.includes("ON CONFLICT")), "live external image registration should upsert the reference board");
  assert.equal(externalImageClient.queries.at(-1)?.sql, "COMMIT", "live external image registration should commit successful registrations");

  const missingImageProjectClient = new FakeClient();
  missingImageProjectClient.projectExists = false;
  await assert.rejects(
    () =>
      new PostgresLivePersistenceWriteAdapter(missingImageProjectClient).registerExternalImage({
        projectId: "prj_missing",
        label: "Missing project image",
        role: "product",
        url: "https://assets.cutpilot.local/reference.png"
      }),
    /Project not found/,
    "live external image registration should surface missing projects"
  );
  assert.equal(missingImageProjectClient.queries.at(-1)?.sql, "ROLLBACK", "live external image registration should roll back missing projects");

  const attachReferenceClient = new FakeClient();
  attachReferenceClient.shotRows = [fakeShotRow()];
  attachReferenceClient.imageAssetRow = fakeImageAssetRow();
  const attachedShot = await new PostgresLivePersistenceWriteAdapter(attachReferenceClient).attachImageToShot("sht_live", {
    assetId: "img_ref",
    mode: "first_frame"
  });
  assert.deepEqual(attachedShot.referenceImageIds, ["img_ref"], "live reference attachment should add image references to the shot");
  assert.equal(attachedShot.requirements.imageToVideo, true, "live reference attachment should enable image-to-video for frame references");
  assert.ok(attachReferenceClient.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_asset_usages")), "live reference attachment should insert asset usages");
  assert.ok(attachReferenceClient.queries.some((query) => query.sql.includes("UPDATE cutpilot_shots SET reference_image_ids")), "live reference attachment should persist shot references");
  assert.equal(attachReferenceClient.queries.at(-1)?.sql, "COMMIT", "live reference attachment should commit successful updates");

  const detachReferenceClient = new FakeClient();
  const referencedShot = fakeShotRow();
  referencedShot.reference_image_ids = ["img_ref"];
  referencedShot.requirements = { ...(referencedShot.requirements as Record<string, unknown>), imageToVideo: true };
  detachReferenceClient.shotRows = [referencedShot];
  detachReferenceClient.imageAssetRow = fakeImageAssetRow();
  detachReferenceClient.assetUsageRows = [{ asset_id: "img_ref", project_id: "prj_live", target: "shot", target_id: "sht_live", mode: "first_frame" }];
  const detachedShot = await new PostgresLivePersistenceWriteAdapter(detachReferenceClient).detachImageFromShot("sht_live", "img_ref");
  assert.deepEqual(detachedShot.referenceImageIds, [], "live reference detach should remove image references from the shot");
  assert.equal(detachedShot.requirements.imageToVideo, false, "live reference detach should disable image-to-video when no frame references remain");
  assert.ok(detachReferenceClient.queries.some((query) => query.sql.includes("DELETE FROM cutpilot_asset_usages")), "live reference detach should remove shot asset usages");
  assert.equal(detachReferenceClient.queries.at(-1)?.sql, "COMMIT", "live reference detach should commit successful updates");

  const missingReferenceAssetClient = new FakeClient();
  missingReferenceAssetClient.shotRows = [fakeShotRow()];
  await assert.rejects(
    () =>
      new PostgresLivePersistenceWriteAdapter(missingReferenceAssetClient).attachImageToShot("sht_live", {
        assetId: "img_missing",
        mode: "first_frame"
      }),
    /Shot or image asset not found/,
    "live reference attachment should surface missing assets"
  );
  assert.equal(missingReferenceAssetClient.queries.at(-1)?.sql, "ROLLBACK", "live reference attachment should roll back missing assets");

  const blockedDeleteClient = new FakeClient();
  blockedDeleteClient.imageAssetRow = fakeImageAssetRow();
  blockedDeleteClient.assetUsageRows = [{ asset_id: "img_ref", project_id: "prj_live", target: "shot", target_id: "sht_live", mode: "first_frame" }];
  const blockedDelete = await new PostgresLivePersistenceWriteAdapter(blockedDeleteClient).deleteImageAsset("prj_live", "img_ref");
  assert.equal(blockedDelete.deleted, false, "live asset delete should block used assets without force");
  assert.equal(blockedDelete.blockedByUsage, true, "live asset delete should report usage blocking");
  assert.equal(blockedDelete.usageCount, 1, "live asset delete should return usage count");
  assert.equal(blockedDelete.remainingAssets, 1, "blocked live asset delete should keep the asset count");
  assert.equal(blockedDeleteClient.imageAssetDeleted, false, "blocked live asset delete should not delete the asset");
  assert.equal(blockedDeleteClient.queries.at(-1)?.sql, "COMMIT", "blocked live asset delete should close the read transaction");

  const forcedDeleteClient = new FakeClient();
  const deleteShot = fakeShotRow();
  deleteShot.reference_image_ids = ["img_ref"];
  deleteShot.requirements = { ...(deleteShot.requirements as Record<string, unknown>), imageToVideo: true };
  forcedDeleteClient.shotRows = [deleteShot];
  forcedDeleteClient.imageAssetRow = fakeImageAssetRow();
  forcedDeleteClient.assetUsageRows = [{ asset_id: "img_ref", project_id: "prj_live", target: "shot", target_id: "sht_live", mode: "first_frame" }];
  const forcedDelete = await new PostgresLivePersistenceWriteAdapter(forcedDeleteClient).deleteImageAsset("prj_live", "img_ref", { force: true });
  assert.equal(forcedDelete.deleted, true, "forced live asset delete should delete used assets");
  assert.equal(forcedDelete.usageCount, 1, "forced live asset delete should report removed usage count");
  assert.equal(forcedDelete.remainingAssets, 0, "forced live asset delete should return remaining asset count");
  assert.equal(forcedDeleteClient.imageAssetDeleted, true, "forced live asset delete should remove the asset row");
  assert.deepEqual(forcedDeleteClient.shotRows[0].reference_image_ids, [], "forced live asset delete should remove shot references");
  assert.ok(forcedDeleteClient.queries.some((query) => query.sql.includes("DELETE FROM cutpilot_image_assets")), "forced live asset delete should delete the image asset row");
  assert.equal(forcedDeleteClient.queries.at(-1)?.sql, "COMMIT", "forced live asset delete should commit successful deletes");

  const defaultRenderClient = new FakeClient();
  defaultRenderClient.renderJobRow = fakeRenderJob("done");
  const defaultBundle = await new PostgresLivePersistenceWriteAdapter(defaultRenderClient).setDefaultRender("prj_live", "rnd_done");
  assert.equal(defaultBundle?.project.defaultRenderJobId, "rnd_done", "live default render update should return the updated project bundle");
  assert.equal(defaultBundle?.project.thumbUrl, "https://assets.cutpilot.local/renders/rnd_done.mp4", "live default render update should use render output as the thumbnail");
  assert.ok(defaultRenderClient.queries.some((query) => query.sql.includes("SELECT * FROM cutpilot_render_jobs") && query.sql.includes("FOR UPDATE")), "live default render update should lock the render job");
  assert.ok(defaultRenderClient.queries.some((query) => query.sql.includes("UPDATE cutpilot_projects SET default_render_job_id")), "live default render update should persist default render selection");
  assert.equal(defaultRenderClient.queries.at(-1)?.sql, "COMMIT", "live default render update should commit successful updates");

  const unfinishedRenderClient = new FakeClient();
  unfinishedRenderClient.renderJobRow = fakeRenderJob("running");
  await assert.rejects(
    () => new PostgresLivePersistenceWriteAdapter(unfinishedRenderClient).setDefaultRender("prj_live", "rnd_done"),
    /Only completed renders can be the default version/,
    "live default render update should reject unfinished renders"
  );
  assert.equal(unfinishedRenderClient.queries.at(-1)?.sql, "ROLLBACK", "live default render update should roll back unfinished renders");

  console.log("live-persistence-write-adapter.test OK", {
    insertStatements: client.queries.filter((query) => query.sql.includes("INSERT INTO")).length
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
