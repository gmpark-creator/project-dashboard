import { NextResponse } from "next/server";
import { getProjectBundle } from "@/server/mock-service";
import { apiError } from "../../error-response";

export async function GET(_request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const bundle = getProjectBundle(projectId);
  if (!bundle) {
    return apiError("NOT_FOUND", "프로젝트를 찾을 수 없습니다.", 404);
  }
  return NextResponse.json(bundle);
}
