# R209 Live Object Storage Delete

## Scope

- Added a live Cloudflare R2 delete adapter in `src/server/object-storage.ts`.
- Implemented AWS Signature V4 signing for R2 `DELETE` object requests using the configured R2 S3 endpoint.
- Changed storage cleanup execution to await object deletion before removing media artifact metadata or creating cleanup audit records.
- Updated production readiness to mark live object delete as implemented while keeping live object ingest as a remaining production gap.
- Updated storage cleanup and object storage boundary tests to use fake `fetch` calls instead of real network calls.

## Notes

- R2 endpoint behavior follows Cloudflare's S3-compatible API endpoint shape: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`.
- Live object ingest remains fail-closed and is still reported by readiness.

## Verification

- `npm run typecheck`
- `npx tsx scripts/object-storage-ingest-boundary.test.ts`
- `npx tsx scripts/api-storage-cleanup-boundary.test.ts`
- `npx tsx scripts/mock-flow.test.ts`
- `npm run validate:contracts`

