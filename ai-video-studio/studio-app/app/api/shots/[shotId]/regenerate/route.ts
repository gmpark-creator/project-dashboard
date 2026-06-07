import { NextResponse } from "next/server";
import { regenerate } from "@/server/mock-service";
import { creditReservationResponse } from "../../../credit-error";
import { apiError } from "../../../error-response";
import { readJsonObject } from "../../../json-body";
import { serviceErrorResponse } from "../../../service-error";
import { pathParamsError } from "../../../path-params";

export async function POST(request: Request, context: { params: Promise<{ shotId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { shotId } = params;
  const body = await readJsonObject(request);
  if (!body) {
    return apiError("BAD_REQUEST", "요청 형식이 올바르지 않습니다.", 400);
  }
  if (body.scope !== "shot" && body.scope !== "segment") {
    return apiError("BAD_REQUEST", "지원하지 않는 재생성 범위입니다.", 400);
  }
  if (typeof body.tweaks !== "undefined" && typeof body.tweaks !== "string") {
    return apiError("BAD_REQUEST", "재생성 수정 요청은 문자열이어야 합니다.", 400);
  }
  const tweaks = typeof body.tweaks === "string" ? body.tweaks : undefined;
  try {
    return NextResponse.json(regenerate(shotId, { scope: body.scope, tweaks }), { status: 202 });
  } catch (error) {
    const creditResponse = creditReservationResponse(error);
    if (creditResponse) return creditResponse;
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
