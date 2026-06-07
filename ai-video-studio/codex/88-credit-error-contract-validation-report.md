# Codex R88 - Credit error contract validation report

## Why

Reserve-backed routes can return 402 `INSUFFICIENT_CREDITS`. The OpenAPI contract already documented those responses, but future routes or edits could lose that documentation without a failing check.

## Implemented

- Added a `creditGuardedOperations` set to `scripts/validate-contracts.ts`.
- Requires each credit-guarded operation to call `creditReservationResponse()` in its route file.
- Requires each credit-guarded OpenAPI operation to document a 402 response.

## Notes

- No runtime behavior changed.
- Current guarded operations are `createImageJob`, `generateShot`, `generateAll`, `regenerate`, `upgradeTake`, and `startRender`.

## Verification

- `npm run validate:contracts`
- `npm run typecheck`
- `npm run test:mock`
- `npm audit --omit=dev`
- `npm run build`
- `git diff --check`
