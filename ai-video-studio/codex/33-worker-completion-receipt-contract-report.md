# Codex R33 - Worker completion receipt contract report

## Why

Worker dispatch defines the active work a backend worker can pick up, but production also needs a durable way to reconcile completed work with artifacts, errors, and credit ledger entries. Without that boundary, provider/image/render workers can finish while storage ingest, refunds, and captured credits drift apart.

This round adds a read-only worker completion receipt contract.

## Implemented

- Added `WorkerCompletionStatus`, `WorkerCompletionReceipt`, and `WorkerCompletionSnapshot` domain types.
- Added `src/server/worker-completions.ts`.
- Added admin-protected `GET /api/system/worker-completions`.
- Added JSON Schema definitions and root schema property for worker completions.
- Added `getWorkerCompletionSnapshot` to OpenAPI.
- Extended `validate-contracts.ts` to require the new definitions and operation.
- Extended `mock-flow.test.ts` to verify:
  - completion receipts cover all terminal queue jobs
  - succeeded, failed, and cancelled jobs are represented
  - artifact totals reconcile across receipts
  - captured/refunded credit totals reconcile with system metrics
  - successful provider generation receipts include take video artifacts
  - successful Image Maker receipts include image and thumbnail artifacts
  - successful render receipts include render output artifacts
  - failed provider receipts preserve normalized provider errors
  - cancelled provider receipts preserve cancellation errors and refunds

## Snapshot response

The response includes:

- `generatedAt`
- `summary`
  - total terminal receipts
  - succeeded/failed/cancelled counts
  - artifact count
  - captured credits
  - refunded credits
- ordered `receipts`
  - stable completion key
  - worker kind
  - job/project id
  - completion status
  - completion timestamp
  - normalized error, if any
  - linked media artifacts
  - linked credit transactions
  - per-receipt artifact and credit summary

## Access

`GET /api/system/worker-completions` uses the existing production-only system admin guard:

- mock mode: open for local QA
- production mode: requires `CUTPILOT_ADMIN_TOKEN`

## Notes

- This is an internal operations/reconciliation contract, not an end-user UI surface.
- It does not accept worker callbacks yet. A future write API can use the same receipt shape after validating provider or worker completion payloads.
- Receipts are derived from current mock state, media artifacts, and credit transactions, so they verify that the existing mock completion path remains internally consistent.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Runtime smoke check: `GET /api/system/worker-completions` returned a completion summary from the dev server.
