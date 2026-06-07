# Domain Schema TypeScript Coverage

## Scope

Closed the remaining TypeScript-domain-to-schema coverage gaps.

## Changes

- Added an `AssetSource` schema definition and reused it from `ImageAsset`.
- Added a `StudioState` schema definition for the internal mock state shape.
- Added typed-map support to schema closure validation for `Record<string, ...>` fields.
- Required `AssetSource` and `StudioState` in contract validation.

## Result

Every exported TypeScript domain type now has a corresponding domain schema definition or an intentional schema-only helper definition.
