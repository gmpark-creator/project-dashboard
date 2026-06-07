# Codex R47 - Production worker output policy report

## Why

R46 made required output validation available with `requireOutputs=true`, but production mode should not rely on each worker remembering to set that flag. Successful worker completions in production must fail closed unless they include usable output payloads.

## Implemented

- Worker completion output validation now treats `CUTPILOT_RUNTIME_MODE=production` as implicit `requireOutputs=true`.
- Existing mock mode behavior remains unchanged.
- Extended `mock-flow.test.ts` to verify:
  - production mode rejects successful image completion without outputs
  - the same active lease can then complete successfully with a valid image output payload

## Notes

- This still validates payload shape and URL schemes only; storage ownership/provenance remains a future R2/S3 integration concern.
- Failed worker completions are not required to include outputs.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Production-mode service smoke: `CUTPILOT_RUNTIME_MODE=production` rejected missing successful image outputs with `invalid_outputs`, then accepted a valid image output payload.
