import { NextResponse } from "next/server";
import { selectTake } from "@/server/mock-service";
import { apiError } from "../../../error-response";
import { readJsonObject } from "../../../json-body";
import { serviceErrorResponse } from "../../../service-error";
import { pathParamsError } from "../../../path-params";

export async function POST(request: Request, context: { params: Promise<{ shotId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { shotId } = params;
  const body = await readJsonObject(request);
  if (!body || typeof body.takeId !== "string" || !body.takeId.startsWith("tak_")) {
    return apiError("BAD_REQUEST", "선택할 후보가 필요합니다.", 400);
  }
  try {
    return NextResponse.json(selectTake(shotId, body.takeId));
  } catch (error) {
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
