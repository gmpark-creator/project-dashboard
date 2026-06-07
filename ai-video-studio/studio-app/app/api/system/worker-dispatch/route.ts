import { NextResponse } from "next/server";
import { getWorkerDispatchSnapshot } from "@/server/worker-dispatch";
import { requireSystemAccess } from "@/server/system-access";

export function GET(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  return NextResponse.json(getWorkerDispatchSnapshot());
}
