# Codex R37 - Worker lease renewal contract report

## Why

R36 added mock worker leases with TTL and release. Long provider generation or render jobs also need a renewal boundary so an active worker can extend a lease before it expires.

This round adds worker lease renewal.

## Implemented

- Added `WorkerLeaseRenewResult` domain type.
- Added `renewWorkerLease()` to `src/server/worker-leases.ts`.
- Added admin-protected `POST /api/system/worker-leases/{leaseId}/renew`.
- Added JSON Schema definition and root schema property for renewal results.
- Added `renewWorkerLease` to OpenAPI.
- Extended `validate-contracts.ts` to require the new definition and operation.
- Extended `mock-flow.test.ts` to verify:
  - renewal rejects token mismatch
  - renewal succeeds with a matching token
  - renewal returns the renewed lease
  - renewal extends `expiresAt`
  - release still works after renewal

## Renewal semantics

- Renewal requires the opaque lease token.
- Only active leases can be renewed.
- TTL is clamped between 5 and 600 seconds, matching lease creation.
- Expired leases are marked before renewal attempts, so stale leases cannot be revived.

## Access

`POST /api/system/worker-leases/{leaseId}/renew` uses the existing production-only system admin guard:

- mock mode: open for local QA
- production mode: requires `CUTPILOT_ADMIN_TOKEN`

## Notes

- This is still a mock queue contract.
- It gives a future queue implementation the full lifecycle shape: create lease, renew lease, release lease, then reconcile completion separately.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Runtime smoke check: worker lease endpoint created, renewed, and released a lease on the dev server.
