# Codex R90 - Provider routing config validation report

## Why

Provider routing depends on JSON config files. Existing validation checked that routing targets referenced known models, but it did not catch duplicate IDs, missing tier policies, missing routing filters, or accidental changes to engine-hiding and fallback flags.

## Implemented

- Validates provider IDs and model IDs are present and unique.
- Validates routing keeps `hideEngineFromUser` and `fallbackOnError` enabled.
- Validates `defaultTakePolicy` covers `economy`, `fast`, and `final`.
- Validates the configured routing filter list includes the expected filter hooks.
- Validates routing rule IDs are present, unique, and have at least one target.

## Notes

- No runtime behavior changed.
- Existing provider and routing configs already satisfy the new checks.

## Verification

- `npm run validate:contracts`
- `npm run typecheck`
- `npm run test:mock`
- `npm audit --omit=dev`
- `npm run build`
- `git diff --check`
