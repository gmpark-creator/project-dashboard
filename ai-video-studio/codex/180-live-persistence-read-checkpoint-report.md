# R180 - Live Persistence Read Checkpoint

## Scope

This checkpoint covers Codex R176-R179. The work moved live persistence from schema-only contracts into a runnable migration path and the first switch-gated production read surfaces.

## Completed In This Checkpoint

- R176: Added Postgres migration runner for `cutpilot_postgres_v1`.
- R177: Added Postgres read adapter for project list and project bundle reads.
- R178: Added live read runtime switch and connected project list/bundle routes.
- R179: Added live asset list reads and connected `GET /projects/{projectId}/assets`.

## Production Behavior

- Default production reads still fail closed before touching mock state.
- `CUTPILOT_ENABLE_LIVE_READS=1` enables live reads for:
  - `GET /projects`
  - `GET /projects/{projectId}`
  - `GET /projects/{projectId}/assets`
- Live reads require `DATABASE_URL`.
- Missing live persistence returns `LIVE_PERSISTENCE_UNAVAILABLE`.

## Verification

- R176 local: `npm run verify`; remote CI success.
- R177 local: `npm run verify`; remote CI success.
- R178 local: `npm run verify`; remote CI success.
- R179 local: `npm run verify`; remote CI success.

## Remaining Codex Work

- Wire live job reads and render preview preflight.
- Implement live mutation/write adapter for project creation, storyboard edits, asset registration, generation requests, and render requests.
- Implement queue worker adapter and live worker loop.
- Implement provider-specific adapters and object storage ingest/delete.
- Add integration tests against a real migrated Postgres instance when a database is available.

## Claude Handoff

Claude should validate browser UX for:

- Default production read unavailable states.
- `LIVE_PERSISTENCE_UNAVAILABLE` messaging when live reads are switched on without `DATABASE_URL`.
- Project list, project detail, and asset library loading states once live read QA data is available.
