import { NextResponse } from "next/server";
import type { ErrorResponse } from "@/domain/types";
import { getJob } from "@/server/mock-service";

export async function GET(_request: Request, context: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await context.params;
  const job = getJob(jobId);
  if (job) return NextResponse.json(job);

  return NextResponse.json(
    {
      code: "JOB_NOT_FOUND",
      userMessage: "Job not found.",
      retryable: false,
      fallbackSuggested: false
    } satisfies ErrorResponse,
    { status: 404 }
  );
}
