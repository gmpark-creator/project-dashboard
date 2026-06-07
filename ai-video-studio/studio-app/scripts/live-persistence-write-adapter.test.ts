import assert from "node:assert/strict";
import { buildLiveProjectCreateRecords } from "../src/server/live-project-builder";
import { PostgresLivePersistenceWriteAdapter } from "../src/server/live-persistence-write-adapter";
import type { PgQueryable } from "../src/server/live-persistence-migrations";

class FakeClient implements PgQueryable {
  queries: Array<{ sql: string; params?: unknown[] }> = [];
  failOnShotInsert = false;
  projectExists = true;
  projectAspect = "9:16";
  defaultRenderJobId: string | null = null;
  projectThumbUrl: string | null = null;
  editRows: Record<string, unknown>[] = [];
  renderJobRow: Record<string, unknown> | null = null;
  sceneRows: Record<string, unknown>[] = [];
  shotRows: Record<string, unknown>[] = [];
  takeRow: Record<string, unknown> | null = null;
  imageAssetRow: Record<string, unknown> | null = null;
  imageAssetDeleted = false;
  assetUsageRows: Record<string, unknown>[] = [];
  projectIntent = "product_ad";

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
    if (sql.includes("INSERT INTO cutpilot_image_assets")) return { rows: [] as T[] };
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
    if (sql.includes("SELECT status, selected_take_id FROM cutpilot_shots WHERE project_id")) {
      const rows = this.shotRows.map((shot) => ({ status: shot.status, selected_take_id: shot.selected_take_id })) as unknown as T[];
      return { rows };
    }
    if (sql.includes("SELECT * FROM cutpilot_shots WHERE project_id") && sql.includes("reference_image_ids")) {
      const rows = this.shotRows.filter((shot) => Array.isArray(shot.reference_image_ids) && shot.reference_image_ids.includes(params?.[1] as string)) as T[];
      return { rows };
    }
    if (sql.includes("SELECT * FROM cutpilot_shots")) return { rows: this.shotRows as T[] };
    if (sql.includes("SELECT * FROM cutpilot_takes WHERE id")) return { rows: this.takeRow ? ([this.takeRow as unknown as T]) : [] };
    if (sql.includes("SELECT * FROM cutpilot_image_assets WHERE id")) return { rows: this.imageAssetRow ? ([this.imageAssetRow as unknown as T]) : [] };
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
