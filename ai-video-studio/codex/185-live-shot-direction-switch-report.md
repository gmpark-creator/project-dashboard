# R185 - Live Shot Direction Switch

## Scope

- Added the first live state mutation after project creation: shot direction updates.
- Connected `PATCH /shots/{shotId}/direction` to the live write runtime switch.
- Kept default production behavior fail-closed.

## Behavior

- Default production shot direction updates still return `MOCK_MUTATION_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, the route calls `updateLiveShotDirection(...)`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- The Postgres adapter locks the shot row, merges the direction patch, normalizes avoid terms, updates `direction_spec`, and commits in one transaction.
- Missing shots still normalize to `NOT_FOUND`.

## Verification

- Extended `scripts/live-persistence-write-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-state-mutation-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard route linkage, live write switch, live persistence failure handling, and `cutpilot_shots` updates.
