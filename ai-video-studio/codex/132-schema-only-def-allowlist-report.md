# Schema-Only Def Allowlist

## Scope

Added contract validation for domain schema definitions that do not map directly to exported TypeScript domain types.

## Changes

- Added an allowlist for intentional schema-only helper definitions.
- Fails validation when a new schema-only `$defs` entry appears without being explicitly added to the allowlist.
- Requires every allowlisted schema-only definition to exist.
- Requires every allowlisted schema-only definition to be referenced by the domain schema or OpenAPI.

## Result

`npm run validate:contracts` now keeps schema-only helper definitions intentional and prevents silent contract sprawl.
