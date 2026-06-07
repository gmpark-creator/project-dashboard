import { NextResponse } from "next/server";
import { updateShotDirection } from "@/server/mock-service";
import type { DirectionSpec } from "@/domain/types";
import { apiError } from "../../../error-response";
import { readJsonObject } from "../../../json-body";

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
  const { shotId } = await context.params;
  const body = await readJsonObject(request);
  if (!body || !isDirectionPatch(body)) {
    return apiError("BAD_REQUEST", "연출 설정 형식이 올바르지 않습니다.", 400);
  }
  return NextResponse.json(updateShotDirection(shotId, body));
}
