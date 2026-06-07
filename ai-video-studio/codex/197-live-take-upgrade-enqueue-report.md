# R197 - Live Take Upgrade Enqueue

## Scope

- Added live work request enqueue support for `POST /takes/{takeId}/upgrade`.
- Connected the take upgrade route to the live write runtime switch.
- Kept default production behavior fail-closed.

## Behavior

- Default production take upgrade still returns `MOCK_MUTATION_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, the route calls `upgradeLiveTake(...)`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Live upgrade requires a completed source take.
- Live upgrade creates a queued final-tier take with `upgradeSourceTakeId` and `upgradeMode`.
- Live upgrade creates a queued generation job and initial provider attempt.
- Live upgrade reserves 22 credits and records an `upgradeTake` reserve ledger entry.
- Provider execution and storage artifact creation remain worker/provider responsibilities after the queued job exists.

## Verification

- Extended `scripts/live-persistence-write-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-work-request-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard route linkage, live write switch handling, live persistence failure handling, upgrade source persistence, and reserve ledger recording.
