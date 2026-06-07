# Codex R91 - OpenAPI required operation coverage report

## Why

`validate-contracts.ts` checked a curated set of required OpenAPI operations, but it missed several core routes such as project creation, storyboard decomposition, job lookup, generation-all, regeneration, selection, upgrade, render start, and cost estimate.

## Implemented

- Added the missing core operation IDs to the required operation set.
- Renamed the validation summary key from `visualMakerOps` to `requiredOperations`.

## Notes

- No API contract or runtime behavior changed.
- The required operation set now covers all current OpenAPI operations.

## Verification

- `npm run validate:contracts`
- `npm run typecheck`
- `npm run test:mock`
- `npm audit --omit=dev`
- `npm run build`
- `git diff --check`
