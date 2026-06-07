# Codex R83 - Project create tier validation report

## Why

The OpenAPI contract exposed `advanced.tier` for project creation, and `createProject()` accepted it, but the route did not validate or pass it through. New storyboards were always created with `fast` shot requirements.

## Implemented

- Validates `advanced.tier` as `fast`, `economy`, or `final` in `POST /api/projects`.
- Passes the accepted tier into `createProject()`.
- Applies the selected tier to every generated storyboard shot requirement.
- Keeps storyboard preview defaults on the template tier.
- Added mock-flow coverage for advanced aspect, duration, and tier propagation.

## Notes

- Project entities still do not store a top-level tier; the tier is applied to generated shot requirements where provider routing reads it.
- Invalid tier values now return a 400 `ErrorResponse` instead of being ignored.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm audit --omit=dev`
- `npm run build`
- HTTP smoke for invalid `advanced.tier` returning 400 with a full `ErrorResponse`.
- HTTP smoke for valid `advanced.tier: "final"` creating storyboard shots with final tier.
- `git diff --check`
