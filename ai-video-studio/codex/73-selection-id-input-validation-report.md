# Codex R73 - Selection id input validation report

## Why

Take selection and default render selection trusted request body casts. Non-string or wrong-prefix ids could reach mock-service lookup paths and fail as service exceptions instead of returning the documented 400 error response.

## Implemented

- Validates `POST /api/shots/{shotId}/select-take` body is an object with a `tak_` take id.
- Validates `POST /api/projects/{projectId}/default-render` body is an object with an `rnd_` render job id.
- Updates OpenAPI to document the `tak_` take id pattern and broadens 400 descriptions to missing or invalid ids.

## Notes

- Existing entity lookup behavior is unchanged for well-formed but nonexistent ids.
- Valid UI calls already send the expected id prefixes.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP smoke for invalid take selection id returning 400 with a full `ErrorResponse`.
- HTTP smoke for invalid default render id returning 400 with a full `ErrorResponse`.
