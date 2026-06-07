# OpenAPI Schema Reference Validation

## Scope

Added contract validation for OpenAPI references into the shared domain schema.

## Changes

- Walks the OpenAPI document recursively.
- Finds `$ref` values that target `../schemas/domain.schema.json#/$defs/*`.
- Fails validation when the referenced `$defs` entry does not exist.

## Result

OpenAPI edits can no longer introduce misspelled or stale domain schema references without failing `npm run verify`.
