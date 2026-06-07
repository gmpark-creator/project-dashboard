# R203 - Live Worker Lease Renew/Release

## Scope

- Added live worker lease release for `POST /api/system/worker-leases/[leaseId]/release`.
- Added live worker lease renewal for `POST /api/system/worker-leases/[leaseId]/renew`.
- Kept production mock worker lease release and renewal fail-closed unless live writes are enabled.

## Behavior

- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, release and renew routes call the Postgres live persistence adapter.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Default production release and renewal now return `MOCK_MUTATION_UNAVAILABLE` after system access succeeds.
- Live release expires stale active leases, validates the lease token, rejects non-active leases, and persists `status = released` with `released_at`.
- Live renewal expires stale active leases, validates the lease token, rejects non-active leases, and persists an extended `expires_at`.

## Verification

- Extended `scripts/live-persistence-write-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-state-mutation-boundary.test.ts`.
- Updated `npm run validate:contracts` guards for route linkage, live runtime exports, live adapter methods, production failure, and OpenAPI 503 documentation.
- Passed `npm run typecheck`.
- Passed `npx tsx scripts/live-persistence-write-adapter.test.ts`.
- Passed `npx tsx scripts/live-persistence-runtime.test.ts`.
- Passed `npx tsx scripts/production-state-mutation-boundary.test.ts`.
- Passed `npm run validate:contracts`.
