import { buildCostEstimate, type CostAction, type CostParams } from "../domain/cost-policy";
import type { CostEstimate } from "../domain/types";
import { availableMockCredits } from "./mock-service";
import { getLiveProjectBundle, liveProjectReadsEnabled } from "./live-persistence-runtime";

/**
 * 비용 견적 해석 중 발생하는, 사용자에게 안전하게 노출 가능한 에러.
 * code/status를 담아 route가 그대로 HTTP 응답으로 바꾼다. 내부 식별자/원시 에러는 담지 않는다.
 */
export class CostEstimateError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "CostEstimateError";
    this.code = code;
    this.status = status;
  }
}

function isProductionRuntime() {
  return process.env.CUTPILOT_RUNTIME_MODE === "production";
}

/**
 * 비용 견적을 실행 모드에 맞게 해석한다. 비용 자체는 어느 모드든 동일한 cost-policy를 쓰고,
 * 달라지는 것은 "사용 가능 credit"의 출처와 fail-closed 경계뿐이다.
 *
 * - live reads ON: 실제 프로젝트 계정(live bundle)으로 계산. projectId 필수(없으면 fail-closed 400).
 * - production runtime인데 live reads OFF: mock 전역 상태로 폴백하지 않고 fail-closed(503).
 * - mock/dev: 전역 mock 사용 가능 credit으로 계산.
 */
export async function resolveCostEstimate(
  action: CostAction,
  params: CostParams,
  projectId?: string
): Promise<CostEstimate> {
  if (liveProjectReadsEnabled()) {
    if (!projectId) {
      throw new CostEstimateError("PROJECT_REQUIRED", "프로덕션 비용 견적에는 projectId가 필요합니다.", 400);
    }
    const bundle = await getLiveProjectBundle(projectId);
    if (!bundle) {
      throw new CostEstimateError("PROJECT_NOT_FOUND", "프로젝트를 찾을 수 없습니다.", 404);
    }
    const available = Math.max(0, bundle.credits.balance - bundle.credits.spent - bundle.credits.reserved);
    return buildCostEstimate(action, params, available);
  }

  if (isProductionRuntime()) {
    throw new CostEstimateError(
      "LIVE_PERSISTENCE_REQUIRED",
      "프로덕션 비용 견적에는 라이브 영속성(CUTPILOT_ENABLE_LIVE_READS)이 필요합니다.",
      503
    );
  }

  return buildCostEstimate(action, params, availableMockCredits());
}
