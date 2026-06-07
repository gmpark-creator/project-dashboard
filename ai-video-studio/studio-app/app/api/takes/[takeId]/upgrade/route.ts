import { NextResponse } from "next/server";
import { upgradeTake } from "@/server/mock-service";
import { creditReservationResponse } from "../../../credit-error";

export async function POST(request: Request, context: { params: Promise<{ takeId: string }> }) {
  const { takeId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { mode?: "final_regenerate" | "enhance" | "render_upscale" };
  try {
    return NextResponse.json(upgradeTake(takeId, { mode: body.mode || "final_regenerate" }), { status: 202 });
  } catch (error) {
    const creditResponse = creditReservationResponse(error);
    if (creditResponse) return creditResponse;
    throw error;
  }
}
