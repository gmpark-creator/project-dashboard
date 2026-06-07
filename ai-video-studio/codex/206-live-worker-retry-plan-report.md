# R206 - Live Worker Retry Plan

## Scope

- Added live worker retry plan reads for `GET /api/system/worker-retries`.
- Built live retry plans from persisted worker completion receipts.
- Kept production mock retry plan reads fail-closed unless live reads are enabled.

## Behavior

- When `CUTPILOT_ENABLE_LIVE_READS=1`, the route calls `getLiveWorkerRetryPlan()`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Default production retry plan reads now return `MOCK_READ_UNAVAILABLE` after system access succeeds.
- Live retry plans reuse the existing retry classifier for failed worker completion receipts.

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
