import { NextResponse } from "next/server";
import { generateShot } from "@/server/mock-service";
import type { Tier } from "@/domain/types";

export async function POST(request: Request, context: { params: Promise<{ shotId: string }> }) {
  const { shotId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { tier?: Tier; takeCount?: number };
  return NextResponse.json(generateShot(shotId, { tier: body.tier || "fast", takeCount: body.takeCount || 3 }), { status: 202 });
}
