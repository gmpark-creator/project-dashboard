-- Cutpilot live persistence contract.
-- This file is a schema contract for the first Postgres migration, not an
-- executable migration bundle. Application ids remain text because the current
-- domain model owns stable prefixed ids such as prj_, shot_, gen_, and rnd_.

CREATE TABLE cutpilot_credit_accounts (
  id text PRIMARY KEY,
  balance_credits integer NOT NULL CHECK (balance_credits >= 0),
  spent_credits integer NOT NULL DEFAULT 0 CHECK (spent_credits >= 0),
  reserved_credits integer NOT NULL DEFAULT 0 CHECK (reserved_credits >= 0),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE cutpilot_projects (
  id text PRIMARY KEY,
  credit_account_id text NOT NULL REFERENCES cutpilot_credit_accounts(id),
  title text NOT NULL,
  idea text NOT NULL,
  intent text NOT NULL CHECK (intent IN ('shorts', 'product_ad', 'app_intro', 'real_estate', 'education', 'brand')),
  status text NOT NULL CHECK (status IN ('draft', 'storyboarded', 'generating', 'reviewing', 'edited', 'rendering', 'done', 'failed')),
  aspect text NOT NULL CHECK (aspect IN ('9:16', '16:9', '1:1', '4:5')),
  target_duration_sec integer NOT NULL CHECK (target_duration_sec > 0),
  progress jsonb NOT NULL,
  characters jsonb NOT NULL DEFAULT '[]'::jsonb,
  thumb_url text,
  default_render_job_id text,
  credits jsonb NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE cutpilot_scenes (
  id text PRIMARY KEY,
  project_id text NOT NULL REFERENCES cutpilot_projects(id) ON DELETE CASCADE,
  order_index integer NOT NULL CHECK (order_index >= 0),
  title text NOT NULL,
  setting text NOT NULL,
  time_of_day text NOT NULL,
  UNIQUE (project_id, order_index)
);

CREATE TABLE cutpilot_shots (
  id text PRIMARY KEY,
  project_id text NOT NULL REFERENCES cutpilot_projects(id) ON DELETE CASCADE,
  scene_id text NOT NULL REFERENCES cutpilot_scenes(id) ON DELETE CASCADE,
  order_index integer NOT NULL CHECK (order_index >= 0),
  title text NOT NULL,
  duration_sec integer NOT NULL CHECK (duration_sec > 0),
  saec jsonb NOT NULL,
  requirements jsonb NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'generating', 'reviewing', 'selected', 'failed')),
  selected_take_id text,
  quality_flags jsonb NOT NULL DEFAULT '[]'::jsonb,
  reference_image_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  direction_spec jsonb NOT NULL,
  UNIQUE (project_id, scene_id, order_index)
);

CREATE TABLE cutpilot_takes (
  id text PRIMARY KEY,
  project_id text NOT NULL REFERENCES cutpilot_projects(id) ON DELETE CASCADE,
  shot_id text NOT NULL REFERENCES cutpilot_shots(id) ON DELETE CASCADE,
  label text NOT NULL,
  status text NOT NULL CHECK (status IN ('queued', 'running', 'done', 'failed', 'cancelled')),
  video_url text,
  poster_url text,
  duration_sec integer NOT NULL CHECK (duration_sec > 0),
  tier text NOT NULL CHECK (tier IN ('fast', 'economy', 'final')),
  engine_used text,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  upgrade_source_take_id text REFERENCES cutpilot_takes(id),
  upgrade_mode text CHECK (upgrade_mode IN ('final_regenerate', 'enhance', 'render_upscale')),
  created_at timestamptz NOT NULL
);

