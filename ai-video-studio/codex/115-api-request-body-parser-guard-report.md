# API Request Body Parser Guard

## Scope

Hardened the API request-body boundary for documented JSON body routes.

## Changes

- Added contract validation requiring OpenAPI request-body routes to use the shared `readJsonObject()` parser.
- Added a route-level test proving non-object JSON request bodies return a `BAD_REQUEST` `ErrorResponse`.

## Result

Documented JSON body routes now have an automated guard against bypassing the standard malformed and non-object body parser.
