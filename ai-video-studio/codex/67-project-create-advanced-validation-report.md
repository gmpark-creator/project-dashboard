# Codex R67 - Project create advanced validation report

## Why

`POST /api/projects` accepted the request body's `advanced` settings as trusted TypeScript types. Runtime clients could send unsupported aspect ratios, empty values, non-object advanced payloads, or non-integer durations, which could create projects outside the documented API contract.

## Implemented

- Treats `advanced` as untrusted JSON and narrows it to a plain object before use.
- Rejects unsupported or non-string `advanced.aspect` values with a 400 `ErrorResponse`.
- Rejects non-number, non-integer, or sub-1 `advanced.durationSec` values with a 400 `ErrorResponse`.
- Passes only narrowed `Aspect` and numeric duration values into project creation.

## Notes

- Valid project creation behavior is unchanged.
- The route keeps using the shared `apiError()` helper so invalid inputs return the standardized error body shape.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP smoke for invalid project advanced aspect returning 400 with a full `ErrorResponse`.
- HTTP smoke for invalid project advanced duration returning 400 with a full `ErrorResponse`.
- HTTP smoke for valid project advanced settings returning 201 with the requested aspect and duration.
