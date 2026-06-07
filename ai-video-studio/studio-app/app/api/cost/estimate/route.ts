import { NextResponse } from "next/server";
import { estimateCost } from "@/server/mock-service";
import { apiError } from "../../error-response";
import { isJsonObject, readJsonObject } from "../../json-body";

const validActions = new Set([
  "generateShot",
  "generateAll",
  "regenerate",
  "generateImages",
  "registerExternalImage",
  "upgradeTake",
  "startRender"
]);

export async function POST(request: Request) {
  const body = await readJsonObject(request);
  if (!body || typeof body.action !== "string" || !validActions.has(body.action)) {
    return apiError("BAD_REQUEST", "비용을 계산할 작업이 필요합니다.", 400);
  }
  if (typeof body.params !== "undefined" && !isJsonObject(body.params)) {
    return apiError("BAD_REQUEST", "비용 계산 파라미터 형식이 올바르지 않습니다.", 400);
  }
  const takeCount = body.params?.takeCount;
  if (typeof takeCount !== "undefined" && (typeof takeCount !== "number" || !Number.isInteger(takeCount) || takeCount < 1)) {
    return apiError("BAD_REQUEST", "생성 후보 수는 1개 이상의 정수여야 합니다.", 400);
  }
  return NextResponse.json(estimateCost(body.action, typeof takeCount === "number" ? { takeCount } : undefined));
}
