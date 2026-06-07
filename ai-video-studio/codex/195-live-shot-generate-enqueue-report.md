# R195 - Live Shot Generate Enqueue

## Scope

- Added live work request enqueue support for `POST /shots/{shotId}/generate`.
- Connected the shot generation route to the live write runtime switch.
- Kept default production behavior fail-closed.

## Behavior

- Default production shot generation still returns `MOCK_MUTATION_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, the route calls `generateLiveShot(...)`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Live enqueue creates queued takes, generation jobs, and initial provider attempts.
- Live enqueue builds the prompt package from the shot and attached image references.
- Live enqueue reserves 6 credits per take and records `generateShot` reserve ledger entries.
- Insufficient credits reuse the existing `INSUFFICIENT_CREDITS` response contract.
- Provider execution and storage artifact creation remain worker/provider responsibilities after the queued jobs exist.

## Verification

- Extended `scripts/live-persistence-write-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-work-request-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard route linkage, live write switch handling, live persistence failure handling, take/job/provider-attempt persistence, and reserve ledger recording.
