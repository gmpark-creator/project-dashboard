import { NextResponse } from "next/server";
import { releaseLiveWorkerLease, liveProjectWritesEnabled, LivePersistenceUnavailableError } from "@/server/live-persistence-runtime";
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
  if (liveProjectWritesEnabled()) {
    try {
      const result = await releaseLiveWorkerLease(leaseId, body.token);
      const status = result.released ? 200 : result.reason === "not_found" ? 404 : 409;
      return NextResponse.json(result, { status });
    } catch (error) {
      if (error instanceof LivePersistenceUnavailableError) {
        return apiError("LIVE_PERSISTENCE_UNAVAILABLE", error.message, 503);
      }
      throw error;
    }
  }
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    return apiError("MOCK_MUTATION_UNAVAILABLE", "Mock-backed worker lease release is not available in production mode.", 503);
  }
  const result = releaseWorkerLease(leaseId, body.token);
  const status = result.released ? 200 : result.reason === "not_found" ? 404 : 409;
  return NextResponse.json(result, { status });
}
