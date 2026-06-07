import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  livePersistenceRequiredIndexes,
  livePersistenceSchemaVersion,
  livePersistenceTables
} from "../src/server/live-persistence-contract";
import { getRuntimeReadiness } from "../src/server/readiness";

const schemaPath = join(process.cwd(), "..", "codex", "persistence", "postgres-schema.sql");
const schema = readFileSync(schemaPath, "utf8");

assert.equal(livePersistenceSchemaVersion, "cutpilot_postgres_v1", "live persistence schema version should be stable");

for (const table of livePersistenceTables) {
  assert.ok(schema.includes(`CREATE TABLE ${table}`), `SQL schema missing manifest table ${table}`);
}

for (const indexName of livePersistenceRequiredIndexes) {
  assert.ok(schema.includes(`CREATE INDEX ${indexName}`), `SQL schema missing manifest index ${indexName}`);
}

const schemaTables = [...schema.matchAll(/CREATE TABLE (cutpilot_[a-z_]+)/g)].map((match) => match[1]);
assert.deepEqual([...livePersistenceTables].sort(), schemaTables.sort(), "manifest tables should match the SQL schema tables");

const originalRuntimeMode = process.env.CUTPILOT_RUNTIME_MODE;
const originalDatabaseUrl = process.env.DATABASE_URL;
try {
  process.env.CUTPILOT_RUNTIME_MODE = "production";
  process.env.DATABASE_URL = "postgresql://cutpilot:secret@db.internal:5432/cutpilot";
  const readiness = getRuntimeReadiness();
  const persistence = readiness.checks.find((check) => check.id === "persistence");
  assert.ok(persistence?.detail.includes(livePersistenceSchemaVersion), "readiness should name the live persistence schema version");
} finally {
  if (typeof originalRuntimeMode === "undefined") delete process.env.CUTPILOT_RUNTIME_MODE;
  else process.env.CUTPILOT_RUNTIME_MODE = originalRuntimeMode;
  if (typeof originalDatabaseUrl === "undefined") delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = originalDatabaseUrl;
}

console.log("persistence-contract-manifest.test OK", {
  schemaVersion: livePersistenceSchemaVersion,
  tables: livePersistenceTables.length,
  indexes: livePersistenceRequiredIndexes.length
});
