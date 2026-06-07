import { NextResponse } from "next/server";
import { renewWorkerLease } from "@/server/worker-leases";
import { apiError } from "../../../../error-response";
import { readJsonObject } from "../../../../json-body";
import { requireSystemAccess } from "@/server/system-access";

export async function POST(request: Request, context: { params: Promise<{ leaseId: string }> }) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  const { leaseId } = await context.params;
  const body = await readJsonObject(request);
  if (!body || typeof body.token !== "string") {
    return apiError("BAD_REQUEST", "worker lease token이 필요합니다.", 400);
  }
  if (
    typeof body.ttlSec !== "undefined" &&
    (typeof body.ttlSec !== "number" || !Number.isInteger(body.ttlSec) || body.ttlSec < 5 || body.ttlSec > 600)
  ) {
    return apiError("BAD_REQUEST", "worker lease TTL은 5초 이상 600초 이하의 정수여야 합니다.", 400);
  }
  const result = renewWorkerLease(leaseId, {
    token: body.token,
    ttlSec: typeof body.ttlSec === "number" ? body.ttlSec : undefined
  });
  const status = result.renewed ? 200 : result.reason === "not_found" ? 404 : 409;
  return NextResponse.json(result, { status });
}
