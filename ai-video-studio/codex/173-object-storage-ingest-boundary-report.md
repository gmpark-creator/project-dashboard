# R173 - Object Storage Ingest Boundary

## Scope

- Added an object storage ingest port beside the existing delete boundary.
- Kept mock local preview behavior available.
- Kept production/R2 ingest fail-closed until a real live adapter exists.

## Contract

- `ingestStoredObject()` accepts a provider source URL, production-shaped storage key, content type, and optional bytes.
- Mock mode returns a copied result that preserves the source URL for local preview.
- Production mode throws `ObjectStorageUnavailableError` for ingest, matching the existing deletion boundary behavior.
- Runtime readiness now fails object storage until both live ingest and live delete adapters are implemented.

## Verification

- Added `scripts/object-storage-ingest-boundary.test.ts`.
- Added object storage ingest coverage to `npm run test:mock`.
- Updated `npm run validate:contracts` to guard the ingest port and readiness flag.
