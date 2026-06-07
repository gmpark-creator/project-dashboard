import { NextResponse } from "next/server";
import { applyEdit } from "@/server/mock-service";
import { apiError } from "../../../error-response";
import { readJsonObject } from "../../../json-body";
import { serviceErrorResponse } from "../../../service-error";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const body = await readJsonObject(request);
  if (
    !body ||
    !Object.keys(body).every((key) => key === "command") ||
    (typeof body.command !== "undefined" && typeof body.command !== "string")
  ) {
    return apiError("BAD_REQUEST", "편집 명령 형식이 올바르지 않습니다.", 400);
  }
  try {
    return NextResponse.json(applyEdit(projectId, typeof body.command === "string" ? body.command : undefined));
  } catch (error) {
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
