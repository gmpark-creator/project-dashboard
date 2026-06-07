# R196 - Live Shot Regenerate Enqueue

## Scope

- Added live work request enqueue support for `POST /shots/{shotId}/regenerate`.
- Reused the live shot generation enqueue path with two replacement takes.
- Kept default production behavior fail-closed.

## Behavior

- Default production shot regeneration still returns `MOCK_MUTATION_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, the route calls `generateLiveShot(shotId, { takeCount: 2 })`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Live regeneration creates queued takes, generation jobs, provider attempts, and `generateShot` reserve ledger entries through the shared live generation adapter.
- Provider execution and storage artifact creation remain worker/provider responsibilities after the queued jobs exist.

## Verification

- Extended `scripts/production-work-request-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard route linkage, live write switch handling, live persistence failure handling, and the two-take regeneration enqueue policy.
