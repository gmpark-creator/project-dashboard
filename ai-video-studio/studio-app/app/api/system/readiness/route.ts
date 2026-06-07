import { NextResponse } from "next/server";
import { getRuntimeReadiness } from "@/server/readiness";
import { requireSystemAccess } from "@/server/system-access";

export function GET(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  return NextResponse.json(getRuntimeReadiness());
}
