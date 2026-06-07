import { NextResponse } from "next/server";
import { completeWorkerLease } from "@/server/worker-leases";
import { requireSystemAccess } from "@/server/system-access";

export async function POST(request: Request, context: { params: Promise<{ leaseId: string }> }) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  const { leaseId } = await context.params;
  const body = await request.json().catch(() => ({}));
  const result = completeWorkerLease(leaseId, {
    token: typeof body.token === "string" ? body.token : undefined,
    status: body.status,
    error: body.error,
    outputs: body.outputs,
    requireOutputs: body.requireOutputs === true
  });
  const status = result.completed ? 200 : result.reason === "not_found" ? 404 : result.reason === "invalid_outputs" ? 422 : 409;
  return NextResponse.json(result, { status });
}
