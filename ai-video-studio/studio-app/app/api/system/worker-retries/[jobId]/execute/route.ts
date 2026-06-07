import { NextResponse } from "next/server";
import { executeLiveWorkerRetry, liveProjectWritesEnabled, LivePersistenceUnavailableError } from "@/server/live-persistence-runtime";
import { executeWorkerRetry } from "@/server/worker-retries";
import { apiError } from "../../../../error-response";
import { requireSystemAccess } from "@/server/system-access";
import { pathParamsError } from "../../../../path-params";

export async function POST(request: Request, context: { params: Promise<{ jobId: string }> }) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;

  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { jobId } = params;
  if (liveProjectWritesEnabled()) {
    try {
      const result = await executeLiveWorkerRetry(jobId);
      const status = result.reason === "already_executed" ? 200 : result.executed ? 201 : result.reason === "not_found" ? 404 : 409;
      return NextResponse.json(result, { status });
    } catch (error) {
      if (error instanceof LivePersistenceUnavailableError) {
        return apiError("LIVE_PERSISTENCE_UNAVAILABLE", error.message, 503);
      }
      throw error;
    }
  }
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    return apiError("MOCK_MUTATION_UNAVAILABLE", "Mock-backed worker retry execution is not available in production mode.", 503);
  }
  const result = executeWorkerRetry(jobId);
  const status = result.reason === "already_executed" ? 200 : result.executed ? 201 : result.reason === "not_found" ? 404 : 409;
  return NextResponse.json(result, { status });
}
