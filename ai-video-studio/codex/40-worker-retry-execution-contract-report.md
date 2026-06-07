# Codex R40 - Worker retry execution contract report

## Why

R39 exposed a retry plan for failed worker completion receipts. Operators now need a guarded write API that turns a retryable plan item into a replacement queue job while preserving the failed source job id for reconciliation.

## Implemented

- Added `retryOfJobId` to `GenerationJob`, `ImageJob`, and `RenderJob`.
- Added `WorkerRetryExecutionResult`.
- Added `executeWorkerRetry` in `src/server/worker-retries.ts`.
- Added admin-protected `POST /api/system/worker-retries/[jobId]/execute`.
- Added JSON Schema definitions and OpenAPI operation `executeWorkerRetry`.
- Extended `validate-contracts.ts` to require the new schema definition and operation.
- Extended `mock-flow.test.ts` to verify image retry execution creates a replacement job and records the failed source job id.

## Retry behavior

- `retry_image_generation` copies the failed image job request and creates a fresh `ImageJob`.
- `retry_provider_generation` queues one replacement provider generation job for the failed shot.
- `retry_render` queues a replacement render job for the failed render spec.
- Unsupported or non-retryable plan items return a non-executed result instead of creating work.

## Access

`POST /api/system/worker-retries/[jobId]/execute` uses the existing production-only system admin guard:

- mock mode: open for local QA
- production mode: requires `CUTPILOT_ADMIN_TOKEN`

## Notes

- This round creates replacement jobs only. It does not yet persist a dedicated retry ledger event.
- The source failed job remains terminal and inspectable.
- Replacement jobs expose the source through `retryOfJobId`.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Runtime smoke check: `POST /api/system/worker-retries/[jobId]/execute` created a queued image replacement job from a retryable failed worker receipt.
