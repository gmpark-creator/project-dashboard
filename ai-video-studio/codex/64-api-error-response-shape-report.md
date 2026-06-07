# Codex R64 - API error response shape report

## Why

Several general API routes returned `{ code, userMessage }` without the full `ErrorResponse` fields. The API client and schema now expect `retryable` and `fallbackSuggested`, so these partial errors could make failure handling inconsistent.

## Implemented

- Added a shared `apiError()` route helper.
- Standardized general API error responses for:
  - cost estimate missing action
  - project creation missing idea or intent
  - project bundle not found
  - default render missing render job id
  - take selection missing take id
  - render creation missing specs
  - render preview missing spec
- Preserved existing status codes and user-facing messages.

## Notes

- Credit reservation and explicit route-local errors already returned full `ErrorResponse` shapes and were left unchanged.
- This changes response bodies only; success behavior is unchanged.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Direct route helper smoke verifying `apiError()` includes `retryable=false` and `fallbackSuggested=false`.
