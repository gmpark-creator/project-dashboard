# Domain Schema Local Reference Validation

## Scope

Added contract validation for local `$ref` values inside `domain.schema.json`.

## Changes

- Added a JSON Pointer resolver for local schema references.
- Walks the domain schema recursively.
- Fails validation when a local `#/...` reference does not resolve.

## Result

The shared domain schema now catches stale or misspelled internal references during `npm run verify`.
