# Codex R61 - Get job route implementation report

## Why

The OpenAPI contract documented `GET /api/jobs/{jobId}`, but the Next app only implemented job cancellation under `/api/jobs/{jobId}/cancel`. Clients and operators need a simple read-only way to inspect a specific generation, image, or render job without fetching the whole project bundle.

## Implemented

- Added `getJob(jobId)` to the mock service.
- Added `GET /api/jobs/[jobId]`.
- Added `studioApi.getJob(jobId)` for client-side consumers.
- Added OpenAPI 404 response documentation for missing jobs.
- Added mock-flow coverage for:
  - generation job lookup
  - image job lookup
  - render job lookup
  - missing job lookup

## Notes

- The endpoint is read-only and does not mutate job state.
- Returned job bodies reuse existing `GenerationJob`, `ImageJob`, and `RenderJob` domain shapes.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP smoke for `GET /api/jobs/{jobId}` success and 404 behavior.
