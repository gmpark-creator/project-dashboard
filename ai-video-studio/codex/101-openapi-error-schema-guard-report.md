# OpenAPI Error Schema Guard

## Scope

Added a contract validation guard that requires every documented JSON error response status to declare an explicit `application/json` schema.

The guarded statuses are `400`, `401`, `402`, `404`, `409`, `422`, and `503`.

## Changes

- Added a reusable `jsonSchema()` helper in `scripts/validate-contracts.ts`.
- Kept `jsonSchemaRef()` for stricter response-specific `$ref` checks.
- Added a generic assertion for documented JSON error statuses before the existing specialized result-shaped and system-auth checks run.

## Result

This prevents future OpenAPI edits from documenting an error status without also defining the response shape consumed by clients.
