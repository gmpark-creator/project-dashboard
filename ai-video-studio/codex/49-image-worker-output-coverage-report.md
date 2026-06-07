# Codex R49 - Image worker output coverage report

## Why

R47 made production worker completion require outputs, but image generation jobs can request multiple variants. A single image output is not enough when the job requested more than one variant.

## Implemented

- Strict image worker completion now requires output coverage for every requested image variant.
- Variant coverage is accepted by matching `variantId` or by positional output when ids are omitted.
- Extended `mock-flow.test.ts` to verify:
  - partial variant output is rejected with `invalid_outputs`
  - full variant output completes successfully

## Notes

- This applies when `requireOutputs=true` or `CUTPILOT_RUNTIME_MODE=production`.
- Mock mode without required outputs still allows generated placeholder media.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Production-mode service smoke: a 2-variant image job rejected one output with `invalid_outputs`, then completed with outputs for both variants.
