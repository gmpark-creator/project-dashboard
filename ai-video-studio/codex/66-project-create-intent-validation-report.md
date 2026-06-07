# Codex R66 - Project create intent validation report

## Why

`POST /api/projects` trusted the request body type for `intent`. At runtime a client can send any string, which could reach the template lookup and fail as a server error. Project creation should reject invalid intent values with a normal 400 response.

## Implemented

- Validates `intent` against `INTENT_TEMPLATES` before calling `createProject`.
- Keeps the existing 400 error response path and message.
- Narrows valid request intent back to the `Intent` domain type before passing it to the mock service.

## Notes

- `POST /api/storyboard/decompose` already had the same invalid-intent guard.
- This changes invalid input behavior only; valid project creation is unchanged.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP smoke for invalid project intent returning 400 with a full `ErrorResponse`.
