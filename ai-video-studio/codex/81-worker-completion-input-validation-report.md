# Codex R81 - Worker completion input validation report

## Why

`POST /api/system/worker-leases/{leaseId}/complete` accepted a cast request body. Missing tokens, unsupported statuses, or malformed error/output objects could reach worker completion logic instead of returning a request validation response.

## Implemented

- Added `isWorkerLeaseCompletionInput()` for completion body shape validation.
- Requires `token` as a string and `status` as `succeeded` or `failed`.
- Validates optional `requireOutputs`, `error`, `outputs`, and image variant output fields.
- Keeps existing output URL/storage-key policy in `completeWorkerLease()` as the 422 `invalid_outputs` path.
- Documents the route's 400 `ErrorResponse`.

## Notes

- Valid worker completion behavior is unchanged.
- System access checks still run before request validation.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP smoke for missing completion token returning 400 with a full `ErrorResponse`.
- HTTP smoke for unsupported completion status returning 400 with a full `ErrorResponse`.
- HTTP smoke for malformed completion outputs returning 400 with a full `ErrorResponse`.
