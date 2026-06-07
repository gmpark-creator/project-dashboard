# Credit Error Message Normalization

## Scope

Normalized the API-facing insufficient-credit message.

## Changes

- Replaced a corrupted `userMessage` string in `creditReservationResponse()`.
- Added a route-level test that forces insufficient credits through the image job API route.
- Added the test to `npm run test:mock`.

## Result

Credit failures now return a readable `INSUFFICIENT_CREDITS` `ErrorResponse` with `Not enough available credits.` as the user-facing message.
