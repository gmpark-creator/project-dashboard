import { NextResponse } from "next/server";
import { renewLiveWorkerLease, liveProjectWritesEnabled, LivePersistenceUnavailableError } from "@/server/live-persistence-runtime";
import { renewWorkerLease } from "@/server/worker-leases";
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
  if (
    typeof body.ttlSec !== "undefined" &&
    (typeof body.ttlSec !== "number" || !Number.isInteger(body.ttlSec) || body.ttlSec < 5 || body.ttlSec > 600)
  ) {
    return apiError("BAD_REQUEST", "worker lease TTL은 5초 이상 600초 이하의 정수여야 합니다.", 400);
  }
  const renewal = {
    token: body.token,
    ttlSec: typeof body.ttlSec === "number" ? body.ttlSec : undefined
  };
  if (liveProjectWritesEnabled()) {
    try {
      const result = await renewLiveWorkerLease(leaseId, renewal);
      const status = result.renewed ? 200 : result.reason === "not_found" ? 404 : 409;
      return NextResponse.json(result, { status });
    } catch (error) {
      if (error instanceof LivePersistenceUnavailableError) {
        return apiError("LIVE_PERSISTENCE_UNAVAILABLE", error.message, 503);
      }
      throw error;
    }
  }
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    return apiError("MOCK_MUTATION_UNAVAILABLE", "Mock-backed worker lease renewal is not available in production mode.", 503);
  }
  const result = renewWorkerLease(leaseId, renewal);
  const status = result.renewed ? 200 : result.reason === "not_found" ? 404 : 409;
  return NextResponse.json(result, { status });
}
