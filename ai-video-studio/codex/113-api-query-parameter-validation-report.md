# API Query Parameter Validation

## Scope

Aligned runtime query parameter handling with OpenAPI boolean query parameter contracts.

## Changes

- Added `booleanQueryParam()` for strict boolean query parsing.
- Applied it to the image asset delete `force` query parameter.
- Added contract validation requiring boolean OpenAPI query parameters to use the helper and document `400`.
- Added a route-level test for invalid `force` values.

## Result

Invalid boolean query parameters now return documented `BAD_REQUEST` responses instead of being silently treated as false.
