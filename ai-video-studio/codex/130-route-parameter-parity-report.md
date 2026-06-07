# Route Parameter Parity

## Scope

Added contract validation for parameter drift between Next API route implementations and OpenAPI.

## Changes

- Rejects OpenAPI path parameters that are not present in the documented route path.
- Extracts route-level `booleanQueryParam(..., "name")` usage from each exported method body.
- Requires every implemented boolean query parameter to be documented in OpenAPI as a boolean query parameter.
- Requires every documented boolean query parameter to use the runtime boolean parser and keep a documented `400` response.

## Result

`npm run validate:contracts` now guards path/query parameter parity in both directions for the current route patterns.
