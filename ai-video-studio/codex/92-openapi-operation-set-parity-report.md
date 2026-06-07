# Codex R92 - OpenAPI operation set parity report

## Why

R91 expanded `requiredOperations` to cover every current OpenAPI operation. The validator still only checked one direction, so a newly added operation could exist in OpenAPI without being added to the required set.

## Implemented

- Added the reverse parity check: every OpenAPI `operationId` must also exist in `requiredOperations`.

## Notes

- No runtime or OpenAPI behavior changed.
- This makes the required operation set intentionally exhaustive.

## Verification

- `npm run validate:contracts`
- `npm run typecheck`
- `npm run test:mock`
- `npm audit --omit=dev`
- `npm run build`
- `git diff --check`
