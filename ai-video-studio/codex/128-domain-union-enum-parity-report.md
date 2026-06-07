# Domain Union Enum Parity

## Scope

Added contract validation that keeps simple exported TypeScript string literal unions aligned with matching JSON Schema enums.

## Changes

- Parses exported domain aliases like `export type JobStatus = "queued" | "running";`.
- Skips non-simple aliases such as objects, records, intersections, and inline field unions.
- Requires the matching domain schema definition to be `type: "string"` with an `enum`.
- Fails validation when the schema enum values or ordering drift from the TypeScript union.

## Result

`npm run validate:contracts` now catches domain enum drift before API contracts, clients, or mock data can silently diverge.
