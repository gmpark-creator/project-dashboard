import { NextResponse } from "next/server";
import { detachImageFromShot } from "@/server/mock-service";
import { serviceErrorResponse } from "../../../../service-error";
import { pathParamsError } from "../../../../path-params";

export async function DELETE(_request: Request, context: { params: Promise<{ shotId: string; assetId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { shotId, assetId } = params;
  try {
    return NextResponse.json(detachImageFromShot(shotId, assetId));
  } catch (error) {
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
