# R188 - Live Select Take Switch

## Scope

- Added live state mutation support for take selection.
- Connected `POST /shots/{shotId}/select-take` to the live write runtime switch.
- Kept default production behavior fail-closed.

## Behavior

- Default production take selection still returns `MOCK_MUTATION_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, the route calls `selectLiveTake(...)`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- The Postgres adapter locks the shot and take, accepts only done takes for the same shot/project, updates `selected_take_id`, marks the shot selected, refreshes project progress/status, and commits in one transaction.
- Missing shots/takes and unfinished takes still normalize to `NOT_FOUND`.

## Verification

- Extended `scripts/live-persistence-write-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-state-mutation-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard route linkage, live write switch handling, live persistence failure handling, shot selection updates, and project progress refresh.
