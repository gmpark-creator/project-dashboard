# Codex R89 - User UI provider-name guard report

## Why

The product contract says end users should not see provider or model names. That had been checked manually in earlier rounds, but there was no automated guard against future UI copy or component changes exposing those names.

## Implemented

- Added a source scan to `scripts/validate-contracts.ts` for `app/` and `src/features/`.
- Fails validation if user-facing source includes known provider/model terms such as Runway, Veo, Luma, Vertex, Firefly, Gen-4, or ray-2.

## Notes

- The scan intentionally targets specific brand/model terms, not generic admin words like provider metrics.
- Server/domain files can still contain provider identifiers for routing, logging, and admin/system APIs.

## Verification

- `npm run validate:contracts`
- `npm run typecheck`
- `npm run test:mock`
- `npm audit --omit=dev`
- `npm run build`
- `git diff --check`
