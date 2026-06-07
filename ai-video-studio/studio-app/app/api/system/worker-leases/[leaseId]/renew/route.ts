import { NextResponse } from "next/server";
import { renewWorkerLease } from "@/server/worker-leases";
import { requireSystemAccess } from "@/server/system-access";

export async function POST(request: Request, context: { params: Promise<{ leaseId: string }> }) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  const { leaseId } = await context.params;
  const body = await request.json().catch(() => ({}));
  const result = renewWorkerLease(leaseId, {
    token: typeof body.token === "string" ? body.token : null,
    ttlSec: typeof body.ttlSec === "number" ? body.ttlSec : undefined
  });
  const status = result.renewed ? 200 : result.reason === "not_found" ? 404 : 409;
  return NextResponse.json(result, { status });
}
