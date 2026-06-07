import { NextResponse } from "next/server";
import { createWorkerLease, getWorkerLeaseSnapshot } from "@/server/worker-leases";
import type { WorkerDispatchKind, WorkerLeaseRequest } from "@/domain/types";
import { apiError } from "../../error-response";
import { readJsonObject } from "../../json-body";
import { requireSystemAccess } from "@/server/system-access";

const validKinds = new Set<WorkerDispatchKind | "any">(["provider_generation", "image_generation", "render", "any"]);

export function GET(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  return NextResponse.json(getWorkerLeaseSnapshot());
}

export async function POST(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  const body = await readJsonObject(request);
  if (!body) {
    return apiError("BAD_REQUEST", "요청 형식이 올바르지 않습니다.", 400);
  }
  if (typeof body.workerId !== "undefined" && typeof body.workerId !== "string") {
    return apiError("BAD_REQUEST", "workerId는 문자열이어야 합니다.", 400);
  }
  if (
    typeof body.kind !== "undefined" &&
    (typeof body.kind !== "string" || !validKinds.has(body.kind as WorkerDispatchKind | "any"))
  ) {
    return apiError("BAD_REQUEST", "지원하지 않는 worker lease 종류입니다.", 400);
  }
  if (
    typeof body.ttlSec !== "undefined" &&
    (typeof body.ttlSec !== "number" || !Number.isInteger(body.ttlSec) || body.ttlSec < 5 || body.ttlSec > 600)
  ) {
    return apiError("BAD_REQUEST", "worker lease TTL은 5초 이상 600초 이하의 정수여야 합니다.", 400);
  }
  const result = createWorkerLease(body as Partial<WorkerLeaseRequest>);
  return NextResponse.json(result, { status: result.lease ? 201 : 200 });
}
