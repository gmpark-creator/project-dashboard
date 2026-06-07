# Domain Schema Root Closure

## Scope

Closed the top-level domain schema object and added validation for the root schema shape.

## Changes

- Added `additionalProperties: false` to the root `domain.schema.json` object.
- Runs the existing closed-object schema validation against the root schema as well as each `$defs` entry.

## Result

`npm run validate:contracts` now prevents the top-level domain schema registry from accepting undeclared properties.
