import { NextResponse } from "next/server";
import { attachImageToShot } from "@/server/mock-service";
import type { AssetUsage } from "@/domain/types";
import { apiError } from "../../../error-response";
import { readJsonObject } from "../../../json-body";

const validUsageModes = new Set<AssetUsage["mode"]>([
  "first_frame",
  "last_frame",
  "style_reference",
  "character_reference",
  "product_reference",
  "background_reference"
]);

export async function POST(request: Request, context: { params: Promise<{ shotId: string }> }) {
  const { shotId } = await context.params;
  const body = await readJsonObject(request);
  if (!body) {
    return apiError("BAD_REQUEST", "요청 형식이 올바르지 않습니다.", 400);
  }
  if (typeof body.assetId !== "string" || !body.assetId.startsWith("img_")) {
    return apiError("BAD_REQUEST", "연결할 이미지 자산이 필요합니다.", 400);
  }
  if (typeof body.mode !== "string" || !validUsageModes.has(body.mode as AssetUsage["mode"])) {
    return apiError("BAD_REQUEST", "지원하지 않는 참조 모드입니다.", 400);
  }
  return NextResponse.json(
    attachImageToShot(shotId, {
      assetId: body.assetId,
      mode: body.mode as AssetUsage["mode"]
    }),
    { status: 202 }
  );
}
