# Codex R23 - System metrics contract report

## Scope

The app now records credit transactions, provider attempts, job cancellation, media artifacts, and runtime readiness, but there was no single read-only operations endpoint that summarized the mock runtime. That leaves provider outcome metrics and cost/artifact totals scattered across project bundles.

This round adds an aggregated system metrics contract.

## Implemented

- Added `JobStatusCounts` and `SystemMetrics` domain types.
- Added `src/server/metrics.ts`.
- Added `GET /api/system/metrics`.
- Added OpenAPI operation `getSystemMetrics`.
- Added JSON Schema definitions for `JobStatusCounts` and `SystemMetrics`.
- Added contract validation for the new schema and operation.

## Metrics

The metrics response reports:

- project totals:
  - total
  - active
  - done
  - failed
- job status counts for:
  - generation jobs
  - image jobs
  - render jobs
- credit totals:
  - balance
  - spent
  - reserved
  - available
  - captured
  - refunded
- provider attempt totals:
  - total
  - succeeded
  - failed
  - cancelled
  - retryable failures
  - fallback suggested
  - average latency
- media artifact totals:
  - total
  - images
  - videos
  - external

Provider and model names are deliberately not exposed in this aggregate endpoint.

## Verification Coverage

`mock-flow.test.ts` now checks after the full mock flow:

- all mock projects are counted.
- completed render jobs are counted.
- cancelled generation jobs and cancelled provider attempts are counted.
- successful and failed provider attempts are counted.
- spent credits match captured ledger credits.
- refunded credits are present.
- video artifacts are counted.

`validate-contracts.ts` now requires:

- `SystemMetrics` schema
- `getSystemMetrics` OpenAPI operation

## Notes

- This is an operations/read-only aggregate for the mock runtime.
- It does not replace full analytics or audit logs.
- It creates the production-shaped surface needed for an admin dashboard and provider outcome monitoring without exposing provider/model details to end users.
