# OpenAPI Response Descriptions

## Scope

Added contract validation that every OpenAPI response entry has a non-empty description.

## Changes

- Requires each response object to declare `description`.
- Requires response descriptions to be non-empty strings.
- Applies to success, error, and result-shaped response entries.

## Result

`npm run validate:contracts` now catches response status entries added without human-readable API documentation.
