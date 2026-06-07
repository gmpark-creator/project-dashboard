import { NextResponse } from "next/server";
import { setAudio } from "@/server/mock-service";
import { isEditAudioPatch } from "../../../edit-validation";
import { apiError } from "../../../error-response";
import { readJsonObject } from "../../../json-body";
import { serviceErrorResponse } from "../../../service-error";
import { pathParamsError } from "../../../path-params";

export async function PUT(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { projectId } = params;
  const body = await readJsonObject(request);
  if (!body || !isEditAudioPatch(body)) {
    return apiError("BAD_REQUEST", "오디오 설정 형식이 올바르지 않습니다.", 400);
  }
  try {
    return NextResponse.json(setAudio(projectId, body));
  } catch (error) {
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
