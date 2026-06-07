import { NextResponse } from "next/server";
import { getLiveWorkerRetryPlan, liveProjectReadsEnabled, LivePersistenceUnavailableError } from "@/server/live-persistence-runtime";
import { getWorkerRetryPlan } from "@/server/worker-retries";
import { apiError } from "../../error-response";
import { requireSystemAccess } from "@/server/system-access";

export async function GET(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  if (liveProjectReadsEnabled()) {
    try {
      return NextResponse.json(await getLiveWorkerRetryPlan());
    } catch (error) {
      if (error instanceof LivePersistenceUnavailableError) {
        return apiError("LIVE_PERSISTENCE_UNAVAILABLE", error.message, 503);
      }
      throw error;
    }
  }
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    return apiError("MOCK_READ_UNAVAILABLE", "Mock-backed reads are not available in production mode.", 503);
  }
  return NextResponse.json(getWorkerRetryPlan());
}
