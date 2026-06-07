# R192 - Live Storyboard Update

## Scope

- Added live state mutation support for storyboard scene/shot updates.
- Connected `PUT /projects/{projectId}/storyboard` to the live write runtime switch.
- Kept default production behavior fail-closed.

## Behavior

- Default production storyboard updates still return `MOCK_MUTATION_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, the route calls `updateLiveStoryboard(...)`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- The Postgres adapter locks the project, updates matching scenes and shots, ignores missing patch targets, validates scene moves by project, clamps shot durations, normalizes direction avoid terms, clears selected takes/quality flags after material shot changes, refreshes project progress/status, and returns the refreshed live project bundle.
- Missing projects still normalize to `NOT_FOUND`.

## Verification

- Extended `scripts/live-persistence-write-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-state-mutation-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard route linkage, live write switch handling, live persistence failure handling, scene updates, shot updates, and project progress refresh.
