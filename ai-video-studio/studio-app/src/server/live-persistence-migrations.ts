import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { livePersistenceSchemaVersion } from "./live-persistence-contract";

export const migrationTableName = "cutpilot_schema_migrations";

export type PgQueryable = {
  query<T extends Record<string, unknown> = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<{ rows: T[] }>;
};

export type LivePersistenceMigrationPlan = {
  version: typeof livePersistenceSchemaVersion;
  checksum: string;
  statements: string[];
};

export type LivePersistenceMigrationResult = {
  version: typeof livePersistenceSchemaVersion;
  checksum: string;
  statementCount: number;
  applied: boolean;
  reason: "applied" | "already_applied";
};

export const migrationTableSql = `
CREATE TABLE IF NOT EXISTS ${migrationTableName} (
  version text PRIMARY KEY,
  checksum text NOT NULL,
  statement_count integer NOT NULL CHECK (statement_count > 0),
  applied_at timestamptz NOT NULL DEFAULT now()
)
`.trim();

export function livePersistenceSchemaPath() {
  return join(process.cwd(), "..", "codex", "persistence", "postgres-schema.sql");
}

export function readLivePersistenceSchemaSql() {
  return readFileSync(livePersistenceSchemaPath(), "utf8");
}

function normalizedSql(input: string) {
  return input.replace(/\r\n/g, "\n").trim();
}

export function livePersistenceSchemaChecksum(sql: string) {
  return createHash("sha256").update(normalizedSql(sql)).digest("hex");
}

export function splitSqlStatements(sql: string) {
  const statements: string[] = [];
  let current = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inLineComment = false;

  for (let index = 0; index < sql.length; index += 1) {
    const char = sql[index];
    const next = sql[index + 1];

    if (inLineComment) {
      current += char;
      if (char === "\n") inLineComment = false;
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && char === "-" && next === "-") {
      current += char;
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && sql[index - 1] === "-" && char === "-") {
      current += char;
      inLineComment = true;
      continue;
    }

    if (!inDoubleQuote && char === "'") {
      current += char;
      if (inSingleQuote && next === "'") {
        current += next;
        index += 1;
        continue;
      }
      inSingleQuote = !inSingleQuote;
      continue;
    }

    if (!inSingleQuote && char === '"') {
      current += char;
      inDoubleQuote = !inDoubleQuote;
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && char === ";") {
      const statement = current.trim();
      if (statement) statements.push(statement);
      current = "";
      continue;
    }

    current += char;
  }

  const tail = current.trim();
  if (tail) statements.push(tail);
  return statements;
}

export function buildLivePersistenceMigrationPlan(sql = readLivePersistenceSchemaSql()): LivePersistenceMigrationPlan {
  const statements = splitSqlStatements(sql);
  if (!statements.length) throw new Error("Live persistence schema has no SQL statements.");
  return {
    version: livePersistenceSchemaVersion,
    checksum: livePersistenceSchemaChecksum(sql),
    statements
  };
}

export async function applyLivePersistenceMigration(client: PgQueryable, plan = buildLivePersistenceMigrationPlan()): Promise<LivePersistenceMigrationResult> {
  await client.query("BEGIN");
  try {
    await client.query(migrationTableSql);
    const existing = await client.query<{ checksum: string }>(`SELECT checksum FROM ${migrationTableName} WHERE version = $1 FOR UPDATE`, [plan.version]);
    const current = existing.rows[0];
    if (current) {
      if (current.checksum !== plan.checksum) {
        throw new Error(`Migration ${plan.version} was already applied with a different checksum.`);
      }
      await client.query("COMMIT");
      return {
        version: plan.version,
        checksum: plan.checksum,
        statementCount: plan.statements.length,
        applied: false,
        reason: "already_applied"
      };
    }

    for (const statement of plan.statements) {
      await client.query(statement);
    }
    await client.query(`INSERT INTO ${migrationTableName} (version, checksum, statement_count) VALUES ($1, $2, $3)`, [
      plan.version,
      plan.checksum,
      plan.statements.length
    ]);
    await client.query("COMMIT");
    return {
      version: plan.version,
      checksum: plan.checksum,
      statementCount: plan.statements.length,
      applied: true,
      reason: "applied"
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}
