# OpenAPI Error Response Ref Validation

## Scope

Locked down documented error response schemas by response class.

## Changes

- Required normal OpenAPI error responses to reference `ErrorResponse`.
- Required `402` credit errors to reference `InsufficientCreditsResponse`.
- Extended result-shaped error exceptions for asset deletion and worker completion `422` responses.

## Result

Future OpenAPI error responses now fail contract validation if they drift to the wrong schema family.
