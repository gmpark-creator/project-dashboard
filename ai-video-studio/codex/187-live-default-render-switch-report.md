# R187 - Live Default Render Switch

## Scope

- Added live state mutation support for default render selection.
- Connected `POST /projects/{projectId}/default-render` to the live write runtime switch.
- Kept default production behavior fail-closed.

## Behavior

- Default production default-render selection still returns `MOCK_MUTATION_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, the route calls `setLiveDefaultRender(...)`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- The Postgres adapter locks the project and render job, rejects missing or unfinished renders, updates `default_render_job_id`, updates `thumb_url` from the render output/share URL, and returns the refreshed live project bundle.
- Missing projects/render jobs still normalize to `NOT_FOUND`; unfinished renders still normalize to `CONFLICT`.

## Verification

- Extended `scripts/live-persistence-write-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-state-mutation-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard route linkage, live write switch handling, live persistence failure handling, and default render persistence.
