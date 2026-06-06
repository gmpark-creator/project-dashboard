# Codex R21 - Job cancellation contract report

## Scope

`JobStatus` already allowed `cancelled`, but the mock backend had no cancellation contract. That left queue/worker cancellation, reserved-credit refunds, and cancellation telemetry untested.

This round adds a backend/API cancellation contract without adding UI controls yet.

## Implemented

- Added `CancelJobResult` domain type and JSON Schema.
- Added `cancelJob(jobId)` in the mock service.
- Added `POST /api/jobs/{jobId}/cancel`.
- Added `studioApi.cancelJob(jobId)` for future UI wiring.
- OpenAPI now includes `cancelJob`.
- `ProviderAttemptStatus` now includes `cancelled`.

## Behavior

`cancelJob` handles active `queued` or `running` jobs:

- generation jobs:
  - mark the job `cancelled`
  - mark the take `cancelled`
  - mark the provider attempt `cancelled`
  - attach normalized `JOB_CANCELLED` error metadata
  - refund reserved generation or upgrade credits
- image jobs:
  - mark the job and variants `cancelled`
  - refund reserved Image Maker credits
- render jobs:
  - mark the job `cancelled`
  - refund reserved render credits
  - move the project out of `rendering` if no active render remains

Already completed, failed, or cancelled jobs return `cancelled: false` with HTTP 409 from the API route. Unknown jobs return HTTP 404.

## Verification Coverage

`mock-flow.test.ts` now checks:

- an active generation job can be cancelled before worker completion.
- the cancel result identifies `generationJob`.
- reserved credits are refunded.
- the generation job remains inspectable with `status: cancelled`.
- the provider attempt records `status: cancelled` and `JOB_CANCELLED`.
- the associated take is cancelled.
- the credit ledger contains a refund entry for the cancelled job.

## Notes

- UI controls were deliberately not added in this Codex round. Claude can add operator-facing cancel affordances later if needed.
- Real queue cancellation will need provider-specific abort support where available; this contract preserves the product-level behavior even when a provider cannot hard-abort an already submitted request.
