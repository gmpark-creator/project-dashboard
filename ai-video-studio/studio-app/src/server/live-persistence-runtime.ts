import { Pool, type PoolClient } from "pg";
import { PostgresLivePersistenceReadAdapter } from "./live-persistence-read-adapter";
import {
  PostgresLivePersistenceWriteAdapter,
  type LiveEditAudioPatch,
  type LiveExternalImageInput,
  type LiveShotReferenceInput
} from "./live-persistence-write-adapter";
import { buildLiveRenderPreview } from "./live-render-preview";
import type { DirectionSpec, ExportSpec } from "../domain/types";
import type { LiveProjectCreateInput } from "./live-project-builder";

let pool: Pool | null = null;

export class LivePersistenceUnavailableError extends Error {
  code = "LIVE_PERSISTENCE_UNAVAILABLE" as const;

  constructor(message: string) {
    super(message);
    this.name = "LivePersistenceUnavailableError";
  }
}

export function liveProjectReadsEnabled() {
  return process.env.CUTPILOT_ENABLE_LIVE_READS === "1";
}

export function liveProjectWritesEnabled() {
  return process.env.CUTPILOT_ENABLE_LIVE_WRITES === "1";
}

function databaseSslConfig() {
  if (process.env.DATABASE_SSL === "1") return { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "0" };
  return undefined;
}

function databaseUrl() {
  return process.env.DATABASE_URL?.trim() || "";
}

function getConfiguredPool() {
  const connectionString = databaseUrl();
  if (!connectionString) {
    throw new LivePersistenceUnavailableError("DATABASE_URL is required for live persistence.");
  }
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: databaseSslConfig()
    });
  }
  return pool;
}

export function getLivePersistenceReadAdapter() {
  if (!liveProjectReadsEnabled()) {
    throw new LivePersistenceUnavailableError("Live project reads are disabled. Set CUTPILOT_ENABLE_LIVE_READS=1 after running migrations.");
  }
  const pool = getConfiguredPool();
  return new PostgresLivePersistenceReadAdapter(pool);
}

async function withLivePersistenceClient<T>(callback: (client: PoolClient) => Promise<T>) {
  const client = await getConfiguredPool().connect();
  try {
    return await callback(client);
  } finally {
    client.release();
  }
}

export async function listLiveProjects() {
  return getLivePersistenceReadAdapter().listProjects();
}

export async function getLiveProjectBundle(projectId: string) {
  return getLivePersistenceReadAdapter().getProjectBundle(projectId);
}

export async function listLiveImageAssets(projectId: string) {
  return getLivePersistenceReadAdapter().listImageAssets(projectId);
}

export async function getLiveJob(jobId: string) {
  return getLivePersistenceReadAdapter().getJob(jobId);
}

export async function previewLiveRender(projectId: string, spec: ExportSpec) {
  const bundle = await getLivePersistenceReadAdapter().getProjectBundle(projectId);
  return bundle ? buildLiveRenderPreview(bundle, spec) : null;
}

export async function createLiveProject(input: LiveProjectCreateInput) {
  if (!liveProjectWritesEnabled()) {
    throw new LivePersistenceUnavailableError("Live project writes are disabled. Set CUTPILOT_ENABLE_LIVE_WRITES=1 after running migrations.");
  }
  return withLivePersistenceClient((client) => new PostgresLivePersistenceWriteAdapter(client).createProject(input));
}

export async function updateLiveShotDirection(shotId: string, patch: Partial<DirectionSpec>) {
  if (!liveProjectWritesEnabled()) {
    throw new LivePersistenceUnavailableError("Live project writes are disabled. Set CUTPILOT_ENABLE_LIVE_WRITES=1 after running migrations.");
  }
  return withLivePersistenceClient((client) => new PostgresLivePersistenceWriteAdapter(client).updateShotDirection(shotId, patch));
}

export async function selectLiveTake(shotId: string, takeId: string) {
  if (!liveProjectWritesEnabled()) {
    throw new LivePersistenceUnavailableError("Live project writes are disabled. Set CUTPILOT_ENABLE_LIVE_WRITES=1 after running migrations.");
  }
  return withLivePersistenceClient((client) => new PostgresLivePersistenceWriteAdapter(client).selectTake(shotId, takeId));
}

export async function applyLiveEdit(projectId: string, command?: string) {
  if (!liveProjectWritesEnabled()) {
    throw new LivePersistenceUnavailableError("Live project writes are disabled. Set CUTPILOT_ENABLE_LIVE_WRITES=1 after running migrations.");
  }
  return withLivePersistenceClient((client) => new PostgresLivePersistenceWriteAdapter(client).applyEdit(projectId, command));
}

export async function setLiveAudio(projectId: string, patch: LiveEditAudioPatch) {
  if (!liveProjectWritesEnabled()) {
    throw new LivePersistenceUnavailableError("Live project writes are disabled. Set CUTPILOT_ENABLE_LIVE_WRITES=1 after running migrations.");
  }
  return withLivePersistenceClient((client) => new PostgresLivePersistenceWriteAdapter(client).setAudio(projectId, patch));
}

export async function setLiveDefaultRender(projectId: string, renderJobId: string) {
  if (!liveProjectWritesEnabled()) {
    throw new LivePersistenceUnavailableError("Live project writes are disabled. Set CUTPILOT_ENABLE_LIVE_WRITES=1 after running migrations.");
  }
  return withLivePersistenceClient((client) => new PostgresLivePersistenceWriteAdapter(client).setDefaultRender(projectId, renderJobId));
}

export async function registerLiveExternalImage(input: LiveExternalImageInput) {
  if (!liveProjectWritesEnabled()) {
    throw new LivePersistenceUnavailableError("Live project writes are disabled. Set CUTPILOT_ENABLE_LIVE_WRITES=1 after running migrations.");
  }
  return withLivePersistenceClient((client) => new PostgresLivePersistenceWriteAdapter(client).registerExternalImage(input));
}

export async function attachLiveImageToShot(shotId: string, input: LiveShotReferenceInput) {
  if (!liveProjectWritesEnabled()) {
    throw new LivePersistenceUnavailableError("Live project writes are disabled. Set CUTPILOT_ENABLE_LIVE_WRITES=1 after running migrations.");
  }
  return withLivePersistenceClient((client) => new PostgresLivePersistenceWriteAdapter(client).attachImageToShot(shotId, input));
}

export async function detachLiveImageFromShot(shotId: string, assetId: string) {
  if (!liveProjectWritesEnabled()) {
    throw new LivePersistenceUnavailableError("Live project writes are disabled. Set CUTPILOT_ENABLE_LIVE_WRITES=1 after running migrations.");
  }
  return withLivePersistenceClient((client) => new PostgresLivePersistenceWriteAdapter(client).detachImageFromShot(shotId, assetId));
}

export async function closeLivePersistencePoolForTests() {
  const current = pool;
  pool = null;
  if (current) await current.end();
}
