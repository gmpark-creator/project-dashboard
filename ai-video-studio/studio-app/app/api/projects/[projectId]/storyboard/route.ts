import { NextResponse } from "next/server";
import { updateStoryboard } from "@/server/mock-service";
import { apiError } from "../../../error-response";
import { readJsonObject } from "../../../json-body";
import { isStoryboardUpdatePatch } from "../../../storyboard-validation";

export async function PUT(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const body = await readJsonObject(request);
  if (!body || !isStoryboardUpdatePatch(body)) {
    return apiError("BAD_REQUEST", "스토리보드 수정 형식이 올바르지 않습니다.", 400);
  }
  return NextResponse.json(updateStoryboard(projectId, body));
}
