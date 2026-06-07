import { NextResponse } from "next/server";
import { setDefaultRender } from "@/server/mock-service";
import { apiError } from "../../../error-response";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { renderJobId?: string };
  if (!body.renderJobId) {
    return apiError("BAD_REQUEST", "기본 버전으로 지정할 렌더가 필요합니다.", 400);
  }
  return NextResponse.json(setDefaultRender(projectId, body.renderJobId));
}
