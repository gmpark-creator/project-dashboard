import { NextResponse } from "next/server";
import { selectTake } from "@/server/mock-service";
import { apiError } from "../../../error-response";

export async function POST(request: Request, context: { params: Promise<{ shotId: string }> }) {
  const { shotId } = await context.params;
  const body = (await request.json()) as { takeId?: string };
  if (!body.takeId) {
    return apiError("BAD_REQUEST", "선택할 후보가 필요합니다.", 400);
  }
  return NextResponse.json(selectTake(shotId, body.takeId));
}
