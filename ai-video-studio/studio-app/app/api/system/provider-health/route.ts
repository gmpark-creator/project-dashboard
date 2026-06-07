import { NextResponse } from "next/server";
import { getProviderHealthSnapshot } from "@/server/provider-routing";
import { requireSystemAccess } from "@/server/system-access";

export function GET(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  return NextResponse.json(getProviderHealthSnapshot());
}
