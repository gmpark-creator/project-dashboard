import { NextResponse } from "next/server";
import { getSystemMetrics } from "@/server/metrics";
import { requireSystemAccess } from "@/server/system-access";

export function GET(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  return NextResponse.json(getSystemMetrics());
}
