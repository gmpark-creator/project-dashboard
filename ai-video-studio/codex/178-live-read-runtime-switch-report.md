# R178 - Live Read Runtime Switch

## Scope

- Added a runtime factory for the Postgres read adapter.
- Connected project list and project bundle routes to the live read adapter behind an explicit switch.
- Kept production routes fail-closed by default.

## Behavior

- Default production behavior is unchanged: project reads return `MOCK_READ_UNAVAILABLE` before touching mock state.
- When `CUTPILOT_ENABLE_LIVE_READS=1`, project reads use `PostgresLivePersistenceReadAdapter`.
- Live reads require `DATABASE_URL`; missing live persistence returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Other mock-backed read/preflight routes remain fail-closed until live adapters are added for those surfaces.

## Verification

- Added `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-read-boundary.test.ts` to verify the live-read switch fails closed without `DATABASE_URL`.
- Updated `npm run validate:contracts` to guard route linkage and runtime switch requirements.
