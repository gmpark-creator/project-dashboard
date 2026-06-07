# Codex R82 - OpenAPI request body validation report

## Why

Most write routes now reject malformed JSON bodies before touching domain logic. That coverage should remain visible in the API contract instead of relying on manual scans.

## Implemented

- Extended `scripts/validate-contracts.ts` so any OpenAPI operation with a `requestBody` must declare a `400` response.
- Kept the existing duplicate response-code and route export checks unchanged.

## Notes

- This is a contract guard only; no runtime route behavior changed.
- The current OpenAPI contract already satisfies the new rule after R81.

## Verification

- `npm run validate:contracts`
- `npm run typecheck`
- `npm run test:mock`
- `npm audit --omit=dev`
- `npm run build`
- `git diff --check`
