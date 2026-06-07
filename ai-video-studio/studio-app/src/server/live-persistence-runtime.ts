import { Pool } from "pg";
import { PostgresLivePersistenceReadAdapter } from "./live-persistence-read-adapter";

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

function databaseSslConfig() {
  if (process.env.DATABASE_SSL === "1") return { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "0" };
  return undefined;
}

function databaseUrl() {
  return process.env.DATABASE_URL?.trim() || "";
}

export function getLivePersistenceReadAdapter() {
  if (!liveProjectReadsEnabled()) {
    throw new LivePersistenceUnavailableError("Live project reads are disabled. Set CUTPILOT_ENABLE_LIVE_READS=1 after running migrations.");
  }
  const connectionString = databaseUrl();
  if (!connectionString) {
    throw new LivePersistenceUnavailableError("DATABASE_URL is required for live project reads.");
  }
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: databaseSslConfig()
    });
  }
  return new PostgresLivePersistenceReadAdapter(pool);
}

export async function listLiveProjects() {
  return getLivePersistenceReadAdapter().listProjects();
}

export async function getLiveProjectBundle(projectId: string) {
  return getLivePersistenceReadAdapter().getProjectBundle(projectId);
}

export async function closeLivePersistencePoolForTests() {
  const current = pool;
  pool = null;
  if (current) await current.end();
}
