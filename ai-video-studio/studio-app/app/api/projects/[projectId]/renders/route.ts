import { NextResponse } from "next/server";
import { startRender } from "@/server/mock-service";
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
