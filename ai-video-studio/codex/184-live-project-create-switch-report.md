# R184 - Live Project Create Switch

## Scope

- Added the first Postgres live write adapter for project creation.
- Connected `POST /projects` to the live write runtime switch.
- Kept default production behavior fail-closed.

## Behavior

- Default production project creation still returns `MOCK_MUTATION_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, project creation calls `createLiveProject(...)`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Live project creation writes in one transaction:
  - credit account
  - project
  - default scenes
  - default shots
  - reference board
  - edit state

## Verification

- Added `scripts/live-persistence-write-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-project-create-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard route linkage, live write switch, and transaction rollback.
