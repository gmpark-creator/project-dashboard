# R171 - Live Persistence Manifest

## Scope

- Added `src/server/live-persistence-contract.ts` as the runtime manifest for the live Postgres persistence contract.
- Connected runtime readiness to the manifest schema version.
- Added a manifest/SQL parity test so future adapter work cannot silently drift from the schema contract.

## Contract

- Schema version: `cutpilot_postgres_v1`.
- The manifest lists all live persistence tables and required worker/admin indexes.
- `readiness.ts` still fails production persistence until a real live adapter exists, but now identifies the schema version that adapter must satisfy.

## Verification

- Added `scripts/persistence-contract-manifest.test.ts`.
- Added the new manifest test to `npm run test:mock`.
- Updated `npm run validate:contracts` to require manifest coverage for every schema table.
