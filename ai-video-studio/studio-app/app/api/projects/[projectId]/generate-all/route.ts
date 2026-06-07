import { NextResponse } from "next/server";
import { generateAll } from "@/server/mock-service";
import type { Tier } from "@/domain/types";
import { creditReservationResponse } from "../../../credit-error";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { tier?: Tier };
  try {
    return NextResponse.json(generateAll(projectId, { tier: body.tier || "fast" }), { status: 202 });
  } catch (error) {
    const creditResponse = creditReservationResponse(error);
    if (creditResponse) return creditResponse;
    throw error;
  }
}
