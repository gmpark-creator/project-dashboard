# Codex R76 - Shot direction input validation report

## Why

`PATCH /api/shots/{shotId}/direction` merged request bodies directly into a shot's direction spec. Invalid field names or non-string values could corrupt the prompt-direction data used by generation.

## Implemented

- Validates the request body is a JSON object.
- Allows only direction-spec keys: `camera`, `composition`, `lighting`, `motion`, `style`, `avoid`, and `notes`.
- Requires scalar direction fields to be strings when present.
- Requires optional `avoid` to be an array of strings.
- Documents the route's 400 `ErrorResponse`.

## Notes

- Valid direction patch behavior is unchanged.
- Existing entity lookup behavior for well-formed but nonexistent shot ids is unchanged.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP smoke for invalid direction patch returning 400 with a full `ErrorResponse`.
- HTTP smoke for valid direction patch returning 200 with the requested values.
