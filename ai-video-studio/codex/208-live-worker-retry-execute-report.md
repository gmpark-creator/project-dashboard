# R208 Live Worker Retry Execute

## Scope

- Connected `POST /api/system/worker-retries/[jobId]/execute` to live writes via `executeLiveWorkerRetry`.
- Added live retry execution in `PostgresLivePersistenceWriteAdapter` for image, provider generation, and render retries.
- Persisted `cutpilot_worker_retry_records` after replacement job creation and returned idempotent results for recorded retries.
- Kept production mock mutation fail-closed behavior when live writes are not enabled.
- Updated OpenAPI and contract guards for the live retry execution boundary.

## Verification

- `npm run typecheck`
- `npx tsx scripts/live-persistence-write-adapter.test.ts`
- `npx tsx scripts/live-persistence-runtime.test.ts`
- `npx tsx scripts/production-state-mutation-boundary.test.ts`
- `npm run validate:contracts`

