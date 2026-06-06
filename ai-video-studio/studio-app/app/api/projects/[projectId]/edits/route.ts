import { NextResponse } from "next/server";
import { applyEdit } from "@/server/mock-service";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { command?: string };
  return NextResponse.json(applyEdit(projectId, body.command));
}
