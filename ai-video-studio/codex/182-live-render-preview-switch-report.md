# R182 - Live Render Preview Switch

## Scope

- Added live render preview building from a Postgres-backed `ProjectBundle`.
- Connected `POST /projects/{projectId}/render-preview` to the live read runtime switch.
- Kept default production behavior fail-closed.

## Behavior

- Default production render preview still returns `MOCK_READ_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_READS=1`, render preview calls `previewLiveRender(projectId, spec)`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- The live preview computes render plan, rights review, source hash, and credit estimate from the live bundle.

## Verification

- Added `scripts/live-render-preview.test.ts`.
- Extended `scripts/production-read-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard live render preview route linkage.
