# Codex R166 - Production read boundary report

## Scope

- Added fail-closed production boundaries for public mock-backed read and preflight routes while live persistence remains unavailable.
- Left the pure cost estimate route available because it does not read project state.

## Changes

- `GET /projects` now returns `MOCK_READ_UNAVAILABLE` with HTTP 503 in production mode.
- `GET /projects/{projectId}` now returns the same production boundary response before reading mock project state.
- `GET /jobs/{jobId}` now returns the same production boundary response before reading mock job state.
- `GET /projects/{projectId}/assets` now returns the same production boundary response before reading mock asset state.
- `POST /projects/{projectId}/render-preview` now returns the same production boundary response before building a mock-backed render preview.
- Added `scripts/production-read-boundary.test.ts`.
- Wired the new test into `npm run test:mock`.
- Documented the production 503 response for each guarded read/preflight route in OpenAPI.

## Verified Behavior

- Production public read/preflight routes fail closed with a stable 503 error code.
- Failed production reads do not advance or mutate mock state.
- Mock mode remains covered by existing route and mock-flow tests.

## Verification

- Passed: `npm run validate:contracts`
- Passed: `npm run test:mock`
- Passed: `npm run verify`
