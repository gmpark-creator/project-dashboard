# Codex R99 - Result-shaped error schema report

## Why

Some failure statuses do not return `ErrorResponse`; they return the route's result object with `reason` fields. OpenAPI documented their status codes but omitted JSON schemas for those 404/409 responses.

## Implemented

- Added result schemas for:
  - `cancelJob` 404/409 -> `CancelJobResult`
  - `releaseWorkerLease` 404/409 -> `WorkerLeaseReleaseResult`
  - `renewWorkerLease` 404/409 -> `WorkerLeaseRenewResult`
  - `completeWorkerLease` 404/409 -> `WorkerLeaseCompletionResult`
  - `executeWorkerRetry` 404/409 -> `WorkerRetryExecutionResult`
- Extended `validate-contracts.ts` to enforce these result-shaped error response schemas.

## Notes

- Runtime behavior is unchanged.
- `ErrorResponse`-based failures remain documented separately.

## Verification

- `npm run verify`
- Direct OpenAPI scan for 404/409 result-shaped responses without schemas.
- `git diff --check`
