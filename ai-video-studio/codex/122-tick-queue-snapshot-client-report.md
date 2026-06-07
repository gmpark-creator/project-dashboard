# Tick Queue Snapshot Client Alignment

## Scope

Aligned the frontend API client with the documented tick route response.

## Changes

- Typed `studioApi.tick()` as returning `JobQueueSnapshot`.
- Updated the studio polling loop to use the tick response to refresh the queue panel immediately.

## Result

The UI now consumes the stable `/api/jobs/tick` queue snapshot contract instead of discarding the response.
