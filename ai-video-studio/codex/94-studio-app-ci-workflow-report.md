# Codex R94 - Studio app CI workflow report

## Why

`npm run verify` now captures the local verification chain, but the repository had no GitHub Actions workflow to run it on pushed changes.

## Implemented

- Added `.github/workflows/ai-video-studio.yml`.
- Runs on push and pull request changes under `ai-video-studio/**` or the workflow file itself.
- Uses Node 24, `npm ci`, and `npm run verify` in `ai-video-studio/studio-app`.

## Notes

- This adds repository automation only; app runtime behavior is unchanged.
- The workflow uses the studio app lockfile as the npm cache dependency path.

## Verification

- `npm run verify`
- `git diff --check`
