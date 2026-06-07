# Domain Schema Saec Name Alignment

## Scope

Aligned the shared domain schema definition name with the TypeScript domain type.

## Changes

- Renamed the schema definition from `SAEC` to `Saec`.
- Updated schema references that point to the SAEC object.
- Added `Saec` to the required domain schema definition guard.

## Result

The domain schema now uses the same exported type name as `src/domain/types.ts`, reducing type/schema drift for storyboard prompt fields.
