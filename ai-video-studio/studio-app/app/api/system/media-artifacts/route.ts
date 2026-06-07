import { NextResponse } from "next/server";
import { getMediaArtifactInventory } from "@/server/artifact-inventory";
import { requireSystemAccess } from "@/server/system-access";

export function GET(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  return NextResponse.json(getMediaArtifactInventory());
}
