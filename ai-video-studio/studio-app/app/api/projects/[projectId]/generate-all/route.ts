import { NextResponse } from "next/server";
import { generateAll } from "@/server/mock-service";
import type { Tier } from "@/domain/types";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { tier?: Tier };
  return NextResponse.json(generateAll(projectId, { tier: body.tier || "fast" }), { status: 202 });
}
