import { NextResponse } from "next/server";
import { getMediaArtifactInventory } from "@/server/artifact-inventory";

export function GET() {
  return NextResponse.json(getMediaArtifactInventory());
}
