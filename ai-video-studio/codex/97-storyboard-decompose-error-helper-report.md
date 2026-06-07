# Codex R97 - Storyboard decompose error helper report

## Why

`POST /api/storyboard/decompose` built a full 400 `ErrorResponse` through a local helper. The shape was correct, but it duplicated the shared `apiError()` helper used across the API.

## Implemented

- Replaced the local JSON construction with `apiError("BAD_REQUEST", ..., 400)`.
- Removed the unused `ErrorResponse` import.

## Notes

- Response shape and messages remain unchanged.
- Success response behavior is unchanged.

## Verification

- `npm run verify`
- HTTP smoke for missing idea returning 400 with a full `ErrorResponse`.
- `git diff --check`
