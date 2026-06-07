# OpenAPI Operation ID Uniqueness Guard

## Scope

Added a contract validation guard that rejects duplicate OpenAPI `operationId` values.

## Changes

- Replaced the operation collection pass with a path-aware scan over the declared HTTP methods.
- Added owner tracking so duplicate failures report both the current route and the first route that used the same `operationId`.
- Kept the existing required-operation parity checks intact.

## Result

Client generation and route parity checks now depend on a unique operation namespace instead of only checking that each required operation name appears at least once.
