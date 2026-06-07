import assert from "node:assert/strict";
import { PostgresLivePersistenceReadAdapter } from "../src/server/live-persistence-read-adapter";
import type { PgQueryable } from "../src/server/live-persistence-migrations";

const now = "2026-06-07T11:20:00.000Z";
const projectId = "prj_live_read";
const sceneId = "scn_live_read";
const shotId = "shot_live_read";
const takeId = "take_live_read";
const genJobId = "gen_live_read";
const assetId = "img_live_read";

class FakeClient implements PgQueryable {
  queries: Array<{ sql: string; params?: unknown[] }> = [];

  async query<T extends Record<string, unknown> = Record<string, unknown>>(sql: string, params?: unknown[]) {
    this.queries.push({ sql, params });
    const rows = this.rowsFor(sql, params);
    return { rows: rows as T[] };
  }

  private rowsFor(sql: string, params?: unknown[]): Record<string, unknown>[] {
    if (sql.includes("FROM cutpilot_projects p")) {
      return [
        {
          id: projectId,
          credit_account_id: "acct_live_read",
          title: "Live read project",
          idea: "Validate the Postgres read adapter",
          intent: "product_ad",
          status: "reviewing",
          aspect: "9:16",
          target_duration_sec: 15,
          progress: { shotsDone: 1, shotsTotal: 1 },
          characters: [],
          thumb_url: "https://assets.cutpilot.local/thumb.jpg",
          default_render_job_id: null,
          credits: { spent: 18, estimateRemaining: 12 },
          created_at: now,
          updated_at: now,
          balance_credits: 100,
          spent_credits: 18,
          reserved_credits: 0
        }
      ];
    }
    if (sql.includes("FROM cutpilot_scenes")) {
      return [{ id: sceneId, project_id: projectId, order_index: 0, title: "Scene", setting: "Studio", time_of_day: "day" }];
    }
    if (sql.includes("FROM cutpilot_shots")) {
      return [
        {
          id: shotId,
          project_id: projectId,
          scene_id: sceneId,
          order_index: 0,
          title: "Shot",
          duration_sec: 6,
          saec: { subject: "Product", action: "spins", environment: "studio", camera: "push", framing: "close", lighting: "soft", style: "clean", negative: "" },
          requirements: {
            tier: "fast",
            aspect: "9:16",
            imageToVideo: true,
            needsLipsyncAudio: false,
            motionHeavy: false,
            characterLock: false,
            characterId: null,
            region: "global"
          },
          status: "selected",
          selected_take_id: takeId,
          quality_flags: [],
          reference_image_ids: [assetId],
          direction_spec: { camera: "push", composition: "center", lighting: "soft", motion: "slow", style: "clean", avoid: [], notes: "" }
        }
      ];
    }
    if (sql.includes("FROM cutpilot_takes")) {
      return [
        {
          id: takeId,
          project_id: projectId,
          shot_id: shotId,
          label: "Take 1",
          status: "done",
          video_url: "https://assets.cutpilot.local/take.mp4",
          poster_url: "https://assets.cutpilot.local/poster.jpg",
          duration_sec: 6,
          tier: "fast",
          engine_used: null,
          metrics: { overall: 0.9 },
          upgrade_source_take_id: null,
          upgrade_mode: null,
          created_at: now
        }
      ];
    }
    if (sql.includes("FROM cutpilot_provider_attempts")) {
      return [
        {
          id: "pat_live_read",
          generation_job_id: genJobId,
          provider: "mock",
          model: "mock-video",
          request_id: "req_live_read",
          status: "succeeded",
          started_at: now,
          completed_at: now,
          latency_ms: 1000,
          error_code: null,
          retryable: false,
          fallback_suggested: false
        }
      ];
    }
    if (sql.includes("FROM cutpilot_generation_jobs")) {
      if (sql.includes("WHERE id = $1") && params?.[0] !== genJobId) return [];
      const status = sql.includes("ORDER BY updated_at DESC") ? "failed" : "queued";
      return [
        {
          id: genJobId,
          project_id: projectId,
          shot_id: shotId,
          take_id: takeId,
          retry_of_job_id: null,
          status,
          progress: status === "failed" ? 1 : 0,
          eta_sec: status === "failed" ? 0 : 6,
          stage: status === "failed" ? "failed" : "queued",
          should_fail: false,
          due_at: 1,
          error: status === "failed" ? { code: "WORKER_FAILED", userMessage: "Worker failed", retryable: true, fallbackSuggested: true } : null,
          prompt_package: {
            projectId,
            shotId,
            durationSec: 6,
            saec: { subject: "Product", action: "spins", environment: "studio", camera: "push", framing: "close", lighting: "soft", style: "clean", negative: "" },
            directionSpec: { camera: "push", composition: "center", lighting: "soft", motion: "slow", style: "clean", avoid: [], notes: "" },
            requirements: {
              tier: "fast",
              aspect: "9:16",
              imageToVideo: true,
              needsLipsyncAudio: false,
              motionHeavy: false,
              characterLock: false,
              characterId: null,
              region: "global"
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
          routing: { ruleId: "mock", selected: { provider: "mock", model: "mock-video" }, candidates: [], rejected: [], splitTakeIndex: 0, fallbackEnabled: true, hiddenFromUser: true },
          created_at: now,
          updated_at: now
        }
      ];
    }
    if (sql.includes("FROM cutpilot_render_jobs")) return [];
    if (sql.includes("FROM cutpilot_image_assets")) {
      return [
        {
          id: assetId,
          project_id: projectId,
          kind: "image",
          role: "product",
          source: "upload",
          label: "Reference",
          prompt: "",
          url: "https://assets.cutpilot.local/ref.png",
          thumb_url: "https://assets.cutpilot.local/ref-thumb.jpg",
          aspect: "9:16",
          width: 1080,
          height: 1920,
          rights: { status: "user_confirmed", note: "owned" },
          created_at: now,
          updated_at: now
        }
      ];
    }
    if (sql.includes("FROM cutpilot_image_jobs")) return [];
    if (sql.includes("FROM cutpilot_asset_usages")) {
      return [{ asset_id: assetId, project_id: projectId, target: "shot", target_id: shotId, role: "product", mode: "product_reference", created_at: now }];
    }
    if (sql.includes("FROM cutpilot_reference_boards")) {
      return [{ project_id: projectId, product_images: [assetId], character_images: [], location_images: [], style_images: [], keyframes: [], thumbnails: [], logos: [], backgrounds: [], updated_at: now }];
    }
    if (sql.includes("FROM cutpilot_project_edit_states")) {
      return [
        {
          project_id: projectId,
          captions: { enabled: true, mode: "burn-in", source: "script-first" },
          bgm: { enabled: false, track: "", ducking: true },
          voiceover: { enabled: false, voice: "Voice A", source: "licensed_tts" },
          transitions: "soft",
          commands: []
        }
      ];
    }
    if (sql.includes("FROM cutpilot_credit_transactions")) {
      return [
        {
          id: "ctx_live_read",
          project_id: projectId,
          job_id: genJobId,
          kind: "capture",
          action: "generateShot",
          credits: 18,
          provider_cost_usd: "0.120000",
          margin_policy_version: "sandbox-v1",
          balance_after: { spent: 18, reserved: 0, available: 82 },
          note: "capture",
          created_at: now
        }
      ];
    }
    if (sql.includes("FROM cutpilot_media_artifacts")) {
      return [
        {
          id: "art_live_read",
          project_id: projectId,
          owner_type: "take",
          owner_id: takeId,
          source_job_id: genJobId,
          kind: "video",
          role: "take_video",
          url: "https://assets.cutpilot.local/take.mp4",
          storage_key: `projects/${projectId}/take/${takeId}/take_video`,
          content_type: "video/mp4",
          bytes: 1024,
          status: "stored",
          created_at: now
        }
      ];
    }
    if (sql.includes("FROM cutpilot_worker_leases")) {
      return [
        {
          id: "wlease_live_read",
          token: "lease-token",
          dispatch_key: `provider_generation:${genJobId}`,
          kind: "provider_generation",
          job_id: genJobId,
          project_id: projectId,
          worker_id: "worker-live",
          status: "active",
          leased_at: now,
          expires_at: "2999-01-01T00:00:00.000Z",
          released_at: null
        }
      ];
    }
    return [];
  }
}

async function main() {
  const client = new FakeClient();
  const adapter = new PostgresLivePersistenceReadAdapter(client);

  const projects = await adapter.listProjects();
  assert.equal(projects.length, 1, "live read adapter should map project lists");
  assert.equal(projects[0].id, projectId, "live read adapter should preserve project ids");

  const bundle = await adapter.getProjectBundle(projectId);
  assert.ok(bundle, "live read adapter should return a project bundle");
  assert.equal(bundle.project.id, projectId, "bundle should include the project");
  assert.equal(bundle.scenes[0].order, 0, "bundle should map scene order");
  assert.equal(bundle.shots[0].selectedTakeId, takeId, "bundle should map shot selected take");
  assert.equal(bundle.takes[0].metrics.overall, 0.9, "bundle should map take metrics");
  assert.equal(bundle.generationJobs[0].providerAttempts[0].requestId, "req_live_read", "bundle should attach provider attempts to generation jobs");
  assert.equal(bundle.referenceBoard.usages.length, 1, "bundle should attach asset usages to the reference board");
  assert.equal(bundle.credits.balance, 100, "bundle should map account credit balance");
  assert.equal(bundle.creditTransactions[0].providerCostUsd, 0.12, "bundle should parse numeric provider costs");
  assert.equal(bundle.mediaArtifacts[0].storageKey, `projects/${projectId}/take/${takeId}/take_video`, "bundle should map artifact storage keys");
  assert.ok(bundle.renderSourceHash.startsWith("sha256:"), "bundle should include a render source hash");

  const assets = await adapter.listImageAssets(projectId);
  assert.equal(assets.length, 1, "live read adapter should list image assets directly");
  assert.equal(assets[0].id, assetId, "live read adapter should preserve image asset ids");

  const generationJob = await adapter.getJob(genJobId);
  assert.equal(generationJob?.id, genJobId, "live read adapter should read generation jobs by id");
  assert.equal(generationJob && "providerAttempts" in generationJob ? generationJob.providerAttempts[0].requestId : null, "req_live_read", "live generation job reads should attach provider attempts");
  assert.equal(await adapter.getJob("gen_missing"), null, "live read adapter should return null for missing generation jobs");

  const queue = await adapter.getQueueSnapshot();
  assert.equal(queue.summary.total, 1, "live read adapter should build queue snapshots from persisted jobs");
  assert.equal(queue.jobs[0].id, genJobId, "live queue snapshots should preserve generation job ids");
  assert.equal(queue.jobs[0].kind, "generation", "live queue snapshots should preserve job kinds");

  const dispatch = await adapter.getWorkerDispatchSnapshot();
  assert.equal(dispatch.summary.total, 1, "live read adapter should build worker dispatch snapshots from active jobs");
  assert.equal(dispatch.items[0].kind, "provider_generation", "live worker dispatch should preserve generation dispatch kind");
  assert.equal(dispatch.items[0].jobId, genJobId, "live worker dispatch should preserve generation job ids");

  const leases = await adapter.getWorkerLeaseSnapshot();
  assert.equal(leases.summary.active, 1, "live read adapter should build worker lease snapshots from persisted leases");
  assert.equal(leases.leases[0].dispatchKey, `provider_generation:${genJobId}`, "live worker lease snapshots should preserve dispatch keys");

  const completions = await adapter.getWorkerCompletionSnapshot();
  assert.equal(completions.summary.total, 1, "live read adapter should build worker completion snapshots from persisted terminal jobs");
  assert.equal(completions.summary.failed, 1, "live completion snapshots should count failed jobs");
  assert.equal(completions.receipts[0].jobId, genJobId, "live completion snapshots should preserve receipt job ids");
  assert.equal(completions.receipts[0].summary.artifactCount, 1, "live completion snapshots should attach persisted artifacts");
  assert.equal(completions.receipts[0].summary.capturedCredits, 18, "live completion snapshots should attach persisted credit captures");

  const retryPlan = await adapter.getWorkerRetryPlan();
  assert.equal(retryPlan.summary.totalFailed, 1, "live read adapter should build retry plans from failed completion receipts");
  assert.equal(retryPlan.summary.retryable, 1, "live retry plans should count retryable failures");
  assert.equal(retryPlan.items[0].action, "retry_provider_generation", "live retry plans should preserve provider retry actions");

  assert.ok(
    client.queries.some((query) => query.sql.includes("FROM cutpilot_projects p")),
    "adapter should query cutpilot_projects"
  );
  assert.ok(
    client.queries.some((query) => query.sql.includes("FROM cutpilot_provider_attempts")),
    "adapter should query provider attempts"
  );

  console.log("live-persistence-read-adapter.test OK", {
    queries: client.queries.length
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
