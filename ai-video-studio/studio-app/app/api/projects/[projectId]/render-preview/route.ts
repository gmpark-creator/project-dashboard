import { NextResponse } from "next/server";
import { previewRender } from "@/server/mock-service";
import { isExportSpec } from "../../../export-spec";
import { apiError } from "../../../error-response";
import { readJsonObject } from "../../../json-body";
import { serviceErrorResponse } from "../../../service-error";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const body = await readJsonObject(request);
  if (!body || !isExportSpec(body.spec)) {
    return apiError("BAD_REQUEST", "미리 점검할 내보내기 형식이 올바르지 않습니다.", 400);
  }
  try {
    return NextResponse.json(previewRender(projectId, body.spec));
  } catch (error) {
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
