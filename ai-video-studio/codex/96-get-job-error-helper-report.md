# Codex R96 - Get job error helper report

## Why

`GET /api/jobs/{jobId}` returned a correct full `ErrorResponse` for missing jobs, but it built the JSON inline instead of using the shared `apiError()` helper used by the rest of the API boundary.

## Implemented

- Replaced the inline missing-job response with `apiError("JOB_NOT_FOUND", "Job not found.", 404)`.
- Removed the now-unused `ErrorResponse` type import.

## Notes

- Response shape and status remain unchanged.
- `POST /api/jobs/{jobId}/cancel` still returns `CancelJobResult` for 404/409 because that route's contract is result-shaped rather than `ErrorResponse`-shaped.

## Verification

- `npm run verify`
- HTTP smoke for missing job returning 404 with a full `ErrorResponse`.
- `git diff --check`
