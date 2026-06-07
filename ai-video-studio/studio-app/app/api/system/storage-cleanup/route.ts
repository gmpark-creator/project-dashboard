import { NextResponse } from "next/server";
import { executeStorageCleanup, getStorageCleanupPlan } from "@/server/storage-cleanup";
import { requireSystemAccess } from "@/server/system-access";
import { ObjectStorageUnavailableError } from "@/server/object-storage";
import { apiError } from "../../error-response";
import { readJsonObject } from "../../json-body";

export function GET(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  return NextResponse.json(getStorageCleanupPlan());
}

export async function POST(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  const body = await readJsonObject(request);
  if (!body) {
    return apiError("BAD_REQUEST", "요청 형식이 올바르지 않습니다.", 400);
  }
  if (
    typeof body.limit !== "undefined" &&
    (typeof body.limit !== "number" || !Number.isInteger(body.limit) || body.limit < 0)
  ) {
    return apiError("BAD_REQUEST", "정리 개수 제한은 0 이상의 정수여야 합니다.", 400);
  }
  try {
    return NextResponse.json(await executeStorageCleanup({ limit: typeof body.limit === "number" ? body.limit : undefined }));
  } catch (error) {
    if (error instanceof ObjectStorageUnavailableError) {
      return apiError("OBJECT_STORAGE_UNAVAILABLE", "Object storage deletion is not available for this runtime.", 503);
    }
    throw error;
  }
}
