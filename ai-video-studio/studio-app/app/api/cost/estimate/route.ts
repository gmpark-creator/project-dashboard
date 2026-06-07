import { NextResponse } from "next/server";
import { estimateCost } from "@/server/mock-service";
import { apiError } from "../../error-response";

export async function POST(request: Request) {
  const body = (await request.json()) as { action?: string; params?: { takeCount?: number } };
  if (!body.action) {
    return apiError("BAD_REQUEST", "비용을 계산할 작업이 필요합니다.", 400);
  }
  return NextResponse.json(estimateCost(body.action, body.params));
}
