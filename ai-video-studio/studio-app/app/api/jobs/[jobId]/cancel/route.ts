import { NextResponse } from "next/server";
import { cancelJob } from "@/server/mock-service";

export async function POST(_request: Request, context: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await context.params;
  const result = cancelJob(jobId);
  return NextResponse.json(result, { status: result.cancelled ? 200 : result.kind ? 409 : 404 });
}
