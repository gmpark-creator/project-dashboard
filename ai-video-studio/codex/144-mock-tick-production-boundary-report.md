# Codex R144 - Mock tick production boundary report

## Scope

- Closed a production boundary around the mock job tick route.
- Kept this change focused on runtime safety and non-visual frontend error handling.

## Changes

- `POST /api/jobs/tick` now returns `MOCK_TICK_UNAVAILABLE` HTTP 503 in production mode.
- `scripts/api-tick-route.test.ts` now verifies mock-mode 200 behavior and production fail-closed behavior.
- `StudioApp` now catches tick failures so production does not create an unhandled interval rejection.
- OpenAPI now documents the production 503 response for `tickJobs`.

## Verification

- Passed: `npm run test:mock`
- Passed: `npm run validate:contracts`
- Passed: `npm run verify`
