# OpenAPI Response Schema Closure Guard

## Scope

Closed inline OpenAPI response object schemas and extended contract validation to response payloads.

## Changes

- Added `additionalProperties: false` to inline response object schemas for list, decomposition, image job, generation, regeneration, upgrade, and render queue responses.
- Reused the existing object-schema walker for response schemas.
- Kept `$ref` response schemas delegated to the shared domain schema definitions.

## Result

Inline request and response payloads now follow the same closed-object contract discipline.
