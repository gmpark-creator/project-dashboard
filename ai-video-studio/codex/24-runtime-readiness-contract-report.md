# Codex R22 - Runtime readiness contract report

## Scope

The app can now exercise a deep mock workflow, but there was no API surface that stated whether the runtime is still in mock mode or which production prerequisites are missing. That makes it easy to confuse a verified mock MVP with a production-ready provider/storage/queue deployment.

This round adds a runtime readiness contract and API route.

## Implemented

- Added `RuntimeReadiness` domain type and JSON Schema.
- Added `getRuntimeReadiness()` in `src/server/readiness.ts`.
- Added `GET /api/system/readiness`.
- Added OpenAPI operation `getRuntimeReadiness`.
- Added contract validation for the new schema and operation.

## Checks

The readiness response reports:

- runtime mode:
  - `mock` by default
  - `production` when `CUTPILOT_RUNTIME_MODE=production`
- mock persistence setting
- provider credential env:
  - `RUNWAY_API_KEY`
  - `LUMA_API_KEY`
  - `GOOGLE_VERTEX_PROJECT`
- object storage env:
  - `R2_ACCOUNT_ID`
  - `R2_ACCESS_KEY_ID`
  - `R2_SECRET_ACCESS_KEY`
  - `R2_BUCKET`
- queue env:
  - `CUTPILOT_QUEUE_URL`

In mock mode, missing production env is reported as `warn` and `ready` remains true. In production mode, missing provider/storage/queue env becomes `fail`.

## Verification Coverage

`mock-flow.test.ts` now checks:

- readiness defaults to mock mode.
- mock readiness remains usable without production credentials.
- missing provider credentials are surfaced as warnings in mock mode.
- test env values are restored after the readiness check.

`validate-contracts.ts` now requires:

- `RuntimeReadiness` schema
- `getRuntimeReadiness` OpenAPI operation

## Notes

- This does not connect real providers, object storage, or a queue.
- The purpose is to make production blockers machine-readable before live provider work begins.
- The env names are a deployment contract for the next phase and can be mapped to a secret manager later.
