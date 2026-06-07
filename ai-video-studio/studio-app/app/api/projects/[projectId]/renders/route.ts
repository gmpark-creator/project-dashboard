import { NextResponse } from "next/server";
import { startRender } from "@/server/mock-service";
import { liveProjectWritesEnabled, LivePersistenceUnavailableError, startLiveRender } from "@/server/live-persistence-runtime";
import type { ExportSpec } from "@/domain/types";
import { creditReservationResponse } from "../../../credit-error";
import { apiError } from "../../../error-response";
import { isExportSpec } from "../../../export-spec";
import { readJsonObject } from "../../../json-body";
import { serviceErrorResponse } from "../../../service-error";
import { pathParamsError } from "../../../path-params";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { projectId } = params;
  const body = await readJsonObject(request);
  const specs = body?.specs;
  if (!Array.isArray(specs) || specs.length === 0 || !specs.every(isExportSpec)) {
    return apiError("BAD_REQUEST", "내보내기 형식이 올바르지 않습니다.", 400);
  }
  const exportSpecs = specs as ExportSpec[];
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    if (liveProjectWritesEnabled()) {
      try {
        return NextResponse.json(await startLiveRender(projectId, { specs: exportSpecs }), { status: 202 });
      } catch (error) {
        if (error instanceof LivePersistenceUnavailableError) {
          return apiError("LIVE_PERSISTENCE_UNAVAILABLE", error.message, 503);
        }
        const creditResponse = creditReservationResponse(error);
        if (creditResponse) return creditResponse;
        const serviceResponse = serviceErrorResponse(error);
        if (serviceResponse) return serviceResponse;
        throw error;
      }
    }
    return apiError("MOCK_MUTATION_UNAVAILABLE", "Mock-backed work requests are not available in production mode.", 503);
  }
  try {
    return NextResponse.json(startRender(projectId, exportSpecs), { status: 202 });
  } catch (error) {
    const creditResponse = creditReservationResponse(error);
    if (creditResponse) return creditResponse;
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
