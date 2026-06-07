# Codex R87 - Export spec excess key validation report

## Why

Render preview and render start routes validated the required `ExportSpec` enum fields, but accepted extra object keys. Because render jobs store the spec object, contract-external fields could cross the API boundary and persist in mock state.

## Implemented

- Added allowed-key validation to `isExportSpec()`.
- Added test coverage for rejecting an otherwise valid export spec with an extra key.

## Notes

- Valid export specs are unchanged.
- No OpenAPI changes were required because `ExportSpec` already represents the intended shape.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm audit --omit=dev`
- `npm run build`
- HTTP smoke for render preview rejecting an extra spec key with 400.
- `git diff --check`
