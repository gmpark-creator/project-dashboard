# OpenAPI Success Schema Guard

## Scope

Closed the remaining success-response schema gaps and added a validation guard for documented JSON success responses.

## Changes

- Added `202` response schemas for `generateAll`, `regenerate`, and `upgradeTake`.
- Added the `200` response schema for `selectTake`.
- Updated the `Take` domain schema to include the existing runtime fields `projectId`, `upgradeSourceTakeId`, and `upgradeMode`.
- Added contract validation requiring `200`, `201`, and `202` responses to declare an `application/json` schema.

## Result

OpenAPI success responses now have the same schema discipline as documented error responses, which keeps API clients from receiving shape-less successful payloads.
