import { NextResponse } from "next/server";
import { setDefaultRender } from "@/server/mock-service";
import { apiError } from "../../../error-response";
import { readJsonObject } from "../../../json-body";
import { serviceErrorResponse } from "../../../service-error";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const body = await readJsonObject(request);
  if (!body || typeof body.renderJobId !== "string" || !body.renderJobId.startsWith("rnd_")) {
    return apiError("BAD_REQUEST", "기본 버전으로 지정할 렌더가 필요합니다.", 400);
  }
  try {
    return NextResponse.json(setDefaultRender(projectId, body.renderJobId));
  } catch (error) {
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
