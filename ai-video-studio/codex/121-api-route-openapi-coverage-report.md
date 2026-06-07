# API Route OpenAPI Coverage

## Scope

Closed the reverse route-contract gap for implemented Next API routes.

## Changes

- Changed `POST /api/jobs/tick` to return a documented `JobQueueSnapshot` instead of the full internal mock state.
- Added the `/jobs/tick` operation to OpenAPI.
- Added contract validation requiring every implemented Next route export to have a matching OpenAPI operation.
- Added a route-level test proving the tick route returns a queue snapshot and does not expose the full `StudioState`.

## Result

Implemented API routes can no longer be added without an OpenAPI operation, and the tick route now has a stable public response shape.
