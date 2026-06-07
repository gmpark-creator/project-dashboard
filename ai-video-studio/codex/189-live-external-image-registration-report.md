# R189 - Live External Image Registration

## Scope

- Added live state mutation support for external image registration.
- Connected `POST /projects/{projectId}/assets` to the live write runtime switch.
- Kept default production behavior fail-closed.

## Behavior

- Default production asset registration still returns `MOCK_MUTATION_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, the route calls `registerLiveExternalImage(...)`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- The Postgres adapter locks the project, derives image dimensions from aspect ratio, inserts `cutpilot_image_assets`, upserts `cutpilot_reference_boards`, refreshes the project timestamp, and commits in one transaction.
- Missing projects still normalize to `NOT_FOUND`.

## Verification

- Extended `scripts/live-persistence-write-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-state-mutation-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard route linkage, live write switch handling, live persistence failure handling, image asset inserts, and reference board upserts.
