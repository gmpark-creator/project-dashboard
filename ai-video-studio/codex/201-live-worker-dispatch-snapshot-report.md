# R201 - Live Worker Dispatch Snapshot

## Scope

- Added live worker dispatch snapshot reads for `GET /api/system/worker-dispatch`.
- Added a persisted-job worker dispatch builder path.
- Kept production mock worker dispatch reads fail-closed.

## Behavior

- Default production worker dispatch reads now return `MOCK_READ_UNAVAILABLE` after system access succeeds.
- When `CUTPILOT_ENABLE_LIVE_READS=1`, the worker dispatch route calls `getLiveWorkerDispatchSnapshot()`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Live worker dispatch snapshots read persisted active generation, image, and render jobs from Postgres.
- Live worker dispatch snapshots reuse the existing provider, image, and render invocation builders.
- The existing mock worker dispatch path remains unchanged for local preview.

## Verification

- Extended `scripts/live-persistence-read-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-read-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard route linkage, live read switch handling, live persistence failure handling, production mock read failure, and persisted-job worker dispatch construction.
