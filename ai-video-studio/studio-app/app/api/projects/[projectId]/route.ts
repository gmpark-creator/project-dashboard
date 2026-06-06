import { NextResponse } from "next/server";
import { getProjectBundle } from "@/server/mock-service";

export async function GET(_request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const bundle = getProjectBundle(projectId);
  if (!bundle) {
    return NextResponse.json({ code: "NOT_FOUND", userMessage: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json(bundle);
}
