import { NextResponse } from "next/server";
import { releaseWorkerLease } from "@/server/worker-leases";
import { requireSystemAccess } from "@/server/system-access";

export async function POST(request: Request, context: { params: Promise<{ leaseId: string }> }) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  const { leaseId } = await context.params;
  const body = await request.json().catch(() => ({}));
  const result = releaseWorkerLease(leaseId, typeof body.token === "string" ? body.token : null);
  const status = result.released ? 200 : result.reason === "not_found" ? 404 : 409;
  return NextResponse.json(result, { status });
}
