import { NextResponse } from "next/server";
import { executeWorkerRetry } from "@/server/worker-retries";
import { requireSystemAccess } from "@/server/system-access";
import { pathParamsError } from "../../../../path-params";

export async function POST(request: Request, context: { params: Promise<{ jobId: string }> }) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;

  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { jobId } = params;
  const result = executeWorkerRetry(jobId);
  const status = result.reason === "already_executed" ? 200 : result.executed ? 201 : result.reason === "not_found" ? 404 : 409;
  return NextResponse.json(result, { status });
}
