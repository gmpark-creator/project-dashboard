import { NextResponse } from "next/server";
import {
  createLiveWorkerLease,
  getLiveWorkerLeaseSnapshot,
  liveProjectReadsEnabled,
  liveProjectWritesEnabled,
  LivePersistenceUnavailableError
} from "@/server/live-persistence-runtime";
import { createWorkerLease, getWorkerLeaseSnapshot } from "@/server/worker-leases";
import type { WorkerDispatchKind, WorkerLeaseRequest } from "@/domain/types";
import { apiError } from "../../error-response";
import { readJsonObject } from "../../json-body";
import { requireSystemAccess } from "@/server/system-access";

const validKinds = new Set<WorkerDispatchKind | "any">(["provider_generation", "image_generation", "render", "any"]);

export async function GET(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  if (liveProjectReadsEnabled()) {
    try {
      return NextResponse.json(await getLiveWorkerLeaseSnapshot());
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
  const leaseRequest: Partial<WorkerLeaseRequest> = {
    workerId: typeof body.workerId === "string" ? body.workerId : undefined,
    kind: typeof body.kind === "string" ? (body.kind as WorkerLeaseRequest["kind"]) : undefined,
    ttlSec: typeof body.ttlSec === "number" ? body.ttlSec : undefined
  };
  if (liveProjectWritesEnabled()) {
    try {
      const result = await createLiveWorkerLease(leaseRequest);
      return NextResponse.json(result, { status: result.lease ? 201 : 200 });
    } catch (error) {
      if (error instanceof LivePersistenceUnavailableError) {
        return apiError("LIVE_PERSISTENCE_UNAVAILABLE", error.message, 503);
      }
      throw error;
    }
  }
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    return apiError("MOCK_MUTATION_UNAVAILABLE", "Mock-backed work requests are not available in production mode.", 503);
  }
  const result = createWorkerLease(leaseRequest);
  return NextResponse.json(result, { status: result.lease ? 201 : 200 });
}
