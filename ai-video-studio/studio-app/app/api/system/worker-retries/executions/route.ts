import { NextResponse } from "next/server";
import { getWorkerRetryExecutionSnapshot } from "@/server/worker-retries";
import { requireSystemAccess } from "@/server/system-access";

export function GET(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  return NextResponse.json(getWorkerRetryExecutionSnapshot());
}
