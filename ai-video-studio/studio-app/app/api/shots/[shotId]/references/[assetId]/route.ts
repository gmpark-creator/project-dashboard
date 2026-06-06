import { NextResponse } from "next/server";
import { detachImageFromShot } from "@/server/mock-service";

export async function DELETE(_request: Request, context: { params: Promise<{ shotId: string; assetId: string }> }) {
  const { shotId, assetId } = await context.params;
  return NextResponse.json(detachImageFromShot(shotId, assetId));
}
