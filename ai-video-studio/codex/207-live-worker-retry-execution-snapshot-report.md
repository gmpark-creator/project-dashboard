# R207 - Live Worker Retry Execution Snapshot

## Scope

- Added live worker retry execution snapshots for `GET /api/system/worker-retries/executions`.
- Split retry execution snapshot building so persisted retry records can use the same replacement/source receipt resolver as mock state.
- Kept production mock retry execution reads fail-closed unless live reads are enabled.

## Behavior

- When `CUTPILOT_ENABLE_LIVE_READS=1`, the route calls `getLiveWorkerRetryExecutionSnapshot()`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Default production retry execution reads now return `MOCK_READ_UNAVAILABLE` after system access succeeds.
- Live execution snapshots resolve persisted `cutpilot_worker_retry_records` against persisted completion receipts and replacement jobs.

## Verification

- Extended `scripts/live-persistence-read-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-read-boundary.test.ts`.
- Updated `npm run validate:contracts` guards for route linkage, live runtime export, live persistence failure handling, and production mock read failure.
- Passed `npm run typecheck`.
- Passed `npx tsx scripts/live-persistence-read-adapter.test.ts`.
- Passed `npx tsx scripts/live-persistence-runtime.test.ts`.
- Passed `npx tsx scripts/production-read-boundary.test.ts`.
- Passed `npm run validate:contracts`.
