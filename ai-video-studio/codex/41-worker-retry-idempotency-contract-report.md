# Codex R41 - Worker retry idempotency contract report

## Why

R40 added a retry execution API, but repeated calls for the same failed source job could create duplicate replacement jobs. Retry execution needs an audit record and idempotent behavior before a scheduler or operator UI can safely call it.

## Implemented

- Added `WorkerRetryRecord`.
- Added `workerRetryRecords` to mock state with normalization/backfill for older persisted state.
- Extended `WorkerRetryExecutionResult` with `retryRecord`.
- Added `already_executed` and `replacement_missing` result reasons.
- Changed `executeWorkerRetry` to return the existing retry record and replacement snapshot when the same source job is retried again.
- Updated the retry execution route to return `200` for idempotent repeat calls and `201` for newly created replacements.
- Extended JSON Schema and OpenAPI.
- Extended `mock-flow.test.ts` to verify repeated retry execution does not create duplicate image jobs or duplicate retry records.

## Notes

- The retry record currently tracks source job, action, replacement job id, replacement kind, and timestamps.
- A missing replacement returns `replacement_missing` so operators can distinguish state corruption from non-retryable failures.
- This is still mock-backed; production storage will need to enforce the same one-record-per-source-job invariant transactionally.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Runtime smoke check: first `POST /api/system/worker-retries/[jobId]/execute` returned `201`, the second returned `200 already_executed` with the same retry record and replacement job.
