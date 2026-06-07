# Codex R85 - System access contract validation report

## Why

Production system endpoints are protected by `requireSystemAccess()` and should consistently document the 401 and 503 admin-token failure modes. Manual checks are easy to miss as more system endpoints are added.

## Implemented

- Extended `scripts/validate-contracts.ts` so every `/system/*` OpenAPI operation must document 401 and 503 responses.
- Added a route-source guard that fails if a `/system/*` route file does not call `requireSystemAccess()`.

## Notes

- No runtime behavior changed.
- Current system endpoints already satisfied the rule before adding the validator.

## Verification

- `npm run validate:contracts`
- `npm run typecheck`
- `npm run test:mock`
- `npm audit --omit=dev`
- `npm run build`
- `git diff --check`
