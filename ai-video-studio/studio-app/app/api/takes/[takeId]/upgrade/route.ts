import { NextResponse } from "next/server";
import { upgradeTake } from "@/server/mock-service";

export async function POST(request: Request, context: { params: Promise<{ takeId: string }> }) {
  const { takeId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { mode?: "final_regenerate" | "enhance" | "render_upscale" };
  return NextResponse.json(upgradeTake(takeId, { mode: body.mode || "final_regenerate" }), { status: 202 });
}
