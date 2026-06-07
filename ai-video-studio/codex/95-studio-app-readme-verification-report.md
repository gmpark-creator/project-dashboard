# Codex R95 - Studio app README verification report

## Why

The studio app README still listed the older individual command sequence and did not mention the new `npm run verify` script or CI workflow.

## Implemented

- Added `npm run verify` as the primary verification command.
- Kept individual verification commands listed for targeted runs.
- Documented that GitHub Actions runs `npm run verify` for `ai-video-studio/**` changes.

## Verification

- `git diff --check`
