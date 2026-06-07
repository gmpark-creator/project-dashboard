import assert from "node:assert/strict";
import {
  applyLivePersistenceMigration,
  buildLivePersistenceMigrationPlan,
  migrationTableName,
  migrationTableSql,
  splitSqlStatements,
  type PgQueryable
} from "../src/server/live-persistence-migrations";
import { livePersistenceSchemaVersion } from "../src/server/live-persistence-contract";

class FakeClient implements PgQueryable {
  queries: Array<{ sql: string; params?: unknown[] }> = [];
  existingChecksum: string | null = null;

  async query<T extends Record<string, unknown> = Record<string, unknown>>(sql: string, params?: unknown[]) {
    this.queries.push({ sql, params });
    if (sql.startsWith(`SELECT checksum FROM ${migrationTableName}`)) {
      return { rows: this.existingChecksum ? [{ checksum: this.existingChecksum } as unknown as T] : [] };
    }
    return { rows: [] as T[] };
  }
}

async function main() {
  const quotedSql = "CREATE TABLE example (value text DEFAULT 'a;b');\n-- comment; stays ignored\nCREATE INDEX example_idx ON example(value);";
  const quotedStatements = splitSqlStatements(quotedSql);
  assert.equal(quotedStatements.length, 2, "SQL splitting should ignore semicolons inside string literals and comments");

  const plan = buildLivePersistenceMigrationPlan();
  assert.equal(plan.version, livePersistenceSchemaVersion, "migration plan should use the live persistence schema version");
  assert.equal(plan.checksum.length, 64, "migration checksum should be a sha256 hex digest");
  assert.ok(plan.statements.length > 10, "migration plan should include the full schema statement set");
  assert.ok(plan.statements.some((statement) => statement.includes("CREATE TABLE cutpilot_projects")), "migration plan should create projects");
  assert.ok(plan.statements.some((statement) => statement.includes("CREATE INDEX cutpilot_worker_leases_status_expiry_idx")), "migration plan should create worker lease indexes");
  assert.ok(migrationTableSql.includes("CREATE TABLE IF NOT EXISTS cutpilot_schema_migrations"), "runner should bootstrap schema migration records");

  const firstApply = new FakeClient();
  const firstResult = await applyLivePersistenceMigration(firstApply, plan);
  assert.equal(firstResult.applied, true, "first migration run should apply the schema");
  assert.equal(firstApply.queries[0].sql, "BEGIN", "migration should start a transaction");
  assert.ok(firstApply.queries.some((query) => query.sql.includes("INSERT INTO cutpilot_schema_migrations")), "migration should record the applied checksum");
  assert.equal(firstApply.queries.at(-1)?.sql, "COMMIT", "successful migration should commit");

  const alreadyApplied = new FakeClient();
  alreadyApplied.existingChecksum = plan.checksum;
  const alreadyResult = await applyLivePersistenceMigration(alreadyApplied, plan);
  assert.equal(alreadyResult.applied, false, "matching existing migration should not replay schema statements");
  assert.equal(
    alreadyApplied.queries.some((query) => query.sql.includes("CREATE TABLE cutpilot_projects")),
    false,
    "matching existing migration should skip schema statements"
  );
  assert.equal(alreadyApplied.queries.at(-1)?.sql, "COMMIT", "matching existing migration should commit");

  const mismatch = new FakeClient();
  mismatch.existingChecksum = "0".repeat(64);
  await assert.rejects(
    () => applyLivePersistenceMigration(mismatch, plan),
    /different checksum/,
    "mismatched existing migration checksum should fail"
  );
  assert.equal(mismatch.queries.at(-1)?.sql, "ROLLBACK", "checksum mismatch should roll back");

  console.log("persistence-migration-runner.test OK", {
    statements: plan.statements.length
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
