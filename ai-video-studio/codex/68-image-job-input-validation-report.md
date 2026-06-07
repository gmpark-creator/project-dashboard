# Codex R68 - Image job input validation report

## Why

`POST /api/projects/{projectId}/image-jobs` trusted TypeScript casts for image maker request fields. Runtime clients could send unsupported `purpose`, `role`, or `aspect` values, omit the prompt, or send an invalid `count`, while the OpenAPI contract already constrained those fields.

## Implemented

- Treats image job request body fields as untrusted JSON.
- Requires a non-empty prompt before calling the mock service.
- Validates `purpose`, `role`, and `aspect` against the domain enum values.
- Validates optional `count` as an integer from 1 through 4.
- Normalizes optional `style` only when it is a string.
- Documents the route's 400 response with the shared `ErrorResponse` schema.

## Notes

- Valid image generation requests are unchanged.
- Credit reservation failures still return the existing 402 insufficient-credit response.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP smoke for invalid image job purpose returning 400 with a full `ErrorResponse`.
- HTTP smoke for invalid image job count returning 400 with a full `ErrorResponse`.
- HTTP smoke for valid image job creation returning 202 with the requested enum values and count.
