# Codex R160 - Production project create guard report

## Scope

- Added contract validation for the R159 production project creation boundary.
- Kept this as a verification-only Codex increment.

## Changes

- Added `assertProductionProjectCreateBoundary()` to `scripts/validate-contracts.ts`.
- The guard verifies `POST /api/projects` branches on production mode before `createProject()`.
- The guard verifies the route returns the stable `MOCK_MUTATION_UNAVAILABLE` code.
- The guard verifies OpenAPI documents the 503 response.
- The guard verifies `scripts/production-project-create-boundary.test.ts` remains wired into `npm run test:mock`.

## Verification

- Passed: `npm run validate:contracts`
- Passed: `npm run verify`
