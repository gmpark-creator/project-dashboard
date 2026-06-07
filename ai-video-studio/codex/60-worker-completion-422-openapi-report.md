# Codex R60 - Worker completion 422 OpenAPI report

## Why

Worker lease completion returns HTTP 422 when successful completion outputs are missing, malformed, or storage-key mismatched. The route behavior existed, but the OpenAPI operation still documented only 200, 404, 409, 401, and 503. Worker clients need the 422 contract to distinguish invalid completion payloads from lease conflicts.

## Implemented

- Added HTTP 422 to `completeWorkerLease` in OpenAPI.
- Reused `WorkerLeaseCompletionResult` for the 422 response body.
- Documented that 422 covers:
  - missing required outputs
  - malformed output URLs
  - output storage-key mismatches

## Notes

- No runtime behavior changed in this round.
- This follows R46/R50/R59 behavior and aligns the API contract with the route status mapping.

## Verification

- `npm run validate:contracts`
- `npm run build`
- `npm run typecheck`
- `npm run test:mock`
- `npm audit --omit=dev`
- Direct OpenAPI JSON smoke confirming `completeWorkerLease` exposes a 422 response with `WorkerLeaseCompletionResult`.
