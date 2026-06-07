# Codex R93 - Verification script report

## Why

Recent increments require the same verification chain: typecheck, contract validation, mock flow, audit, and production build. Running those as separate commands makes it easier to miss one before committing.

## Implemented

- Added `npm run verify` to `studio-app/package.json`.
- The script runs:
  - `npm run typecheck`
  - `npm run validate:contracts`
  - `npm run test:mock`
  - `npm audit --omit=dev`
  - `npm run build`

## Notes

- Existing scripts remain unchanged.
- This is intended as the standard pre-commit verification command for future Codex increments.

## Verification

- `npm run verify`
- `git diff --check`
