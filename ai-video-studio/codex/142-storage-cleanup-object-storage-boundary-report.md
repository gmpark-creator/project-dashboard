# Codex R142 - Storage cleanup object storage boundary report

## Scope

- Added a fail-closed object storage deletion boundary for storage cleanup execution.
- Kept the change in Codex backend/contracts; no UI changes were made.

## Changes

- Added `src/server/object-storage.ts` with a mock-only deletion adapter and an `ObjectStorageUnavailableError` for production/R2 cleanup attempts.
- Updated `executeStorageCleanup()` to confirm object deletion before removing metadata or creating cleanup audit records.
- Updated `POST /api/system/storage-cleanup` to return `OBJECT_STORAGE_UNAVAILABLE` HTTP 503 when the deletion adapter is unavailable.
- Updated runtime readiness so production object storage reports fail until live object deletion is implemented, even when R2 env is shape-valid.
- Added `scripts/api-storage-cleanup-boundary.test.ts` and wired it into `npm run test:mock`.
- Updated OpenAPI 503 wording for storage cleanup execution.

## Verified Behavior

- Mock cleanup still deletes safe orphan candidates and records audit entries.
- Production cleanup with a delete candidate returns HTTP 503 before metadata is removed.
- Failed production cleanup preserves the media artifact record and creates no cleanup execution record.
- Production readiness exposes the object storage adapter gap.

## Verification

- Passed: `npm run test:mock`
- Passed: `npm run validate:contracts`
- Passed: `npm run verify`
