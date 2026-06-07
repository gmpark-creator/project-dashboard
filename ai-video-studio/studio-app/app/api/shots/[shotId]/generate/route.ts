import { NextResponse } from "next/server";
import { generateShot } from "@/server/mock-service";
import type { Tier } from "@/domain/types";
import { creditReservationResponse } from "../../../credit-error";
import { apiError } from "../../../error-response";
import { readJsonObject } from "../../../json-body";
import { serviceErrorResponse } from "../../../service-error";

const validTiers = new Set<Tier>(["fast", "economy", "final"]);

export async function POST(request: Request, context: { params: Promise<{ shotId: string }> }) {
  const { shotId } = await context.params;
  const body = await readJsonObject(request);
  if (!body) {
    return apiError("BAD_REQUEST", "요청 형식이 올바르지 않습니다.", 400);
  }
  const tierInput = body.tier;
  if (typeof tierInput !== "undefined" && (typeof tierInput !== "string" || !validTiers.has(tierInput as Tier))) {
    return apiError("BAD_REQUEST", "지원하지 않는 생성 품질입니다.", 400);
  }
  const takeCountInput = body.takeCount;
  if (
    typeof takeCountInput !== "undefined" &&
    (typeof takeCountInput !== "number" || !Number.isInteger(takeCountInput) || takeCountInput < 1 || takeCountInput > 3)
  ) {
    return apiError("BAD_REQUEST", "생성 후보 수는 1개 이상 3개 이하의 정수여야 합니다.", 400);
  }
  const tier = typeof tierInput === "string" ? (tierInput as Tier) : "fast";
  const takeCount = typeof takeCountInput === "number" ? takeCountInput : 3;
  try {
    return NextResponse.json(generateShot(shotId, { tier, takeCount }), { status: 202 });
  } catch (error) {
    const creditResponse = creditReservationResponse(error);
    if (creditResponse) return creditResponse;
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
