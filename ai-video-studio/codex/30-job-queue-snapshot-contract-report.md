# Codex R28 - Job queue snapshot contract report

## Why

The mock runtime advances jobs with `tickJobs()`, but a production queue/worker needs a read-only state boundary for backlog, active work, cancellation, and overdue detection. System metrics summarize counts, but they do not provide an ordered queue view.

This round adds a job queue snapshot contract.

## Implemented

- Added `QueueJobKind`, `QueueJobSnapshot`, and `JobQueueSnapshot` domain types.
- Added `src/server/queue-snapshot.ts`.
- Added admin-protected `GET /api/system/queue`.
- Added JSON Schema definitions for the queue snapshot.
- Added `getJobQueueSnapshot` to OpenAPI.
- Extended `validate-contracts.ts` to require the new definitions and operation.
- Extended `mock-flow.test.ts` to verify:
  - queue total matches all generation/image/render job totals from system metrics
  - active equals queued plus running
  - cancelable summary matches per-job cancelability
  - cancelled job counts match metrics
  - cancelled generation jobs remain visible
  - completed render jobs remain visible
  - completed mock flow has no active `nextDueAt`

## Snapshot response

The response includes:

- `generatedAt`
- `summary`
  - total
  - queued
  - running
  - done
  - failed
  - cancelled
  - active
  - overdue
  - cancelable
  - next due timestamp
- ordered `jobs`
  - id
  - project id
  - kind: `generation`, `image`, or `render`
  - status
  - stage
  - progress
  - ETA
  - queued/updated timestamps
  - due timestamp
  - cancelable flag

## Access

`GET /api/system/queue` uses the existing production-only system admin guard:

- mock mode: open for local QA
- production mode: requires `CUTPILOT_ADMIN_TOKEN`

## Notes

- This is a read-only operations contract.
- It does not implement a real queue, worker lease, retry scheduler, or dead-letter queue.
- A production queue can use this shape as the operator-facing snapshot while worker lease APIs are added separately.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Runtime smoke check: `GET /api/system/queue` returned a queue summary from the dev server.
