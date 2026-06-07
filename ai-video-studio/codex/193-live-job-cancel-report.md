# R193 - Live Job Cancel

## Scope

- Added live state mutation support for job cancellation.
- Connected `POST /jobs/{jobId}/cancel` to the live write runtime switch.
- Kept default production behavior fail-closed.

## Behavior

- Default production job cancellation still returns `MOCK_MUTATION_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, the route calls `cancelLiveJob(...)`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Generation job cancellation updates the generation job, active provider attempts, related take, credit account reservation, credit refund ledger, and project progress/status.
- Image job cancellation updates the image job, variants, credit account reservation, and credit refund ledger.
- Render job cancellation updates the render job, credit account reservation, credit refund ledger, and clears project rendering status when no active render remains.
- Missing and inactive jobs preserve the existing not-found/conflict-shaped result semantics.

## Verification

- Extended `scripts/live-persistence-write-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-state-mutation-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard route linkage, live write switch handling, live persistence failure handling, job updates, and credit refund transaction recording.
