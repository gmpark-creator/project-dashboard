export const livePersistenceSchemaVersion = "cutpilot_postgres_v1";

export const livePersistenceTables = [
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
] as const;

export const livePersistenceRequiredIndexes = [
  "cutpilot_projects_updated_at_idx",
  "cutpilot_scenes_project_idx",
  "cutpilot_shots_project_idx",
  "cutpilot_takes_project_shot_idx",
  "cutpilot_generation_jobs_status_due_idx",
  "cutpilot_image_jobs_status_due_idx",
  "cutpilot_render_jobs_status_due_idx",
  "cutpilot_provider_attempts_job_idx",
  "cutpilot_media_artifacts_project_idx",
  "cutpilot_worker_leases_status_expiry_idx",
  "cutpilot_worker_retry_records_project_idx"
] as const;

export type LivePersistenceTable = (typeof livePersistenceTables)[number];

export function isLivePersistenceTable(input: string): input is LivePersistenceTable {
  return (livePersistenceTables as readonly string[]).includes(input);
}
