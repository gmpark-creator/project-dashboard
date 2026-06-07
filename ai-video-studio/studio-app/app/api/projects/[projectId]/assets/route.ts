import { NextResponse } from "next/server";
import { listImageAssets, registerExternalImage } from "@/server/mock-service";
import type { Aspect, ImageAssetRole } from "@/domain/types";
import { apiError } from "../../../error-response";
import { readJsonObject } from "../../../json-body";
import { serviceErrorResponse } from "../../../service-error";
import { pathParamsError } from "../../../path-params";

const validAspects = new Set<Aspect>(["9:16", "16:9", "1:1", "4:5"]);
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

export async function GET(_request: Request, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { projectId } = params;
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    return apiError("MOCK_READ_UNAVAILABLE", "Mock-backed reads are not available in production mode.", 503);
  }
  try {
    return NextResponse.json({ assets: listImageAssets(projectId) });
  } catch (error) {
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { projectId } = params;
  const body = await readJsonObject(request);
  if (!body) {
    return apiError("BAD_REQUEST", "요청 형식이 올바르지 않습니다.", 400);
  }
  const label = typeof body.label === "string" ? body.label.trim() : "";
  const url = typeof body.url === "string" ? body.url.trim() : "";
  if (!label || !url) {
    return apiError("BAD_REQUEST", "이미지 이름과 URL이 필요합니다.", 400);
  }
  if (typeof body.role !== "string" || !validRoles.has(body.role as ImageAssetRole)) {
    return apiError("BAD_REQUEST", "지원하지 않는 이미지 역할입니다.", 400);
  }
  if (typeof body.aspect !== "undefined" && (typeof body.aspect !== "string" || !validAspects.has(body.aspect as Aspect))) {
    return apiError("BAD_REQUEST", "지원하지 않는 화면 비율입니다.", 400);
  }
  if (typeof body.prompt !== "undefined" && typeof body.prompt !== "string") {
    return apiError("BAD_REQUEST", "이미지 설명은 문자열이어야 합니다.", 400);
  }
  if (typeof body.rightsConfirmed !== "undefined" && typeof body.rightsConfirmed !== "boolean") {
    return apiError("BAD_REQUEST", "권리 확인 값은 boolean이어야 합니다.", 400);
  }
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    return apiError("MOCK_MUTATION_UNAVAILABLE", "Mock-backed state changes are not available in production mode.", 503);
  }
  try {
    return NextResponse.json(
      registerExternalImage({
        projectId,
        label,
        role: body.role as ImageAssetRole,
        url,
        aspect: body.aspect as Aspect | undefined,
        prompt: body.prompt as string | undefined,
        rightsConfirmed: body.rightsConfirmed as boolean | undefined
      }),
      { status: 201 }
    );
  } catch (error) {
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
