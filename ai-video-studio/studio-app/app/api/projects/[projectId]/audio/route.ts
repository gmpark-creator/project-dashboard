import { NextResponse } from "next/server";
import { setAudio } from "@/server/mock-service";
import type { EditState } from "@/domain/types";

export async function PUT(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as Partial<EditState>;
  return NextResponse.json(setAudio(projectId, body));
}
