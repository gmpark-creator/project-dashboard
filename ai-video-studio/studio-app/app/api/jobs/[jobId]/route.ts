import { NextResponse } from "next/server";
import { getJob } from "@/server/mock-service";
import { getLiveJob, liveProjectReadsEnabled, LivePersistenceUnavailableError } from "@/server/live-persistence-runtime";
import { apiError } from "../../error-response";
import { pathParamsError } from "../../path-params";

export async function GET(_request: Request, context: { params: Promise<{ jobId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { jobId } = params;
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    if (liveProjectReadsEnabled()) {
      try {
        const liveJob = await getLiveJob(jobId);
        if (liveJob) return NextResponse.json(liveJob);
        return apiError("JOB_NOT_FOUND", "Job not found.", 404);
      } catch (error) {
        if (error instanceof LivePersistenceUnavailableError) {
          return apiError("LIVE_PERSISTENCE_UNAVAILABLE", error.message, 503);
        }
        throw error;
      }
    }
    return apiError("MOCK_READ_UNAVAILABLE", "Mock-backed reads are not available in production mode.", 503);
  }
  const job = getJob(jobId);
  if (job) return NextResponse.json(job);

  return apiError("JOB_NOT_FOUND", "Job not found.", 404);
}
