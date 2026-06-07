# Route Success Status Parity

## Scope

Added contract validation that keeps implemented route success status codes aligned with OpenAPI response documentation.

## Changes

- Extracts each exported API route method body before validating status usage.
- Treats `NextResponse.json(...)` without an explicit 2xx status as `200`.
- Detects explicit and conditional success statuses such as `201`, `202`, and `result.lease ? 201 : 200`.
- Fails validation when a route returns an undocumented success status or OpenAPI documents a success status the route does not return.

## Result

`npm run validate:contracts` now guards success response code drift between Next route implementations and OpenAPI.
