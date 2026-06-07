import { NextResponse } from "next/server";
import { updateStoryboard } from "@/server/mock-service";
import { apiError } from "../../../error-response";
import { readJsonObject } from "../../../json-body";
import { serviceErrorResponse } from "../../../service-error";
import { isStoryboardUpdatePatch } from "../../../storyboard-validation";
import { pathParamsError } from "../../../path-params";

export async function PUT(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { projectId } = params;
  const body = await readJsonObject(request);
  if (!body || !isStoryboardUpdatePatch(body)) {
    return apiError("BAD_REQUEST", "스토리보드 수정 형식이 올바르지 않습니다.", 400);
  }
  try {
    return NextResponse.json(updateStoryboard(projectId, body));
  } catch (error) {
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
