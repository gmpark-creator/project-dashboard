# Codex R42 - Worker retry execution snapshot report

## Why

R41 made retry execution idempotent by recording executed retries. Operations now need a read-only snapshot to inspect those records without triggering another retry attempt.

## Implemented

- Added `WorkerRetryExecutionSnapshotItem`.
- Added `WorkerRetryExecutionSnapshot`.
- Added `getWorkerRetryExecutionSnapshot` in `src/server/worker-retries.ts`.
- Added admin-protected `GET /api/system/worker-retries/executions`.
- Added JSON Schema definitions and OpenAPI operation `getWorkerRetryExecutionSnapshot`.
- Extended `validate-contracts.ts`.
- Extended `mock-flow.test.ts` to verify retry execution records include:
  - the failed source receipt
  - the replacement queue snapshot
  - replacement presence/missing status
  - summary counts for records with replacement jobs

## Access

`GET /api/system/worker-retries/executions` uses the existing production-only system admin guard:

- mock mode: open for local QA
- production mode: requires `CUTPILOT_ADMIN_TOKEN`

## Notes

- This is a read-only operations snapshot.
- Missing replacement jobs are surfaced per record through `replacementMissing`.
- The endpoint is meant for scheduler/operator audit UI; retry creation remains on `POST /api/system/worker-retries/[jobId]/execute`.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Runtime smoke check: `GET /api/system/worker-retries/executions` returned retry execution records with replacement snapshots and `missingReplacement=0`.
