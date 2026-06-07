# Codex R43 - Storage cleanup execution contract report

## Why

R34 exposed a storage cleanup plan, but operations still lacked a guarded write boundary for applying safe cleanup candidates. This round adds a mock-backed execution contract that deletes only safe orphaned managed artifacts and records what it removed.

## Implemented

- Added `StorageCleanupExecutionRecord`.
- Added `StorageCleanupExecutionResult`.
- Added `storageCleanupRecords` to mock state with normalization/backfill.
- Added `executeStorageCleanup` in `src/server/storage-cleanup.ts`.
- Added admin-protected `POST /api/system/storage-cleanup`.
- Added JSON Schema definitions and OpenAPI operation `executeStorageCleanup`.
- Extended `validate-contracts.ts`.
- Extended `mock-flow.test.ts` to verify:
  - orphaned stored artifacts become executable cleanup candidates
  - `limit` restricts deletion count
  - deleted artifacts are removed from mock state
  - cleanup execution records persist in mock state

## Safety

- Only plan items with `safeToDelete=true` are executed.
- `review_external` and `retain` items are never deleted by this API.
- The mock execution removes `MediaArtifact` records only; production object deletion still needs real R2/S3 integration.

## Access

`POST /api/system/storage-cleanup` uses the existing production-only system admin guard:

- mock mode: open for local QA
- production mode: requires `CUTPILOT_ADMIN_TOKEN`

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Runtime smoke check: `POST /api/system/storage-cleanup` with `limit: 0` returned a valid execution result without deleting artifacts.
