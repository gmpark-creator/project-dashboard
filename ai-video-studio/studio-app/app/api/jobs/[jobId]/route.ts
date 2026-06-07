import { NextResponse } from "next/server";
import { getJob } from "@/server/mock-service";
import { apiError } from "../../error-response";

export async function GET(_request: Request, context: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await context.params;
  const job = getJob(jobId);
  if (job) return NextResponse.json(job);

  return apiError("JOB_NOT_FOUND", "Job not found.", 404);
}
