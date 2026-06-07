# Codex R159 - Production project create boundary report

## Scope

- Added a fail-closed production boundary for public project creation while persistence remains mock-backed.
- Kept this scoped to `POST /api/projects`.

## Changes

- `POST /api/projects` now returns `MOCK_MUTATION_UNAVAILABLE` with HTTP 503 in production mode after request validation but before mock state mutation.
- Added `scripts/production-project-create-boundary.test.ts`.
- Wired the new test into `npm run test:mock`.
- Documented the 503 response for `createProject` in OpenAPI.

## Verified Behavior

- Valid production project creation requests fail closed with a stable 503 error code.
- Failed production project creation does not mutate local mock project state.
- Mock mode project creation remains available.

## Verification

- Passed: `npm run validate:contracts`
- Passed: `npm run test:mock`
- Passed: `npm run verify`
