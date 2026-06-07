# Codex R69 - Generation route input validation report

## Why

Several generation routes trusted TypeScript casts for runtime JSON. Invalid `tier`, `takeCount`, regeneration `scope`, or upgrade `mode` values could be silently defaulted or clamped even though the OpenAPI contract documents stricter request shapes.

## Implemented

- Added `readJsonObject()` for API routes that need to reject non-object JSON bodies.
- Validates `POST /api/shots/{shotId}/generate`:
  - optional `tier` must be a domain `Tier`
  - optional `takeCount` must be an integer from 1 through 3
- Validates `POST /api/projects/{projectId}/generate-all` optional `tier`.
- Validates `POST /api/shots/{shotId}/regenerate` required `scope` and optional string `tweaks`.
- Validates `POST /api/takes/{takeId}/upgrade` optional `mode`, including OpenAPI's `auto` mode as the route default.
- Documents 400 `ErrorResponse` bodies for those generation routes.

## Notes

- Valid UI calls are unchanged because the client already sends valid defaults.
- Credit reservation failures still return the existing 402 insufficient-credit response.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP smoke for invalid shot generation `tier` returning 400 with a full `ErrorResponse`.
- HTTP smoke for invalid shot generation `takeCount` returning 400 with a full `ErrorResponse`.
- HTTP smoke for invalid project generation `tier` returning 400 with a full `ErrorResponse`.
- HTTP smoke for invalid regeneration `scope` returning 400 with a full `ErrorResponse`.
- HTTP smoke for invalid upgrade `mode` returning 400 with a full `ErrorResponse`.
