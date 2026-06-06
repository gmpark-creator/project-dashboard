import { NextResponse } from "next/server";
import { regenerate } from "@/server/mock-service";

export async function POST(request: Request, context: { params: Promise<{ shotId: string }> }) {
  const { shotId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { scope?: "shot" | "segment"; tweaks?: string };
  return NextResponse.json(regenerate(shotId, { scope: body.scope || "shot", tweaks: body.tweaks }), { status: 202 });
}
