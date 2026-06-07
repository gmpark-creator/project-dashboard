import { NextResponse } from "next/server";
import { getProjectBundle } from "@/server/mock-service";
import { getLiveProjectBundle, liveProjectReadsEnabled, LivePersistenceUnavailableError } from "@/server/live-persistence-runtime";
import { apiError } from "../../error-response";
import { pathParamsError } from "../../path-params";

export async function GET(_request: Request, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { projectId } = params;
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    if (liveProjectReadsEnabled()) {
      try {
        const liveBundle = await getLiveProjectBundle(projectId);
        if (!liveBundle) {
          return apiError("NOT_FOUND", "?꾨줈?앺듃瑜?李얠쓣 ???놁뒿?덈떎.", 404);
        }
        return NextResponse.json(liveBundle);
      } catch (error) {
        if (error instanceof LivePersistenceUnavailableError) {
          return apiError("LIVE_PERSISTENCE_UNAVAILABLE", error.message, 503);
        }
        throw error;
      }
    }
    return apiError("MOCK_READ_UNAVAILABLE", "Mock-backed reads are not available in production mode.", 503);
  }
  const bundle = getProjectBundle(projectId);
  if (!bundle) {
    return apiError("NOT_FOUND", "프로젝트를 찾을 수 없습니다.", 404);
  }
  return NextResponse.json(bundle);
}
