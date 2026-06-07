import { NextResponse } from "next/server";
import { deleteImageAsset } from "@/server/mock-service";
import { deleteLiveImageAsset, liveProjectWritesEnabled, LivePersistenceUnavailableError } from "@/server/live-persistence-runtime";
import { apiError } from "../../../../error-response";
import { serviceErrorResponse } from "../../../../service-error";
import { pathParamsError } from "../../../../path-params";
import { booleanQueryParam } from "../../../../query-params";

export async function DELETE(request: Request, context: { params: Promise<{ projectId: string; assetId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { projectId, assetId } = params;
  const url = new URL(request.url);
  const force = booleanQueryParam(url, "force", false);
  if (force.error) return force.error;
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    if (liveProjectWritesEnabled()) {
      try {
        const result = await deleteLiveImageAsset(projectId, assetId, { force: force.value });
        return NextResponse.json(result, { status: result.blockedByUsage ? 409 : 200 });
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
    const result = deleteImageAsset(projectId, assetId, { force: force.value });
    return NextResponse.json(result, { status: result.blockedByUsage ? 409 : 200 });
  } catch (error) {
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
