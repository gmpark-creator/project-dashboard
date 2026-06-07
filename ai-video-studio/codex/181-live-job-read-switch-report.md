# R181 - Live Job Read Switch

## Scope

- Extended the Postgres read adapter with job reads.
- Connected `GET /jobs/{jobId}` to the live read runtime switch.
- Kept default production behavior fail-closed.

## Behavior

- Default production job reads still return `MOCK_READ_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_READS=1`, job reads call `getLiveJob(jobId)`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Generation job reads include provider attempts.

## Verification

- Extended `scripts/live-persistence-read-adapter.test.ts`.
- Extended `scripts/production-read-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard adapter and route linkage.
