import assert from "node:assert/strict";
import { buildLiveProjectCreateRecords } from "../src/server/live-project-builder";
import { PostgresLivePersistenceWriteAdapter } from "../src/server/live-persistence-write-adapter";
import type { PgQueryable } from "../src/server/live-persistence-migrations";

class FakeClient implements PgQueryable {
  queries: Array<{ sql: string; params?: unknown[] }> = [];
  failOnShotInsert = false;

  async query<T extends Record<string, unknown> = Record<string, unknown>>(sql: string, params?: unknown[]) {
    this.queries.push({ sql, params });
    if (this.failOnShotInsert && sql.includes("INSERT INTO cutpilot_shots")) throw new Error("shot insert failed");
    return { rows: [] as T[] };
  }
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

  console.log("live-persistence-write-adapter.test OK", {
    insertStatements: client.queries.filter((query) => query.sql.includes("INSERT INTO")).length
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
