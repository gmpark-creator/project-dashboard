import { NextResponse } from "next/server";
import { detachImageFromShot } from "@/server/mock-service";
import { detachLiveImageFromShot, liveProjectWritesEnabled, LivePersistenceUnavailableError } from "@/server/live-persistence-runtime";
import { apiError } from "../../../../error-response";
import { serviceErrorResponse } from "../../../../service-error";
import { pathParamsError } from "../../../../path-params";

export async function DELETE(_request: Request, context: { params: Promise<{ shotId: string; assetId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { shotId, assetId } = params;
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    if (liveProjectWritesEnabled()) {
      try {
        return NextResponse.json(await detachLiveImageFromShot(shotId, assetId));
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
    return NextResponse.json(detachImageFromShot(shotId, assetId));
  } catch (error) {
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
