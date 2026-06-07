import { NextResponse } from "next/server";
import { getJobQueueSnapshot } from "@/server/queue-snapshot";
import { requireSystemAccess } from "@/server/system-access";

export function GET(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  return NextResponse.json(getJobQueueSnapshot());
}
