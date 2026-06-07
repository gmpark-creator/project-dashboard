# OpenAPI JSON Content Type

## Scope

Added contract validation that OpenAPI request and response bodies remain JSON-only.

## Changes

- Requires every documented request body to declare exactly one content type: `application/json`.
- Requires every documented JSON success or error response to declare exactly one content type: `application/json`.
- Keeps the existing schema checks for the JSON payload shape.

## Result

`npm run validate:contracts` now catches accidental non-JSON media types in the API contract.
