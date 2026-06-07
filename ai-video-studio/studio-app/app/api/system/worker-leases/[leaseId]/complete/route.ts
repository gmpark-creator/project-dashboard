import { NextResponse } from "next/server";
import { completeLiveWorkerLease, liveProjectWritesEnabled, LivePersistenceUnavailableError } from "@/server/live-persistence-runtime";
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
  if (liveProjectWritesEnabled()) {
    try {
      const result = await completeLiveWorkerLease(leaseId, body);
      const status = result.completed ? 200 : result.reason === "not_found" ? 404 : result.reason === "invalid_outputs" ? 422 : 409;
      return NextResponse.json(result, { status });
    } catch (error) {
      if (error instanceof LivePersistenceUnavailableError) {
        return apiError("LIVE_PERSISTENCE_UNAVAILABLE", error.message, 503);
      }
      throw error;
    }
  }
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    return apiError("MOCK_MUTATION_UNAVAILABLE", "Mock-backed worker lease completion is not available in production mode.", 503);
  }
  const result = completeWorkerLease(leaseId, body);
  const status = result.completed ? 200 : result.reason === "not_found" ? 404 : result.reason === "invalid_outputs" ? 422 : 409;
  return NextResponse.json(result, { status });
}
