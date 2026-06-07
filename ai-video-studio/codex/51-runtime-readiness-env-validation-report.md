# Codex R51 - Runtime readiness env validation report

## Why

Production readiness previously treated configured environment variables as ready when the values merely existed. That could mark a deployment ready even when a queue URL was malformed, a secret was a placeholder, or an admin token was too short.

## Implemented

- Added `invalidEnv` to the `RuntimeReadiness` contract.
- Runtime readiness now separates:
  - `missingEnv`: required env names that are absent or blank
  - `invalidEnv`: present env names whose values are clearly malformed
- Added conservative shape checks for:
  - provider keys and storage credentials: non-placeholder, minimum length
  - Google Vertex project id: project-id-like string
  - R2 bucket: bucket-name-like string
  - queue URL: URL with a known queue-capable protocol
  - admin token: non-placeholder and at least 16 characters
- Production mode fails readiness when required env is missing or invalid.
- Mock mode remains usable, but still reports warn-level checks for missing or invalid production env.

## Notes

- The checks are intentionally shape checks, not live credential verification.
- Actual provider/storage/queue connectivity still needs production adapters and external credentials.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Direct readiness smoke with production-shaped env:
  - valid env returned `ready=true` and `invalidEnv=[]`
  - malformed `CUTPILOT_QUEUE_URL` returned `ready=false`, `invalidEnv=["CUTPILOT_QUEUE_URL"]`, and `queue_worker=fail`
