import { NextResponse } from "next/server";
import { updateStoryboard } from "@/server/mock-service";
import { liveProjectWritesEnabled, LivePersistenceUnavailableError, updateLiveStoryboard } from "@/server/live-persistence-runtime";
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
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    if (liveProjectWritesEnabled()) {
      try {
        return NextResponse.json(await updateLiveStoryboard(projectId, body));
      } catch (error) {
        if (error instanceof LivePersistenceUnavailableError) {
          return apiError("LIVE_PERSISTENCE_UNAVAILABLE", error.message, 503);
        }
        const serviceResponse = serviceErrorResponse(error);
        if (serviceResponse) return serviceResponse;
        throw error;
      }
    }
    return apiError("MOCK_MUTATION_UNAVAILABLE", "Mock-backed state changes are not available in production mode.", 503);
  }
  try {
    return NextResponse.json(updateStoryboard(projectId, body));
  } catch (error) {
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
