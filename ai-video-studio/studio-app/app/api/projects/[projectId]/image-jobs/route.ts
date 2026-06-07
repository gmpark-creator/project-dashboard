import { NextResponse } from "next/server";
import { createImageJob } from "@/server/mock-service";
import type { Aspect, ImageAssetRole, ImageMakerPurpose } from "@/domain/types";
import { creditReservationResponse } from "../../../credit-error";
import { apiError } from "../../../error-response";
import { readJsonObject } from "../../../json-body";
import { serviceErrorResponse } from "../../../service-error";
import { pathParamsError } from "../../../path-params";

const validAspects = new Set<Aspect>(["9:16", "16:9", "1:1", "4:5"]);
const validPurposes = new Set<ImageMakerPurpose>([
  "photoreal",
  "product",
  "character",
  "background",
  "style",
  "poster",
  "thumbnail",
  "transparent"
]);
const validRoles = new Set<ImageAssetRole>([
  "product",
  "character",
  "location",
  "style",
  "keyframe",
  "thumbnail",
  "logo",
  "background"
]);

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { projectId } = params;
  const body = await readJsonObject(request);
  if (!body) {
    return apiError("BAD_REQUEST", "요청 형식이 올바르지 않습니다.", 400);
  }
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return apiError("BAD_REQUEST", "이미지 아이디어를 입력해 주세요.", 400);
  }
  if (typeof body.purpose !== "string" || !validPurposes.has(body.purpose as ImageMakerPurpose)) {
    return apiError("BAD_REQUEST", "지원하지 않는 이미지 목적입니다.", 400);
  }
  if (typeof body.role !== "string" || !validRoles.has(body.role as ImageAssetRole)) {
    return apiError("BAD_REQUEST", "지원하지 않는 이미지 역할입니다.", 400);
  }
  if (typeof body.aspect !== "string" || !validAspects.has(body.aspect as Aspect)) {
    return apiError("BAD_REQUEST", "지원하지 않는 화면 비율입니다.", 400);
  }
  if (
    typeof body.count !== "undefined" &&
    (typeof body.count !== "number" || !Number.isInteger(body.count) || body.count < 1 || body.count > 4)
  ) {
    return apiError("BAD_REQUEST", "이미지 생성 개수는 1개 이상 4개 이하의 정수여야 합니다.", 400);
  }
  const style = typeof body.style === "string" ? body.style : undefined;
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    return apiError("MOCK_MUTATION_UNAVAILABLE", "Mock-backed work requests are not available in production mode.", 503);
  }
  try {
    return NextResponse.json(
      createImageJob({
        projectId,
        prompt,
        purpose: body.purpose as ImageMakerPurpose,
        role: body.role as ImageAssetRole,
        aspect: body.aspect as Aspect,
        style,
        count: body.count as number | undefined
      }),
      { status: 202 }
    );
  } catch (error) {
    const creditResponse = creditReservationResponse(error);
    if (creditResponse) return creditResponse;
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
