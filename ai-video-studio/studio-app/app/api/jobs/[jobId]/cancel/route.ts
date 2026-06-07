import { NextResponse } from "next/server";
import { cancelJob } from "@/server/mock-service";
import { pathParamsError } from "../../../path-params";

export async function POST(_request: Request, context: { params: Promise<{ jobId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { jobId } = params;
  const result = cancelJob(jobId);
  return NextResponse.json(result, { status: result.cancelled ? 200 : result.kind ? 409 : 404 });
}
