# Codex R24 - Media artifact inventory contract report

## Why

The app now records media artifacts with storage keys, URLs, content types, and storage status, but those artifacts were only visible inside a project bundle or as aggregate counts in system metrics. That made it hard to review storage footprint, external media, and cleanup candidates across the mock runtime.

This round adds a read-only media artifact inventory contract.

## Implemented

- Added `MediaArtifactInventory`, `MediaArtifactInventoryItem`, and `MediaArtifactCleanup` domain types.
- Added `src/server/artifact-inventory.ts`.
- Added `GET /api/system/media-artifacts`.
- Added the inventory schema to `codex/schemas/domain.schema.json`.
- Added `getMediaArtifactInventory` to `codex/api/openapi.json`.
- Extended `mock-flow.test.ts` to verify inventory totals against system metrics and to verify retain/review/orphan cleanup states.
- Extended `validate-contracts.ts` so the new schema and operation are required.

## Inventory response

The response includes:

- `generatedAt`
- `summary`
  - total artifacts
  - stored artifacts
  - external artifacts
  - image/video counts
  - known byte total
  - unknown byte count
  - orphaned count
  - external-review count
- `artifacts`
  - original `MediaArtifact`
  - project title
  - owner existence
  - reference flag and count
  - cleanup state: `retain`, `review_external`, or `orphaned`

## Cleanup semantics

- `retain`: owner still exists and the artifact is managed by app storage.
- `review_external`: owner still exists but the artifact points to external media, so the app should not attempt storage deletion.
- `orphaned`: owner no longer exists. This is the production-shaped signal for a future storage cleanup worker.

This contract does not delete objects. It only produces the inventory and cleanup classification needed before a real storage worker or admin action is added.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`

## Notes

- The endpoint is still mock/runtime scoped and has no auth gate yet.
- A production implementation should put this behind admin auth and connect cleanup to object storage after R2/S3 credentials are configured.
- The inventory exposes storage keys and artifact ids because it is an operations contract, not an end-user display surface.
