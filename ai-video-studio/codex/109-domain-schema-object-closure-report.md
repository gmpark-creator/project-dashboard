# Domain Schema Object Closure Guard

## Scope

Added contract validation that keeps shared domain schema object definitions closed.

## Changes

- Reused the existing object-schema walker.
- Applies the guard to every schema under `domain.schema.json` `$defs`.
- Leaves the document root alone because it is the schema container, not a domain payload shape.

## Result

Future domain object definitions must declare `additionalProperties: false`, including nested object shapes.
