import { NextResponse } from "next/server";
import { getLiveWorkerDispatchSnapshot, liveProjectReadsEnabled, LivePersistenceUnavailableError } from "@/server/live-persistence-runtime";
import { getWorkerDispatchSnapshot } from "@/server/worker-dispatch";
import { requireSystemAccess } from "@/server/system-access";
import { apiError } from "../../error-response";

export async function GET(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  if (liveProjectReadsEnabled()) {
    try {
      return NextResponse.json(await getLiveWorkerDispatchSnapshot());
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
  return NextResponse.json(getWorkerDispatchSnapshot());
}
