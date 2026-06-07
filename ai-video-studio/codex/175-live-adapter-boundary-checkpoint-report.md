# R175 - Live Adapter Boundary Checkpoint

## Scope

This checkpoint covers Codex R169-R174. The work moved the project from production mock-surface shutdowns into concrete live-adapter contracts for persistence, providers, object storage, and queue workers.

## Completed In This Checkpoint

- R169: Extracted file-backed mock state into a replaceable mock state store port.
- R170: Added the first Postgres schema contract for live persistence.
- R171: Added a runtime live persistence manifest and schema version `cutpilot_postgres_v1`.
- R172: Added provider execution result/error contract version `provider_execution_v1`.
- R173: Added object storage ingest boundary and production fail-closed behavior for missing live ingest/delete adapters.
- R174: Added queue worker message envelope contract version `queue_worker_v1`.

## Guardrails Added

- Persistence cannot collapse into a single `StudioState` blob table.
- SQL schema tables and TypeScript persistence manifest must stay aligned.
- Provider execution results must include stable pending/succeeded/failed shapes and stable unavailable errors.
- Object storage readiness now requires both live ingest and live deletion.
- Queue worker messages now require stable dedupe keys, dispatch identity, priority, due time, and lease timing.

## Verification

- R169 local: `npm run verify`; remote CI success.
- R170 local: `npm run verify`; remote CI success.
- R171 local: `npm run verify`; remote CI success.
- R172 local: `npm run verify`; remote CI success.
- R173 local: `npm run verify`; remote CI success.
- R174 local: `npm run verify`; remote CI success.

## Remaining Codex Work

- Implement actual Postgres adapter and migration runner against `cutpilot_postgres_v1`.
- Implement live queue adapter/worker loop against `queue_worker_v1`.
- Implement provider-specific execution adapters against `provider_execution_v1`.
- Implement live R2/S3-compatible object ingest and deletion.
- Wire public production routes from fail-closed boundaries to live adapters only after the above adapters pass integration tests.

## Claude Handoff

Claude should continue browser UX validation for production unavailable states:

- Public create/read/mutation/work routes must surface `MOCK_*_UNAVAILABLE` without endless loading.
- Readiness UI should clearly distinguish configured env from missing live adapters.
- Admin/worker panels should preserve lease, queue, storage, and provider status clarity when live adapters are unavailable.
