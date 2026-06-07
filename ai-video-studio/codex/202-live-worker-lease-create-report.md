# R202 - Live Worker Lease Create

## Scope

- Added live worker lease snapshots for `GET /api/system/worker-leases`.
- Added live worker lease creation for `POST /api/system/worker-leases`.
- Kept production mock worker lease reads and writes fail-closed.

## Behavior

- Default production worker lease reads now return `MOCK_READ_UNAVAILABLE` after system access succeeds.
- Default production worker lease creation now returns `MOCK_MUTATION_UNAVAILABLE` after system access succeeds.
- When `CUTPILOT_ENABLE_LIVE_READS=1`, the route calls `getLiveWorkerLeaseSnapshot()`.
- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, the route calls `createLiveWorkerLease(...)`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Live lease creation expires stale active leases, skips dispatch keys with active leases, and inserts a new `cutpilot_worker_leases` row for the first matching dispatch item.
- The existing mock worker lease path remains unchanged for local preview.

## Verification

- Extended `scripts/live-persistence-read-adapter.test.ts`.
- Extended `scripts/live-persistence-write-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-read-boundary.test.ts`.
- Updated `scripts/api-worker-storage-policy.test.ts` to keep production mock lease creation fail-closed while still verifying production completion storage-key policy.
- Updated `npm run validate:contracts` to guard route linkage, live read/write switch handling, live persistence failure handling, production mock read/write failure, and persisted lease creation.
- Passed `npm run verify`.
