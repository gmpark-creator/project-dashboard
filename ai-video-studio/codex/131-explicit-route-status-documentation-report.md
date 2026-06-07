# Explicit Route Status Documentation

## Scope

Added contract validation that every response status code explicitly returned in route source is documented in OpenAPI.

## Changes

- Extracts numeric statuses from `status:` and `const status =` expressions.
- Extracts numeric statuses passed directly to `apiError(...)`.
- Requires every extracted status to exist in the operation's OpenAPI `responses`.
- Leaves dynamic helper responses, such as service errors, credit errors, path parsing, query parsing, and system access, covered by their existing dedicated guards.

## Result

`npm run validate:contracts` now catches explicit route status codes that are added without matching OpenAPI response documentation.
