import { NextResponse } from "next/server";
import { updateStoryboard } from "@/server/mock-service";
import type { Scene, Shot } from "@/domain/types";

export async function PUT(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    scenes?: Array<Partial<Scene> & { id?: string }>;
    shots?: Array<Partial<Shot> & { id?: string }>;
  };
  return NextResponse.json(updateStoryboard(projectId, body));
}
