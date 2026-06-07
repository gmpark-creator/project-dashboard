# Codex R149 - Production mock persistence boundary report

## Scope

- Closed file-backed mock persistence in production mode.
- Kept local mock preview persistence behavior intact.

## Changes

- `shouldPersistMockState()` now returns false when `CUTPILOT_RUNTIME_MODE=production`.
- Runtime readiness now reports file-backed mock state as disabled in production mode.
- Added `scripts/production-mock-persistence-boundary.test.ts`.
- Wired the new test into `npm run test:mock`.

## Verified Behavior

- Production mode does not write `data/cutpilot-mock-state.json`, even when `CUTPILOT_MOCK_PERSIST=1`.
- Production reload does not recover mock state from disk.
- Mock mode still writes and reloads file-backed mock state when persistence is enabled.

## Verification

- Passed: `npm run test:mock`
- Passed: `npm run validate:contracts`
- Passed: `npm run verify`
