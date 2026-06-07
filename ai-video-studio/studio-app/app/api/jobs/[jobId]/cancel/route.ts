import { NextResponse } from "next/server";
import { cancelJob } from "@/server/mock-service";
import { cancelLiveJob, liveProjectWritesEnabled, LivePersistenceUnavailableError } from "@/server/live-persistence-runtime";
import { apiError } from "../../../error-response";
import { pathParamsError } from "../../../path-params";

export async function POST(_request: Request, context: { params: Promise<{ jobId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { jobId } = params;
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    if (liveProjectWritesEnabled()) {
      try {
        const result = await cancelLiveJob(jobId);
        return NextResponse.json(result, { status: result.cancelled ? 200 : result.kind ? 409 : 404 });
      } catch (error) {
        if (error instanceof LivePersistenceUnavailableError) {
          return apiError("LIVE_PERSISTENCE_UNAVAILABLE", error.message, 503);
        }
        throw error;
      }
    }
    return apiError("MOCK_MUTATION_UNAVAILABLE", "Mock-backed state changes are not available in production mode.", 503);
  }
  const result = cancelJob(jobId);
  return NextResponse.json(result, { status: result.cancelled ? 200 : result.kind ? 409 : 404 });
}
