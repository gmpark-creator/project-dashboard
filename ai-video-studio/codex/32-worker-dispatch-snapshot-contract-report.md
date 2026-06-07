# Codex R32 - Worker dispatch snapshot contract report

## Why

The app now has worker invocation contracts for video provider generation, Image Maker generation, and render jobs. The queue snapshot shows operator-facing job state, but it does not expose the active work units a backend worker system would dispatch.

This round adds a read-only worker dispatch snapshot. It does not implement real queue leases, ack, retry, or dead-letter handling.

## Implemented

- Added `WorkerDispatchKind`, `WorkerDispatchItem`, and `WorkerDispatchSnapshot` domain types.
- Added `src/server/worker-dispatch.ts`.
- Added admin-protected `GET /api/system/worker-dispatch`.
- Added JSON Schema definitions and root schema property for worker dispatch.
- Added `getWorkerDispatchSnapshot` to OpenAPI.
- Extended `validate-contracts.ts` to require the new definitions and operation.
- Extended `mock-flow.test.ts` to verify:
  - active Image Maker jobs dispatch as `image_generation`
  - active video generation jobs dispatch as `provider_generation`
  - active render jobs dispatch as `render`
  - each dispatch item uses a stable dispatch key
  - each dispatch item carries the correct typed invocation payload
  - summary totals match dispatch items
  - priorities are dense and due-order based
  - completed mock flow has no active dispatch items or next due date

## Snapshot response

The response includes:

- `generatedAt`
- `summary`
  - total active dispatch items
  - provider generation count
  - image generation count
  - render count
  - queued/running counts
  - overdue count
  - next due timestamp
- ordered `items`
  - stable dispatch key
  - dispatch kind
  - job/project id
  - active status and stage
  - ETA and due/queued/updated timestamps
  - priority
  - cancelable flag
  - typed invocation payload

## Access

`GET /api/system/worker-dispatch` uses the existing production-only system admin guard:

- mock mode: open for local QA
- production mode: requires `CUTPILOT_ADMIN_TOKEN`

## Notes

- This is an internal operations/worker contract, not an end-user UI surface.
- It intentionally includes provider/model details and storage keys through typed invocation payloads.
- It is read-only. A production queue can later replace this with a real lease/ack/retry API while preserving the invocation shapes.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Runtime smoke check: `GET /api/system/worker-dispatch` returned a dispatch summary from the dev server (`total=0` in the current completed mock state).
