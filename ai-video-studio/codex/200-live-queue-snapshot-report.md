# R200 - Live Queue Snapshot

## Scope

- Added live queue snapshot reads for `GET /api/system/queue`.
- Added a persisted-job queue snapshot builder path.
- Kept production mock queue reads fail-closed.

## Behavior

- Default production system queue reads now return `MOCK_READ_UNAVAILABLE` after system access succeeds.
- When `CUTPILOT_ENABLE_LIVE_READS=1`, the system queue route calls `getLiveQueueSnapshot()`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Live queue snapshots read persisted generation, image, and render jobs from Postgres.
- The existing mock queue snapshot path remains unchanged for local preview.

## Verification

- Extended `scripts/live-persistence-read-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-read-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard route linkage, live read switch handling, live persistence failure handling, production mock read failure, and persisted-job queue snapshot construction.
