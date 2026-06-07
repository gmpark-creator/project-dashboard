# Codex R163 - Production state mutation boundary report

## Scope

- Added fail-closed production boundaries for public mock-backed state mutation routes while live persistence remains unavailable.
- Kept read-only, preview, and system worker contract routes unchanged.

## Changes

- Production mode now returns `MOCK_MUTATION_UNAVAILABLE` with HTTP 503 before mock state mutation for:
  - job cancellation
  - storyboard updates
  - shot direction updates
  - take selection
  - asset registration and deletion
  - shot reference attach and detach
  - edit commands
  - audio settings
  - default render selection
- Added `scripts/production-state-mutation-boundary.test.ts`.
- Wired the new test into `npm run test:mock`.
- Documented the production 503 response for each guarded state mutation in OpenAPI.

## Verified Behavior

- Production state mutation requests fail closed with a stable 503 error code after request validation and before mock service mutation.
- Failed production state mutation requests do not mutate mock projects, shots, takes, assets, jobs, or credit transactions.
- Existing mock-mode flows remain covered by `mock-flow.test.ts`.

## Verification

- Passed: `npm run validate:contracts`
- Passed: `npm run test:mock`
- Passed: `npm run verify`
