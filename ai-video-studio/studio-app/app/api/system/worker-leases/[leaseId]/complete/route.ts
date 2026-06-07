import { NextResponse } from "next/server";
import { completeWorkerLease } from "@/server/worker-leases";
import { apiError } from "../../../../error-response";
import { readJsonObject } from "../../../../json-body";
import { requireSystemAccess } from "@/server/system-access";
import { isWorkerLeaseCompletionInput } from "../../../../worker-completion-validation";
import { pathParamsError } from "../../../../path-params";

export async function POST(request: Request, context: { params: Promise<{ leaseId: string }> }) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { leaseId } = params;
  const body = await readJsonObject(request);
  if (!body || !isWorkerLeaseCompletionInput(body)) {
    return apiError("BAD_REQUEST", "worker lease 완료 요청 형식이 올바르지 않습니다.", 400);
  }
  const result = completeWorkerLease(leaseId, body);
  const status = result.completed ? 200 : result.reason === "not_found" ? 404 : result.reason === "invalid_outputs" ? 422 : 409;
  return NextResponse.json(result, { status });
}
