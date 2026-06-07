import { NextResponse } from "next/server";
import { executeWorkerRetry } from "@/server/worker-retries";
import { requireSystemAccess } from "@/server/system-access";

export async function POST(request: Request, context: { params: Promise<{ jobId: string }> }) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;

  const { jobId } = await context.params;
  const result = executeWorkerRetry(jobId);
  const status = result.executed ? 201 : result.reason === "not_found" ? 404 : 409;
  return NextResponse.json(result, { status });
}
