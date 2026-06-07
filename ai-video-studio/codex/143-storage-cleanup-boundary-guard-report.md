# Codex R143 - Storage cleanup boundary guard report

## Scope

- Added contract validation for the R142 object-storage cleanup boundary.
- Kept this in Codex backend/contract verification; no UX changes were made.

## Changes

- Added `assertStorageCleanupObjectStorageBoundary()` to `scripts/validate-contracts.ts`.
- The guard verifies that storage cleanup confirms object deletion before metadata deletion.
- The guard verifies that the cleanup route maps `ObjectStorageUnavailableError` to `OBJECT_STORAGE_UNAVAILABLE` HTTP 503.
- The guard verifies that OpenAPI documents object storage unavailability on `executeStorageCleanup` 503.
- The guard verifies readiness exposes the live object deletion adapter gap.

## Verification

- Passed: `npm run validate:contracts`
- Passed: `npm run verify`
