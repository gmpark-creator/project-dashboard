# Codex R20 - Media artifact catalog report

## Scope

Provider outputs and render outputs were attached directly to domain objects as URLs. That is enough for the mock UI, but it does not give production a durable ingest/storage boundary for S3/R2 keys, ownership, content types, or output cleanup.

This round adds a project-scoped media artifact catalog to the mock state and bundle contract.

## Implemented

- Added `MediaArtifact` domain type and JSON Schema.
- Added `StudioState.mediaArtifacts`.
- Added `ProjectBundle.mediaArtifacts`, filtered by project.
- Added artifact recording helpers for:
  - Image Maker and external image assets
  - image thumbnails
  - completed take videos
  - completed take posters
  - completed render outputs
- Each artifact records:
  - project id
  - owner type and owner id
  - source job id when available
  - media kind and role
  - URL
  - storage key
  - content type
  - bytes placeholder
  - storage status (`stored` or `external`)
  - creation time
- `normalizeState()` backfills artifacts for previously persisted mock image assets, completed takes, and completed render jobs.
- Deleting an image asset now also removes that image asset's artifacts.

## Verification Coverage

`mock-flow.test.ts` now checks:

- Image Maker creates image and thumbnail artifacts.
- completed takes create video and poster artifacts.
- completed render jobs create render output artifacts.
- force-deleting an image asset removes its media artifacts.

`validate-contracts.ts` now requires `AssetKind` and `MediaArtifact` schema definitions.

## Notes

- This is a storage/ingest contract, not a real object-storage implementation.
- The mock still uses browser-playable URLs for UI validation, while `storageKey` provides the production-shaped location field.
- Share URLs are not artifacts; only actual media outputs are cataloged.
