import { NextResponse } from "next/server";
import { attachImageToShot } from "@/server/mock-service";
import type { AssetUsage } from "@/domain/types";

export async function POST(request: Request, context: { params: Promise<{ shotId: string }> }) {
  const { shotId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    assetId?: string;
    mode?: AssetUsage["mode"];
  };
  return NextResponse.json(
    attachImageToShot(shotId, {
      assetId: body.assetId || "",
      mode: body.mode || "first_frame"
    }),
    { status: 202 }
  );
}
