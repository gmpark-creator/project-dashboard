import { NextResponse } from "next/server";
import { detachImageFromShot } from "@/server/mock-service";
import { serviceErrorResponse } from "../../../../service-error";

export async function DELETE(_request: Request, context: { params: Promise<{ shotId: string; assetId: string }> }) {
  const { shotId, assetId } = await context.params;
  try {
    return NextResponse.json(detachImageFromShot(shotId, assetId));
  } catch (error) {
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