ALTER TABLE cutpilot_shots
  ADD CONSTRAINT cutpilot_shots_selected_take_fk
  FOREIGN KEY (selected_take_id) REFERENCES cutpilot_takes(id)
  DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE cutpilot_generation_jobs (
  id text PRIMARY KEY,
  project_id text NOT NULL REFERENCES cutpilot_projects(id) ON DELETE CASCADE,
  shot_id text NOT NULL REFERENCES cutpilot_shots(id) ON DELETE CASCADE,
  take_id text NOT NULL REFERENCES cutpilot_takes(id) ON DELETE CASCADE,
  retry_of_job_id text REFERENCES cutpilot_generation_jobs(id),
  status text NOT NULL CHECK (status IN ('queued', 'running', 'done', 'failed', 'cancelled')),
  progress integer NOT NULL CHECK (progress >= 0 AND progress <= 100),
  eta_sec integer,
  stage text NOT NULL,
  should_fail boolean NOT NULL DEFAULT false,
  due_at bigint NOT NULL,
  error jsonb,
  prompt_package jsonb NOT NULL,
  routing jsonb NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE cutpilot_provider_attempts (
  id text PRIMARY KEY,
  generation_job_id text NOT NULL REFERENCES cutpilot_generation_jobs(id) ON DELETE CASCADE,
  provider text NOT NULL,
  model text NOT NULL,
  request_id text,
  status text NOT NULL CHECK (status IN ('queued', 'submitted', 'polling', 'succeeded', 'failed', 'cancelled')),
  started_at timestamptz NOT NULL,
  completed_at timestamptz,
  latency_ms integer,
  error_code text,
  retryable boolean NOT NULL DEFAULT false,
  fallback_suggested boolean NOT NULL DEFAULT false
);

CREATE TABLE cutpilot_image_assets (
  id text PRIMARY KEY,
  project_id text NOT NULL REFERENCES cutpilot_projects(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind = 'image'),
  role text NOT NULL CHECK (role IN ('product', 'character', 'location', 'style', 'keyframe', 'thumbnail', 'logo', 'background')),
  source text NOT NULL CHECK (source IN ('image_maker', 'upload', 'external')),
  label text NOT NULL,
  prompt text NOT NULL,
  url text NOT NULL,
  thumb_url text NOT NULL,
  aspect text NOT NULL CHECK (aspect IN ('9:16', '16:9', '1:1', '4:5')),
  width integer NOT NULL CHECK (width > 0),
  height integer NOT NULL CHECK (height > 0),
  rights jsonb NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE cutpilot_asset_usages (
  asset_id text NOT NULL REFERENCES cutpilot_image_assets(id) ON DELETE CASCADE,
  project_id text NOT NULL REFERENCES cutpilot_projects(id) ON DELETE CASCADE,
  target text NOT NULL CHECK (target IN ('project', 'shot')),
  target_id text NOT NULL,
  role text NOT NULL,
  mode text NOT NULL,
  created_at timestamptz NOT NULL,
  PRIMARY KEY (asset_id, target, target_id, mode)
);

CREATE TABLE cutpilot_reference_boards (
  project_id text PRIMARY KEY REFERENCES cutpilot_projects(id) ON DELETE CASCADE,
  product_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  character_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  location_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  style_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  keyframes jsonb NOT NULL DEFAULT '[]'::jsonb,
  thumbnails jsonb NOT NULL DEFAULT '[]'::jsonb,
  logos jsonb NOT NULL DEFAULT '[]'::jsonb,
  backgrounds jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL
);

CREATE TABLE cutpilot_image_jobs (
  id text PRIMARY KEY,
  project_id text NOT NULL REFERENCES cutpilot_projects(id) ON DELETE CASCADE,
  retry_of_job_id text REFERENCES cutpilot_image_jobs(id),
  status text NOT NULL CHECK (status IN ('queued', 'running', 'done', 'failed', 'cancelled')),
  progress integer NOT NULL CHECK (progress >= 0 AND progress <= 100),
  eta_sec integer,
  stage text NOT NULL CHECK (stage IN ('queued', 'prompting', 'generating', 'saving', 'done', 'failed')),
  prompt text NOT NULL,
  purpose text NOT NULL,
  role text NOT NULL,
  aspect text NOT NULL CHECK (aspect IN ('9:16', '16:9', '1:1', '4:5')),
  style text NOT NULL,
  count integer NOT NULL CHECK (count > 0),
  variants jsonb NOT NULL DEFAULT '[]'::jsonb,
  due_at bigint NOT NULL,
  error jsonb,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE cutpilot_project_edit_states (
  project_id text PRIMARY KEY REFERENCES cutpilot_projects(id) ON DELETE CASCADE,
  captions jsonb NOT NULL,
  bgm jsonb NOT NULL,
  voiceover jsonb NOT NULL,
  transitions text NOT NULL CHECK (transitions IN ('none', 'soft')),
  commands jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL
);

CREATE TABLE cutpilot_render_jobs (
  id text PRIMARY KEY,
  project_id text NOT NULL REFERENCES cutpilot_projects(id) ON DELETE CASCADE,
  retry_of_job_id text REFERENCES cutpilot_render_jobs(id),
  spec jsonb NOT NULL,
  stage text NOT NULL CHECK (stage IN ('assemble', 'audio_mix', 'caption_burn', 'encode', 'upscale', 'done')),
  progress integer NOT NULL CHECK (progress >= 0 AND progress <= 100),
  status text NOT NULL CHECK (status IN ('queued', 'running', 'done', 'failed', 'cancelled')),
  output_url text,
  share_url text,
  eta_sec integer,
  due_at bigint NOT NULL,
  error jsonb,
  rights_review jsonb NOT NULL,
  render_plan jsonb NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

ALTER TABLE cutpilot_projects
  ADD CONSTRAINT cutpilot_projects_default_render_fk
  FOREIGN KEY (default_render_job_id) REFERENCES cutpilot_render_jobs(id)
  DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE cutpilot_credit_transactions (
  id text PRIMARY KEY,
  project_id text NOT NULL REFERENCES cutpilot_projects(id) ON DELETE CASCADE,
  job_id text,
  kind text NOT NULL CHECK (kind IN ('reserve', 'capture', 'refund')),
  action text NOT NULL CHECK (action IN ('generateImages', 'generateShot', 'upgradeTake', 'startRender')),
  credits integer NOT NULL CHECK (credits >= 0),
  provider_cost_usd numeric(12, 6),
  margin_policy_version text NOT NULL,
  balance_after jsonb NOT NULL,
  note text NOT NULL,
  created_at timestamptz NOT NULL
);

CREATE TABLE cutpilot_media_artifacts (
  id text PRIMARY KEY,
  project_id text NOT NULL REFERENCES cutpilot_projects(id) ON DELETE CASCADE,
  owner_type text NOT NULL CHECK (owner_type IN ('imageAsset', 'take', 'renderJob')),
  owner_id text NOT NULL,
  source_job_id text,
  kind text NOT NULL CHECK (kind IN ('image', 'video', 'audio', 'brand')),
  role text NOT NULL CHECK (role IN ('image_asset', 'image_thumbnail', 'take_video', 'take_poster', 'render_output')),
  url text NOT NULL,
  storage_key text NOT NULL,
  content_type text NOT NULL,
  bytes bigint,
  status text NOT NULL CHECK (status IN ('stored', 'external')),
  created_at timestamptz NOT NULL
);

CREATE TABLE cutpilot_storage_cleanup_records (
  id text PRIMARY KEY,
  artifact_id text NOT NULL REFERENCES cutpilot_media_artifacts(id) ON DELETE CASCADE,
  project_id text NOT NULL REFERENCES cutpilot_projects(id) ON DELETE CASCADE,
  storage_key text NOT NULL,
  action text NOT NULL CHECK (action = 'delete_object'),
  status text NOT NULL CHECK (status = 'deleted'),
  bytes bigint,
  reason text NOT NULL,
  created_at timestamptz NOT NULL
);

CREATE TABLE cutpilot_worker_leases (
  id text PRIMARY KEY,
  token text NOT NULL,
  dispatch_key text NOT NULL UNIQUE,
  kind text NOT NULL CHECK (kind IN ('provider_generation', 'image_generation', 'render')),
  job_id text NOT NULL,
  project_id text NOT NULL REFERENCES cutpilot_projects(id) ON DELETE CASCADE,
  worker_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'released', 'expired')),
  leased_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  released_at timestamptz
);

CREATE TABLE cutpilot_worker_retry_records (
  id text PRIMARY KEY,
  project_id text NOT NULL REFERENCES cutpilot_projects(id) ON DELETE CASCADE,
  source_job_id text NOT NULL,
  action text NOT NULL CHECK (action IN ('retry_provider_generation', 'retry_image_generation', 'retry_render', 'hold')),
  replacement_job_id text NOT NULL,
  replacement_kind text NOT NULL CHECK (replacement_kind IN ('generation', 'image', 'render')),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE INDEX cutpilot_projects_updated_at_idx ON cutpilot_projects(updated_at DESC);
CREATE INDEX cutpilot_scenes_project_idx ON cutpilot_scenes(project_id, order_index);
CREATE INDEX cutpilot_shots_project_idx ON cutpilot_shots(project_id, scene_id, order_index);
CREATE INDEX cutpilot_takes_project_shot_idx ON cutpilot_takes(project_id, shot_id);
CREATE INDEX cutpilot_generation_jobs_status_due_idx ON cutpilot_generation_jobs(status, due_at);
CREATE INDEX cutpilot_image_jobs_status_due_idx ON cutpilot_image_jobs(status, due_at);
CREATE INDEX cutpilot_render_jobs_status_due_idx ON cutpilot_render_jobs(status, due_at);
CREATE INDEX cutpilot_provider_attempts_job_idx ON cutpilot_provider_attempts(generation_job_id);
CREATE INDEX cutpilot_media_artifacts_project_idx ON cutpilot_media_artifacts(project_id, owner_type, owner_id);
CREATE INDEX cutpilot_worker_leases_status_expiry_idx ON cutpilot_worker_leases(status, expires_at);
CREATE INDEX cutpilot_worker_retry_records_project_idx ON cutpilot_worker_retry_records(project_id, source_job_id);
