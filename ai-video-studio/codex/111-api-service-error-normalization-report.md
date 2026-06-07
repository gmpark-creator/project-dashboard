# API Service Error Normalization

## Scope

Normalized mock-service domain errors at the API route boundary so not-found and conflict conditions do not leak as generic 500 responses.

## Changes

- Added `serviceErrorResponse()` for common service-layer not-found and conflict errors.
- Applied the helper to project, asset, shot, generation, edit, audio, render, and default-render routes that call throwing service functions.
- Made missing project behavior explicit for image asset listing, project-wide generation, edit commands, and audio patches.
- Added OpenAPI `404` and `409` responses where the API can now return normalized service errors.
- Added route-level tests for missing resources, duplicate active render requests, and unfinished default-render selection.
- Added contract validation that routes using `serviceErrorResponse()` document `404`, and known conflict routes document `409`.

## Result

API clients now receive documented `ErrorResponse` payloads for service-layer resource and conflict failures instead of uncaught runtime errors.
