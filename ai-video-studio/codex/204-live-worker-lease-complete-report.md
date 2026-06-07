# R204 - Live Worker Lease Complete

## Scope

- Added live worker lease completion for `POST /api/system/worker-leases/[leaseId]/complete`.
- Added persisted completion handling for image generation, provider generation, and render jobs.
- Kept local mock completion available outside production mode.
- Made production mock-backed worker completion fail-closed unless live writes are enabled.

## Behavior

- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, completion calls the Postgres live persistence adapter.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Default production completion now returns `MOCK_MUTATION_UNAVAILABLE` after system access succeeds.
- Live completion validates lease token/status, rejects inactive jobs, validates production storage keys for successful outputs, updates job state, captures or refunds credits, records media artifacts, releases the lease, and returns a completion receipt.

## Verification

- Extended `scripts/live-persistence-write-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-state-mutation-boundary.test.ts`.
- Updated `scripts/api-worker-storage-policy.test.ts` for production route fail-closed plus service-level storage-key policy coverage.
- Updated `npm run validate:contracts` guards for route linkage, live runtime exports, live adapter methods, production failure, and OpenAPI 503 documentation.
- Passed `npm run typecheck`.
- Passed `npx tsx scripts/live-persistence-write-adapter.test.ts`.
- Passed `npx tsx scripts/live-persistence-runtime.test.ts`.
- Passed `npx tsx scripts/production-state-mutation-boundary.test.ts`.
- Passed `npx tsx scripts/api-worker-storage-policy.test.ts`.
- Passed `npm run validate:contracts`.
