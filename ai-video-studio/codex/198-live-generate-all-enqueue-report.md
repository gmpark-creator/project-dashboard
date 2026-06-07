# R198 - Live Generate All Enqueue

## Scope

- Added live work request enqueue support for `POST /projects/{projectId}/generate-all`.
- Reused the live shot generation enqueue path for each pending or failed shot.
- Kept default production behavior fail-closed.

## Behavior

- Default production generate-all still returns `MOCK_MUTATION_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, the route calls `generateAllLiveShots(...)`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Live generate-all targets only pending or failed shots.
- Live generate-all preflights total required credits before enqueueing any shot.
- Each targeted shot enqueues three takes, generation jobs, provider attempts, and `generateShot` reserve ledger entries through the shared live generation adapter.
- Provider execution and storage artifact creation remain worker/provider responsibilities after the queued jobs exist.

## Verification

- Extended `scripts/live-persistence-write-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-work-request-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard route linkage, live write switch handling, live persistence failure handling, targeted shot selection, and reserve ledger recording.
