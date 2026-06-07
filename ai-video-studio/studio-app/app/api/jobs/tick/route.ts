import { NextResponse } from "next/server";
import { getJobQueueSnapshot } from "@/server/queue-snapshot";
import { apiError } from "../../error-response";

export function POST() {
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    return apiError("MOCK_TICK_UNAVAILABLE", "Mock job ticking is not available in production mode.", 503);
  }
  return NextResponse.json(getJobQueueSnapshot());
}
