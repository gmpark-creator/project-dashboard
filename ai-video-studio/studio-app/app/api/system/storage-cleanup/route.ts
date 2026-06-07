import { NextResponse } from "next/server";
import { getStorageCleanupPlan } from "@/server/storage-cleanup";
import { requireSystemAccess } from "@/server/system-access";

export function GET(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  return NextResponse.json(getStorageCleanupPlan());
}
