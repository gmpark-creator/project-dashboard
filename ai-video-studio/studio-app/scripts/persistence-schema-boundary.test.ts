import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const schemaPath = join(process.cwd(), "..", "codex", "persistence", "postgres-schema.sql");
const schema = readFileSync(schemaPath, "utf8");

const requiredTables = [
  "cutpilot_credit_accounts",
  "cutpilot_projects",
  "cutpilot_scenes",
  "cutpilot_shots",
  "cutpilot_takes",
  "cutpilot_generation_jobs",
  "cutpilot_provider_attempts",
  "cutpilot_image_assets",
  "cutpilot_asset_usages",
  "cutpilot_reference_boards",
  "cutpilot_image_jobs",
  "cutpilot_project_edit_states",
  "cutpilot_render_jobs",
  "cutpilot_credit_transactions",
  "cutpilot_media_artifacts",
  "cutpilot_storage_cleanup_records",
  "cutpilot_worker_leases",
  "cutpilot_worker_retry_records"
];

function tableBlock(table: string) {
  const match = new RegExp(`CREATE TABLE ${table} \\([\\s\\S]*?\\n\\);`).exec(schema);
  assert.ok(match, `schema missing table ${table}`);
  return match[0];
}

for (const table of requiredTables) {
  tableBlock(table);
}

assert.equal(schema.includes("CREATE TABLE cutpilot_studio_state"), false, "live persistence must not be a single StudioState blob table");
assert.equal(schema.includes("cutpilot_mock"), false, "live persistence schema must not include mock-specific tables");

for (const table of requiredTables.filter((table) => table !== "cutpilot_credit_accounts" && table !== "cutpilot_projects")) {
  assert.ok(
    tableBlock(table).includes("project_id text") || tableBlock(table).includes("generation_job_id text"),
    `${table} should be anchored to a project or owning job`
  );
}

assert.ok(tableBlock("cutpilot_projects").includes("status text NOT NULL CHECK"), "projects should preserve the domain status enum");
assert.ok(tableBlock("cutpilot_shots").includes("saec jsonb NOT NULL"), "shots should persist SAEC prompt structure");
assert.ok(tableBlock("cutpilot_shots").includes("direction_spec jsonb NOT NULL"), "shots should persist direction specs");
assert.ok(tableBlock("cutpilot_generation_jobs").includes("prompt_package jsonb NOT NULL"), "generation jobs should persist provider prompt packages");
assert.ok(tableBlock("cutpilot_generation_jobs").includes("routing jsonb NOT NULL"), "generation jobs should persist routing decisions");
assert.ok(tableBlock("cutpilot_render_jobs").includes("render_plan jsonb NOT NULL"), "render jobs should persist render plans");
assert.ok(tableBlock("cutpilot_credit_transactions").includes("provider_cost_usd numeric"), "credit transactions should persist provider cost");
assert.ok(tableBlock("cutpilot_media_artifacts").includes("storage_key text NOT NULL"), "media artifacts should persist storage keys");
assert.ok(schema.includes("DEFERRABLE INITIALLY DEFERRED"), "schema should allow selected/default references that are resolved after dependent rows");
assert.ok(schema.includes("cutpilot_generation_jobs_status_due_idx"), "schema should index due generation jobs for workers");
assert.ok(schema.includes("cutpilot_worker_leases_status_expiry_idx"), "schema should index active worker leases by expiry");

console.log("persistence-schema-boundary.test OK", {
  tables: requiredTables.length
});
