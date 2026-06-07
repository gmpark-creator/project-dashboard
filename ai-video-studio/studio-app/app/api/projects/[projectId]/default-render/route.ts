import { NextResponse } from "next/server";
import { setDefaultRender } from "@/server/mock-service";
import { liveProjectWritesEnabled, LivePersistenceUnavailableError, setLiveDefaultRender } from "@/server/live-persistence-runtime";
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
  if (!body || typeof body.renderJobId !== "string" || !body.renderJobId.startsWith("rnd_")) {
    return apiError("BAD_REQUEST", "기본 버전으로 지정할 렌더가 필요합니다.", 400);
  }
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    if (liveProjectWritesEnabled()) {
      try {
        return NextResponse.json(await setLiveDefaultRender(projectId, body.renderJobId));
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
    return NextResponse.json(setDefaultRender(projectId, body.renderJobId));
  } catch (error) {
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
