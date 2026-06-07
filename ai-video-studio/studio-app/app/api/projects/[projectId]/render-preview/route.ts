import { NextResponse } from "next/server";
import { previewRender } from "@/server/mock-service";
import { liveProjectReadsEnabled, LivePersistenceUnavailableError, previewLiveRender } from "@/server/live-persistence-runtime";
import { isExportSpec } from "../../../export-spec";
import { apiError } from "../../../error-response";
import { readJsonObject } from "../../../json-body";
import { serviceErrorResponse } from "../../../service-error";
import { pathParamsError } from "../../../path-params";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { projectId } = params;
  const body = await readJsonObject(request);
  if (!body || !isExportSpec(body.spec)) {
    return apiError("BAD_REQUEST", "미리 점검할 내보내기 형식이 올바르지 않습니다.", 400);
  }
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    if (liveProjectReadsEnabled()) {
      try {
        const preview = await previewLiveRender(projectId, body.spec);
        if (!preview) return apiError("NOT_FOUND", "?꾨줈?앺듃瑜?李얠쓣 ???놁뒿?덈떎.", 404);
        return NextResponse.json(preview);
      } catch (error) {
        if (error instanceof LivePersistenceUnavailableError) {
          return apiError("LIVE_PERSISTENCE_UNAVAILABLE", error.message, 503);
        }
        throw error;
      }
    }
    return apiError("MOCK_READ_UNAVAILABLE", "Mock-backed reads are not available in production mode.", 503);
  }
  try {
    return NextResponse.json(previewRender(projectId, body.spec));
  } catch (error) {
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
