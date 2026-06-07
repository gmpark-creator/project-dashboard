# Codex R84 - Malformed JSON body validation report

## Why

`readJsonObject()` converted any JSON parse failure into `{}`. Routes with optional request fields could treat malformed JSON as an empty object and continue with defaults.

## Implemented

- Changed `readJsonObject()` to parse raw text.
- Empty or blank request bodies still return `{}` for routes whose request body is optional.
- Malformed JSON, arrays, and primitive JSON values now return `null` so routes can emit their existing 400 `ErrorResponse`.
- Added `scripts/api-json-body.test.ts` and runs it before the mock flow through `npm run test:mock`.

## Notes

- Route-level 400 behavior is unchanged for non-object JSON bodies; malformed JSON now follows the same path.
- No OpenAPI contract changes were required because affected routes already document 400 responses.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm audit --omit=dev`
- `npm run build`
- HTTP smoke for malformed project creation JSON returning 400.
- HTTP smoke for blank optional worker lease body remaining accepted as an empty request.
- `git diff --check`
