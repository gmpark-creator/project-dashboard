# R199 - Live Render Enqueue

## Scope

- Added live work request enqueue support for `POST /projects/{projectId}/renders`.
- Connected the render start route to the live write runtime switch.
- Reused the live render preview planner for render plans and rights review.
- Kept default production behavior fail-closed.

## Behavior

- Default production render start still returns `MOCK_MUTATION_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, the route calls `startLiveRender(...)`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Live render enqueue skips specs that already have an active queued or running render.
- If every requested spec is already active, live render enqueue returns the existing `Render job already active` service error.
- Live render enqueue creates queued `cutpilot_render_jobs` rows with `render_plan` and `rights_review`.
- Live render enqueue reserves 16 credits per queued render and records `startRender` reserve ledger entries.
- Render execution and storage artifact creation remain worker responsibilities after the queued jobs exist.

## Verification

- Extended `scripts/live-persistence-write-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-work-request-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard route linkage, live write switch handling, live persistence failure handling, render job persistence, live render planning, and reserve ledger recording.
