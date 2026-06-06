# Codex R19 - Provider attempt telemetry report

## Scope

The app had routing decisions and user-facing errors, but a generation job did not preserve a normalized provider execution attempt. That is a production gap for polling, retries, fallback analysis, request-id tracing, and provider error mapping.

This round adds provider attempt telemetry to `GenerationJob` while keeping provider/model names internal and out of the user UI.

## Implemented

- Added `ProviderAttemptStatus`:
  - `queued`
  - `submitted`
  - `polling`
  - `succeeded`
  - `failed`
- Added `ProviderAttempt` domain type and JSON Schema.
- Added `GenerationJob.providerAttempts`.
- Mock generation jobs now create one provider attempt from the selected routing target.
- During `tickJobs()`:
  - queued/running jobs receive a mock provider request id.
  - completed jobs mark the attempt `succeeded`.
  - failed jobs mark the attempt `failed` and copy normalized error metadata:
    - `errorCode`
    - `retryable`
    - `fallbackSuggested`
  - attempts record `completedAt` and `latencyMs`.
- `normalizeState()` backfills attempts for previously persisted mock jobs.

## Verification Coverage

`mock-flow.test.ts` now checks:

- every generation job has exactly one provider attempt in the mock path.
- successful generation attempts are marked `succeeded`.
- successful attempts retain a mock provider request id and non-negative latency.
- failed generation attempts are marked `failed`.
- failed attempts retain `MOCK_PROVIDER_FAILED`, retryability, and fallback suggestion.
- attempt provider/model match the selected routing target.

`validate-contracts.ts` now requires the `ProviderAttempt` schema definition.

## Notes

- This is telemetry, not user copy. The Studio UI still must not render provider/model names.
- The mock path has one provider attempt per generation job. Production retries or fallback execution can append additional attempts to the same array.
- Render and Image Maker provider attempts are still future work; this round starts with video generation because it is the primary external provider boundary.
