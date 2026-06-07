import { NextResponse } from "next/server";
import { deleteImageAsset } from "@/server/mock-service";
import { serviceErrorResponse } from "../../../../service-error";

export async function DELETE(request: Request, context: { params: Promise<{ projectId: string; assetId: string }> }) {
  const { projectId, assetId } = await context.params;
  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "true";
  try {
    const result = deleteImageAsset(projectId, assetId, { force });
    return NextResponse.json(result, { status: result.blockedByUsage ? 409 : 200 });
  } catch (error) {
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
