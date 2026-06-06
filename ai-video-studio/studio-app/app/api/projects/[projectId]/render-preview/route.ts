import { NextResponse } from "next/server";
import { previewRender } from "@/server/mock-service";
import type { ExportSpec } from "@/domain/types";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { spec?: ExportSpec };
  if (!body.spec) {
    return NextResponse.json({ code: "BAD_REQUEST", userMessage: "미리 점검할 내보내기 형식이 필요합니다." }, { status: 400 });
  }
  return NextResponse.json(previewRender(projectId, body.spec));
}
