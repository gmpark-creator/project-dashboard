# OpenAPI Request Schema Closure Guard

## Scope

Closed the remaining inline OpenAPI request object schemas and added a contract guard to keep them closed.

## Changes

- Added `additionalProperties: false` to inline request schemas for project creation, storyboard decomposition, image assets, image jobs, shot generation, shot references, shot direction patches, generation controls, cost estimates, render requests, default render selection, and render previews.
- Closed nested inline request objects such as project `advanced`, storyboard attachment items, and regeneration `range`.
- Added contract validation that walks inline request body schemas and rejects object schemas missing `additionalProperties: false`.

## Result

Client-facing request contracts now consistently document closed payload shapes instead of silently allowing undocumented extra keys.
