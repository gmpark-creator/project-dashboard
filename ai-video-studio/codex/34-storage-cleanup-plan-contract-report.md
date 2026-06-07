# Codex R34 - Storage cleanup plan contract report

## Why

The media artifact inventory classifies artifacts as retained, external-review, or orphaned, but a storage worker needs an explicit action plan before deleting anything. The app should be able to distinguish safe app-storage deletion candidates from external media that must not be deleted automatically.

This round adds a read-only storage cleanup plan contract.

## Implemented

- Added `StorageCleanupAction`, `StorageCleanupPlanItem`, and `StorageCleanupPlan` domain types.
- Added `src/server/storage-cleanup.ts`.
- Added admin-protected `GET /api/system/storage-cleanup`.
- Added JSON Schema definitions and root schema property for the cleanup plan.
- Added `getStorageCleanupPlan` to OpenAPI.
- Extended `validate-contracts.ts` to require the new definitions and operation.
- Extended `mock-flow.test.ts` to verify:
  - cleanup plan covers the artifact inventory
  - external-review counts are preserved
  - normal completed mock flow leaves no delete candidates
  - retained and external-review artifacts are not marked safe to delete
  - a synthetic missing-owner stored artifact becomes an orphaned `delete_object` candidate

## Cleanup actions

- `retain`: owner exists or artifact is still retained by the app.
- `review_external`: artifact points to external media or requires manual external storage review.
- `delete_object`: owner record is missing and artifact is managed app storage.

Only `delete_object` items set `safeToDelete=true`.

## Access

`GET /api/system/storage-cleanup` uses the existing production-only system admin guard:

- mock mode: open for local QA
- production mode: requires `CUTPILOT_ADMIN_TOKEN`

## Notes

- This contract does not delete objects.
- It is a storage worker plan that can later feed R2/S3 delete operations after credentials and real object metadata are configured.
- External URLs are intentionally never marked safe for automatic deletion.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Runtime smoke check: `GET /api/system/storage-cleanup` returned a cleanup summary from the dev server.
