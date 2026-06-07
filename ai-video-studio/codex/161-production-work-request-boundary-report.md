# Codex R161 - Production work request boundary report

## Scope

- Added fail-closed production boundaries for public work-creating routes while queue, provider execution, and persistence remain mock-backed.
- Kept read-only and system worker contract routes unchanged.

## Changes

- `POST /projects/{projectId}/generate-all` now returns `MOCK_MUTATION_UNAVAILABLE` with HTTP 503 in production mode before mock work creation.
- `POST /shots/{shotId}/generate` now returns the same production boundary response before mock work creation.
- `POST /shots/{shotId}/regenerate` now returns the same production boundary response before mock work creation.
- `POST /takes/{takeId}/upgrade` now returns the same production boundary response before mock work creation.
- `POST /projects/{projectId}/image-jobs` now returns the same production boundary response before mock work creation.
- `POST /projects/{projectId}/renders` now returns the same production boundary response before mock work creation.
- Added `scripts/production-work-request-boundary.test.ts`.
- Wired the new test into `npm run test:mock`.
- Documented the production 503 response for each guarded work request in OpenAPI.

## Verified Behavior

- Production work requests fail closed with a stable 503 error code after request validation and before mock service mutation.
- Failed production work requests do not mutate mock projects, shots, takes, jobs, or credit transactions.
- Existing mock-mode flows remain covered by `mock-flow.test.ts`.

## Verification

- Passed: `npm run validate:contracts`
- Passed: `npm run test:mock`
- Passed: `npm run verify`
