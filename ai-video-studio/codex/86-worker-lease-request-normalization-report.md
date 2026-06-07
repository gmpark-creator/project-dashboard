# Codex R86 - Worker lease request normalization report

## Why

`POST /api/system/worker-leases` validated individual fields but then passed the original JSON object to `createWorkerLease()` through a cast. That let unrelated request properties cross the API boundary even though the service only needs `workerId`, `kind`, and `ttlSec`.

## Implemented

- Builds an explicit `Partial<WorkerLeaseRequest>` after validation.
- Passes only `workerId`, `kind`, and `ttlSec` into `createWorkerLease()`.
- Preserves existing defaults for blank or omitted request bodies.

## Notes

- No OpenAPI contract change was required.
- Invalid field values still return the existing 400 `ErrorResponse`.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm audit --omit=dev`
- `npm run build`
- HTTP smoke for an extra worker lease request property being ignored.
- `git diff --check`
