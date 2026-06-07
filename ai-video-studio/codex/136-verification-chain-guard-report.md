# Verification Chain Guard

## Scope

Added contract validation for the local and CI verification chain.

## Changes

- Requires `npm run verify` to include typecheck, contract validation, mock tests, production dependency audit, and production build.
- Requires the GitHub Actions workflow to run from `ai-video-studio/studio-app`.
- Requires the workflow to use Node 24, install with `npm ci`, cache the app lockfile, and run `npm run verify`.

## Result

`npm run validate:contracts` now catches accidental weakening of the verification chain before it reaches CI.
