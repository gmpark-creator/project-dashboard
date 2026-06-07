import { NextResponse } from "next/server";
import { regenerate } from "@/server/mock-service";
import { creditReservationResponse } from "../../../credit-error";

export async function POST(request: Request, context: { params: Promise<{ shotId: string }> }) {
  const { shotId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { scope?: "shot" | "segment"; tweaks?: string };
  try {
    return NextResponse.json(regenerate(shotId, { scope: body.scope || "shot", tweaks: body.tweaks }), { status: 202 });
  } catch (error) {
    const creditResponse = creditReservationResponse(error);
    if (creditResponse) return creditResponse;
    throw error;
  }
}
