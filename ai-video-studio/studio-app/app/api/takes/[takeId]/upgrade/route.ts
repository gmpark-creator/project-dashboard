import { NextResponse } from "next/server";
import { upgradeTake } from "@/server/mock-service";
import { liveProjectWritesEnabled, LivePersistenceUnavailableError, upgradeLiveTake } from "@/server/live-persistence-runtime";
import type { Take } from "@/domain/types";
import { creditReservationResponse } from "../../../credit-error";
import { apiError } from "../../../error-response";
import { readJsonObject } from "../../../json-body";
import { serviceErrorResponse } from "../../../service-error";
import { pathParamsError } from "../../../path-params";

type UpgradeMode = NonNullable<Take["upgradeMode"]>;
type UpgradeRequestMode = UpgradeMode | "auto";

const validUpgradeModes = new Set<UpgradeRequestMode>(["auto", "final_regenerate", "enhance", "render_upscale"]);

export async function POST(request: Request, context: { params: Promise<{ takeId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { takeId } = params;
  const body = await readJsonObject(request);
  if (!body) {
    return apiError("BAD_REQUEST", "요청 형식이 올바르지 않습니다.", 400);
  }
  const modeInput = body.mode;
  if (typeof modeInput !== "undefined" && (typeof modeInput !== "string" || !validUpgradeModes.has(modeInput as UpgradeRequestMode))) {
    return apiError("BAD_REQUEST", "지원하지 않는 승급 모드입니다.", 400);
  }
  const mode = modeInput === "auto" || typeof modeInput === "undefined" ? undefined : (modeInput as UpgradeMode);
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    if (liveProjectWritesEnabled()) {
      try {
        return NextResponse.json(await upgradeLiveTake(takeId, { mode }), { status: 202 });
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
    return NextResponse.json(upgradeTake(takeId, { mode }), { status: 202 });
  } catch (error) {
    const creditResponse = creditReservationResponse(error);
    if (creditResponse) return creditResponse;
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
