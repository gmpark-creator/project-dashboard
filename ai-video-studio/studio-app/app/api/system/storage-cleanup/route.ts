import { NextResponse } from "next/server";
import { executeStorageCleanup, getStorageCleanupPlan } from "@/server/storage-cleanup";
import { requireSystemAccess } from "@/server/system-access";

export function GET(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  return NextResponse.json(getStorageCleanupPlan());
}

export async function POST(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  const body = await request.json().catch(() => ({}));
  return NextResponse.json(executeStorageCleanup({ limit: typeof body.limit === "number" ? body.limit : undefined }));
}
