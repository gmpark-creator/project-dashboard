# R194 - Live Image Job Enqueue

## Scope

- Added live work request enqueue support for `POST /projects/{projectId}/image-jobs`.
- Connected the image job route to the live write runtime switch.
- Kept default production behavior fail-closed.

## Behavior

- Default production image generation still returns `MOCK_MUTATION_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, the route calls `createLiveImageJob(...)`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Live enqueue creates a queued `cutpilot_image_jobs` row with the same `{ job }` response shape used by mock mode.
- Live enqueue reserves 4 credits per requested variant and records a `generateImages` reserve ledger entry.
- Insufficient credits reuse the existing `INSUFFICIENT_CREDITS` response contract.
- Provider execution and storage artifact creation remain worker/provider responsibilities after the queued job exists.

## Verification

- Extended `scripts/live-persistence-write-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-work-request-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard route linkage, live write switch handling, live persistence failure handling, image job persistence, and reserve ledger recording.
