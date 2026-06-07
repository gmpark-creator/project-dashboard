# Codex R38 - Worker lease completion contract report

## Why

Worker leases can now be created, renewed, and released, but the mock worker lifecycle still lacked the write boundary that turns leased work into a terminal job result. A production queue needs this boundary to reconcile worker output with job state, artifacts, credit capture/refund, and completion receipts.

This round adds leased worker completion.

## Implemented

- Added `WorkerLeaseCompletionInput` and `WorkerLeaseCompletionResult` domain types.
- Added `completeLeasedWorkerJob()` to `mock-service`.
- Added `completeWorkerLease()` to `worker-leases`.
- Added admin-protected `POST /api/system/worker-leases/{leaseId}/complete`.
- Added JSON Schema definitions and root schema property for worker lease completion.
- Added `completeWorkerLease` to OpenAPI.
- Extended `validate-contracts.ts` to require the new definitions and operation.
- Extended `mock-flow.test.ts` to verify:
  - completion rejects token mismatch
  - completion succeeds for an active leased Image Maker job
  - completion releases the lease
  - completion returns an image completion receipt
  - generated image and thumbnail artifacts are reconciled into the receipt
  - image generation credits are captured
  - a released lease cannot be completed again

## Completion semantics

- Completion requires the opaque lease token.
- Only active leases can complete work.
- Supported completion statuses are `succeeded` and `failed`.
- Successful image jobs create image assets and image/thumbnail artifacts.
- Successful provider generation jobs complete the take, provider attempt, artifacts, and credit capture.
- Successful render jobs create render output/share URLs, artifact records, and credit capture.
- Failed jobs preserve normalized errors and refund reserved credits.
- Accepted completion releases the lease; terminal receipts are derived from the updated job/artifact/ledger state.

## Access

`POST /api/system/worker-leases/{leaseId}/complete` uses the existing production-only system admin guard:

- mock mode: open for local QA
- production mode: requires `CUTPILOT_ADMIN_TOKEN`

## Notes

- This is still a mock queue/worker contract.
- It provides the write-side counterpart to R33 completion receipts.
- A production worker can later replace the mock mutation body with real provider/render result validation while preserving the lease token and receipt shape.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Runtime smoke check: worker lease endpoint created and completed a leased image job on the dev server.
