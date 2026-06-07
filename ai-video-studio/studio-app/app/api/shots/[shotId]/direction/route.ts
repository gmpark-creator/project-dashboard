import { NextResponse } from "next/server";
import { updateShotDirection } from "@/server/mock-service";
import { liveProjectWritesEnabled, LivePersistenceUnavailableError, updateLiveShotDirection } from "@/server/live-persistence-runtime";
import type { DirectionSpec } from "@/domain/types";
import { apiError } from "../../../error-response";
import { readJsonObject } from "../../../json-body";
import { serviceErrorResponse } from "../../../service-error";
import { pathParamsError } from "../../../path-params";

const directionKeys = new Set(["camera", "composition", "lighting", "motion", "style", "avoid", "notes"]);
const stringDirectionKeys = new Set(["camera", "composition", "lighting", "motion", "style", "notes"]);

function isDirectionPatch(value: Record<string, unknown>): value is Partial<DirectionSpec> {
  if (!Object.keys(value).every((key) => directionKeys.has(key))) return false;
  for (const key of stringDirectionKeys) {
    if (typeof value[key] !== "undefined" && typeof value[key] !== "string") return false;
  }
  return (
    typeof value.avoid === "undefined" ||
    (Array.isArray(value.avoid) && value.avoid.every((item) => typeof item === "string"))
  );
}

export async function PATCH(request: Request, context: { params: Promise<{ shotId: string }> }) {
  const params = await context.params;
  const pathError = pathParamsError(params);
  if (pathError) return pathError;
  const { shotId } = params;
  const body = await readJsonObject(request);
  if (!body || !isDirectionPatch(body)) {
    return apiError("BAD_REQUEST", "연출 설정 형식이 올바르지 않습니다.", 400);
  }
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    if (liveProjectWritesEnabled()) {
      try {
        return NextResponse.json(await updateLiveShotDirection(shotId, body));
      } catch (error) {
        if (error instanceof LivePersistenceUnavailableError) {
          return apiError("LIVE_PERSISTENCE_UNAVAILABLE", error.message, 503);
        }
        const serviceResponse = serviceErrorResponse(error);
        if (serviceResponse) return serviceResponse;
        throw error;
      }
    }
    return apiError("MOCK_MUTATION_UNAVAILABLE", "Mock-backed state changes are not available in production mode.", 503);
  }
  try {
    return NextResponse.json(updateShotDirection(shotId, body));
  } catch (error) {
    const serviceResponse = serviceErrorResponse(error);
    if (serviceResponse) return serviceResponse;
    throw error;
  }
}
