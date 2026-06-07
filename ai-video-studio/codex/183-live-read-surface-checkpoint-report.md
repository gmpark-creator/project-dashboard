# R183 - Live Read Surface Checkpoint

## Scope

This checkpoint covers Codex R181-R182. The work finished the currently guarded public read/preflight surfaces that can be backed by the Postgres read adapter without introducing write behavior.

## Completed In This Checkpoint

- R181: Added live job reads for `GET /jobs/{jobId}`.
- R182: Added live render preview preflight for `POST /projects/{projectId}/render-preview`.

## Live Read Surface Now Switch-Gated

When `CUTPILOT_ENABLE_LIVE_READS=1` and `DATABASE_URL` is configured:

- `GET /projects`
- `GET /projects/{projectId}`
- `GET /projects/{projectId}/assets`
- `GET /jobs/{jobId}`
- `POST /projects/{projectId}/render-preview`

Default production behavior remains fail-closed with mock reads unavailable. Missing live persistence returns `LIVE_PERSISTENCE_UNAVAILABLE`.

## Verification

- R181 local: `npm run verify`; remote CI success.
- R182 local: `npm run verify`; remote CI success.

## Remaining Codex Work

- Implement live mutation/write adapter and route switches.
- Implement queue worker adapter and live worker loop.
- Implement provider-specific execution adapters.
- Implement object storage ingest/delete adapters.
- Add real Postgres integration tests once a database endpoint is available.

## Claude Handoff

Claude should validate UX handling for the live-read switch states:

- default production read unavailable state
- live-read enabled without `DATABASE_URL`
- project/job/render-preview loading and error states with live QA data
