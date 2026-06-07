import { NextResponse } from "next/server";
import { releaseWorkerLease } from "@/server/worker-leases";
import { apiError } from "../../../../error-response";
import { readJsonObject } from "../../../../json-body";
import { requireSystemAccess } from "@/server/system-access";
import { pathParamsError } from "../../../../path-params";

export async function POST(request: Request, context: { params: Promise<{ leaseId: string }> }) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { leaseId } = params;
  const body = await readJsonObject(request);
  if (!body || typeof body.token !== "string") {
    return apiError("BAD_REQUEST", "worker lease token이 필요합니다.", 400);
  }
  const result = releaseWorkerLease(leaseId, body.token);
  const status = result.released ? 200 : result.reason === "not_found" ? 404 : 409;
  return NextResponse.json(result, { status });
}
