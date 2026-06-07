import { NextResponse } from "next/server";
import { generateAll } from "@/server/mock-service";
import { generateAllLiveShots, liveProjectWritesEnabled, LivePersistenceUnavailableError } from "@/server/live-persistence-runtime";
import type { Tier } from "@/domain/types";
import { creditReservationResponse } from "../../../credit-error";
import { apiError } from "../../../error-response";
import { readJsonObject } from "../../../json-body";
import { serviceErrorResponse } from "../../../service-error";
import { pathParamsError } from "../../../path-params";

const validTiers = new Set<Tier>(["fast", "economy", "final"]);

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { projectId } = params;
  const body = await readJsonObject(request);
  if (!body) {
    return apiError("BAD_REQUEST", "요청 형식이 올바르지 않습니다.", 400);
  }
  const tierInput = body.tier;
  if (typeof tierInput !== "undefined" && (typeof tierInput !== "string" || !validTiers.has(tierInput as Tier))) {
    return apiError("BAD_REQUEST", "지원하지 않는 생성 품질입니다.", 400);
  }
  const tier = typeof tierInput === "string" ? (tierInput as Tier) : "fast";
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    if (liveProjectWritesEnabled()) {
      try {
        return NextResponse.json(await generateAllLiveShots(projectId, { tier }), { status: 202 });
      } catch (error) {
        if (error instanceof LivePersistenceUnavailableError) {
          return apiError("LIVE_PERSISTENCE_UNAVAILABLE", error.message, 503);
        }
        const creditResponse = creditReservationResponse(error);
        if (creditResponse) return creditResponse;
        const serviceResponse = serviceErrorResponse(error);
        if (serviceResponse) return serviceResponse;
        throw error;
      }
    }
    return apiError("MOCK_MUTATION_UNAVAILABLE", "Mock-backed work requests are not available in production mode.", 503);
  }
  try {
    return NextResponse.json(generateAll(projectId, { tier }), { status: 202 });
  } catch (error) {
    const creditResponse = creditReservationResponse(error);
    if (creditResponse) return creditResponse;
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
