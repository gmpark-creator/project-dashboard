import { NextResponse } from "next/server";
import { getJob } from "@/server/mock-service";
import { apiError } from "../../error-response";
import { pathParamsError } from "../../path-params";

export async function GET(_request: Request, context: { params: Promise<{ jobId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { jobId } = params;
  const job = getJob(jobId);
  if (job) return NextResponse.json(job);

  return apiError("JOB_NOT_FOUND", "Job not found.", 404);
}
