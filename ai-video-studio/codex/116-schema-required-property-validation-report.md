# Schema Required Property Validation

## Scope

Tightened schema validation for OpenAPI and domain object contracts.

## Changes

- Required object-schema `required` lists to be arrays of strings.
- Required every listed property to exist in the same object schema `properties` map.
- Required OpenAPI request bodies to declare a boolean `required` flag and an `application/json` schema.

## Result

Schema typos in required-property names and incomplete request-body declarations now fail contract validation before they can drift into generated clients or route expectations.
