import { NextResponse } from "next/server";
import { createWorkerLease, getWorkerLeaseSnapshot } from "@/server/worker-leases";
import { requireSystemAccess } from "@/server/system-access";

export function GET(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  return NextResponse.json(getWorkerLeaseSnapshot());
}

export async function POST(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  const body = await request.json().catch(() => ({}));
  const result = createWorkerLease(body);
  return NextResponse.json(result, { status: result.lease ? 201 : 200 });
}
