# Codex R18 - Provider health routing report

## Scope

`routing.config.json` already listed `providerHealth` as a routing filter, but the mock routing engine did not apply live provider/model health. This left outage fallback as a documented intent rather than executable behavior.

This round adds an internal health override hook to the provider router and verifies that unhealthy candidates are removed before selection.

## Implemented

- Added `ProviderHealthStatus`:
  - `healthy`
  - `degraded`
  - `down`
- Added routing helpers:
  - `setProviderHealth(target, status, reason)`
  - `resetProviderHealth()`
- `chooseProviderRoute()` now rejects exact provider/model targets marked `down`.
- Rejected targets record reason `provider_health`.
- `degraded` targets remain eligible for now. This keeps the MVP behavior conservative: only known-down routes are removed, while degraded routes can still be selected until the production health policy assigns weights or throttles.
- If every configured target for a rule is down or otherwise ineligible, the existing `mock:fallback` target remains the final fallback.

## Verification Coverage

`mock-flow.test.ts` now checks an image-to-video fast route with synthetic provider health:

- baseline image-to-video fast routing still splits across Luma, Runway, and Google Vertex candidates.
- when `luma:ray-flash-2` is marked down, route selection skips it and selects the next eligible candidate.
- the skipped target appears in `routing.rejected` with `provider_health`.
- when all image-to-video fast candidates are marked down, routing falls back to `mock:fallback`.

## Notes

- This is an internal backend/router contract. Provider and model names remain hidden from end-user UI.
- Health overrides are in-memory test hooks, not production observability yet.
- Production follow-up: wire real health snapshots from provider polling, request failure telemetry, or operator configuration, then decide whether `degraded` should lower priority, throttle, or hard-block.
