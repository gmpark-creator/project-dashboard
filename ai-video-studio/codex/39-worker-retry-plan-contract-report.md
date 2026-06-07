# Codex R39 - Worker retry plan contract report

## Why

R38 added a write boundary for leased worker completion. Failed completions now need an operations contract that tells a retry scheduler which failures are retryable, which worker class should retry them, and which failures must be held for manual review.

This round adds a read-only worker retry plan.

## Implemented

- Added `WorkerRetryAction`, `WorkerRetryPlanItem`, and `WorkerRetryPlan` domain types.
- Added `src/server/worker-retries.ts`.
- Added admin-protected `GET /api/system/worker-retries`.
- Added JSON Schema definitions and root schema property for retry plans.
- Added `getWorkerRetryPlan` to OpenAPI.
- Extended `validate-contracts.ts` to require the new definitions and operation.
- Extended `mock-flow.test.ts` to verify:
  - failed leased worker completion preserves normalized error metadata
  - retryable Image Maker failures enter the retry plan
  - image failures map to `retry_image_generation`
  - retryable and fallback-suggested flags are preserved

## Retry actions

- `retry_provider_generation`
- `retry_image_generation`
- `retry_render`
- `hold`

Only failed completion receipts are included. A failed receipt is retryable when its normalized error has `retryable=true` and its worker kind maps to a retry action.

## Access

`GET /api/system/worker-retries` uses the existing production-only system admin guard:

- mock mode: open for local QA
- production mode: requires `CUTPILOT_ADMIN_TOKEN`

## Notes

- This is a planning contract, not a retry execution API.
- A future retry executor can consume this plan to create replacement jobs, preserve source failed job ids, and write retry ledger events.
- Non-retryable failures remain visible as `hold` items.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Runtime smoke check: `GET /api/system/worker-retries` returned retry summary data from the dev server.
