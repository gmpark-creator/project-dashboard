# API Path Parameter Runtime Validation

## Scope

Aligned runtime route handling with the OpenAPI path parameter ID patterns.

## Changes

- Added a shared `pathParamsError()` helper for known route parameter prefixes.
- Added contract validation requiring every templated API route to call the helper and document a `400` response.
- Added route-level tests for malformed project, shot, job, and worker lease path parameters.

## Result

Malformed route IDs now fail at the API boundary with documented `ErrorResponse` payloads instead of falling through to not-found or domain-specific handling.
