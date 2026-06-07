# R210 Live Object Storage Ingest

## Scope

- Added live Cloudflare R2 ingest for provider/image/render outputs via `ingestStoredObject`.
- Reused the R2 SigV4 signing path for signed `PUT` object writes with payload hashes and content type headers.
- Preserved mock-mode ingest behavior for local preview.
- Updated runtime readiness so valid R2 env now passes the `object_storage` check.
- Extended object storage and cleanup boundary tests with fake `fetch` calls for source fetch, signed R2 PUT, and signed R2 DELETE.

## Remaining

- Worker completion still accepts worker-provided URLs and storage keys; wiring automatic ingest into worker completion is a separate integration step.

## Verification

- `npm run typecheck`
- `npx tsx scripts/object-storage-ingest-boundary.test.ts`
- `npx tsx scripts/api-storage-cleanup-boundary.test.ts`
- `npm run validate:contracts`

