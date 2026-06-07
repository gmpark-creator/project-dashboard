# R179 - Live Asset Read Switch

## Scope

- Extended the Postgres read adapter with direct image asset list reads.
- Connected `GET /projects/{projectId}/assets` to the live read runtime switch.
- Kept default production behavior fail-closed.

## Behavior

- Default production asset reads still return `MOCK_READ_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_READS=1`, asset reads call `listLiveImageAssets(projectId)`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE` without touching mock state.

## Verification

- Extended `scripts/live-persistence-read-adapter.test.ts`.
- Extended `scripts/production-read-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard adapter and route linkage.
