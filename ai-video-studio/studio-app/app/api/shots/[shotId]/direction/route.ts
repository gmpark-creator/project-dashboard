import { NextResponse } from "next/server";
import { updateShotDirection } from "@/server/mock-service";
import type { DirectionSpec } from "@/domain/types";

export async function PATCH(request: Request, context: { params: Promise<{ shotId: string }> }) {
  const { shotId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as Partial<DirectionSpec>;
  return NextResponse.json(updateShotDirection(shotId, body));
}
