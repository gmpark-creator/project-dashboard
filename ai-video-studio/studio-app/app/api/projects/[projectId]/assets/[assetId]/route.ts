import { NextResponse } from "next/server";
import { deleteImageAsset } from "@/server/mock-service";

export async function DELETE(request: Request, context: { params: Promise<{ projectId: string; assetId: string }> }) {
  const { projectId, assetId } = await context.params;
  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "true";
  const result = deleteImageAsset(projectId, assetId, { force });
  return NextResponse.json(result, { status: result.blockedByUsage ? 409 : 200 });
}
