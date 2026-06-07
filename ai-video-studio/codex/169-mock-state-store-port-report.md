# R169 - Mock State Store Port

## Scope

- Extracted the file-backed mock persistence boundary into `src/server/mock-state-store.ts`.
- Kept the current mock preview behavior intact while making the state storage seam explicit for a future live persistence adapter.
- Updated contract validation so production mock persistence checks target the store port instead of assuming file IO lives inside `mock-service.ts`.

## Production Boundary

- `shouldPersistMockState()` still rejects file-backed mock persistence before `CUTPILOT_MOCK_PERSIST` is considered when `CUTPILOT_RUNTIME_MODE=production`.
- `mock-service.ts` now accesses memory and disk persistence through `fileBackedMockStateStore`.
- This does not mark live persistence implemented. `readiness.ts` still keeps the production persistence check failed until a real adapter is available.

## Verification

- Added `scripts/mock-state-store-boundary.test.ts`.
- Added the new store boundary test to `npm run test:mock`.
- `npm run validate:contracts` now guards the store-port extraction.
