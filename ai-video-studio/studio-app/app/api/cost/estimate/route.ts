import { NextResponse } from "next/server";
import { isCostAction, type CostParams } from "@/domain/cost-policy";
import { resolveCostEstimate, CostEstimateError } from "@/server/cost-estimate";
import { apiError } from "../../error-response";
import { isJsonObject, readJsonObject } from "../../json-body";

// 비용 계산 수치 파라미터. 액션이 실제 사용하는 것만 의미를 가진다(takeCount=generateShot,
// shotCount=generateAll, imageCount=generateImages, renderCount=startRender).
const COUNT_PARAM_KEYS = ["takeCount", "shotCount", "imageCount", "renderCount"] as const;

export async function POST(request: Request) {
  const body = await readJsonObject(request);
  if (!body || !isCostAction(body.action)) {
    return apiError("BAD_REQUEST", "비용을 계산할 작업이 필요합니다.", 400);
  }
  if (typeof body.params !== "undefined" && !isJsonObject(body.params)) {
    return apiError("BAD_REQUEST", "비용 계산 파라미터 형식이 올바르지 않습니다.", 400);
  }

  const rawParams = isJsonObject(body.params) ? body.params : {};
  const params: CostParams = {};
  for (const key of COUNT_PARAM_KEYS) {
    const value = rawParams[key];
    if (typeof value === "undefined") continue;
    if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
      return apiError("BAD_REQUEST", "비용 계산 수치는 1 이상의 정수여야 합니다.", 400);
    }
    params[key] = value;
  }

  if (typeof body.projectId !== "undefined" && typeof body.projectId !== "string") {
    return apiError("BAD_REQUEST", "projectId 형식이 올바르지 않습니다.", 400);
  }
  const projectId = typeof body.projectId === "string" ? body.projectId : undefined;

  try {
    const estimate = await resolveCostEstimate(body.action, params, projectId);
    return NextResponse.json(estimate);
  } catch (error) {
    // 사용자에게 안전한 견적 에러는 그대로 매핑. 그 외(라이브 영속성 장애 등)는 fail-closed 503.
    if (error instanceof CostEstimateError) {
      return apiError(error.code, error.message, error.status);
    }
    return apiError("COST_ESTIMATE_UNAVAILABLE", "비용을 계산할 수 없습니다. 잠시 후 다시 시도해 주세요.", 503);
  }
}
