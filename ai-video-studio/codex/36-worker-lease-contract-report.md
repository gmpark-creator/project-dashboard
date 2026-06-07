# Codex R36 - Worker lease contract report

## Why

Worker dispatch exposes active work units, but a real worker system also needs a lease boundary so two workers do not pick the same item at the same time. Previous rounds were read-only; this round adds the first mock lease mutation contract.

This does not implement a real external queue. It defines and verifies the lease semantics that a real queue can replace later.

## Implemented

- Added `WorkerLeaseStatus`, `WorkerLease`, `WorkerLeaseRequest`, `WorkerLeaseResult`, `WorkerLeaseReleaseResult`, and `WorkerLeaseSnapshot` domain types.
- Added `StudioState.workerLeases` with normalize/backfill defaults.
- Added internal mock state read/write helpers for server-side lease mutation.
- Added `src/server/worker-leases.ts`.
- Added admin-protected:
  - `GET /api/system/worker-leases`
  - `POST /api/system/worker-leases`
  - `POST /api/system/worker-leases/{leaseId}/release`
- Added JSON Schema definitions and root schema property for worker leases.
- Added OpenAPI operations:
  - `getWorkerLeaseSnapshot`
  - `createWorkerLease`
  - `releaseWorkerLease`
- Extended `validate-contracts.ts` to require the new definitions and operations.
- Extended `mock-flow.test.ts` to verify:
  - fresh mock state starts with no leases
  - active Image Maker work can be leased by kind
  - an active lease blocks duplicate leasing of the same dispatch item
  - release rejects token mismatch
  - release succeeds with a matching token
  - provider generation work can be leased and released
  - completed mock flow leaves no active leases while retaining release history

## Lease semantics

- Lease creation selects the next due dispatch item from `WorkerDispatchSnapshot`.
- Active leases exclude their dispatch key from future lease attempts.
- Leases carry an opaque token required for release.
- TTL is clamped between 5 and 600 seconds.
- Expired active leases are marked `expired` when snapshots or new lease operations run.

## Access

Worker lease endpoints use the existing production-only system admin guard:

- mock mode: open for local QA
- production mode: requires `CUTPILOT_ADMIN_TOKEN`

## Notes

- This is a mock queue contract, not a production queue implementation.
- Job completion remains separate and is covered by the worker completion receipt contract.
- A future external queue can preserve this lease shape while replacing in-memory `StudioState.workerLeases`.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Runtime smoke check: worker lease endpoints created and released a lease on the dev server.
