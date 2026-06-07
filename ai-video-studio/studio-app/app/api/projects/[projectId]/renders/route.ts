import { NextResponse } from "next/server";
import { startRender } from "@/server/mock-service";
import type { ExportSpec } from "@/domain/types";
import { creditReservationResponse } from "../../../credit-error";
import { apiError } from "../../../error-response";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const body = (await request.json()) as { specs?: ExportSpec[] };
  if (!body.specs?.length) {
    return apiError("BAD_REQUEST", "내보내기 형식이 필요합니다.", 400);
  }
  try {
    return NextResponse.json(startRender(projectId, body.specs), { status: 202 });
  } catch (error) {
    const creditResponse = creditReservationResponse(error);
    if (creditResponse) return creditResponse;
    throw error;
  }
}
