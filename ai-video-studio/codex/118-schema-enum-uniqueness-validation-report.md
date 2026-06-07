# Schema Enum Uniqueness Validation

## Scope

Added duplicate-value protection for shared schema contracts.

## Changes

- Required object-schema `required` arrays to avoid duplicate property names.
- Required every `enum` array in the domain schema and OpenAPI document to be non-empty.
- Required every `enum` array to contain unique values.

## Result

OpenAPI and domain schema enums now fail contract validation when duplicate or empty enum declarations are introduced.
