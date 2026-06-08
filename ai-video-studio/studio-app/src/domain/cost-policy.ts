import type { CostEstimate } from "./types";

/**
 * 비용/크레딧 단일 출처 (single source of truth).
 *
 * 사용자에게 노출되는 credit(⚡) 비용은 오직 이 모듈에서만 계산한다. mock service 예약,
 * live(Postgres) adapter 예약, `/api/cost/estimate`, UI 표시, OpenAPI 문서, 테스트가 전부
 * 같은 함수를 참조해야 estimate == reservation == 표시값 불변식이 깨지지 않는다.
 *
 * 과거 문제(design/35-claude-r27-cost-model-reconciliation-blocker.md):
 * - estimate 테이블은 generateShot 비용에 takeCount를 한 번 더 곱해 18 대신 54를 반환했다.
 * - generateAll estimate는 컷 수와 무관한 flat 96이었지만 실제 예약은 컷당 18로 180이었다.
 * - generateImages/startRender estimate도 count와 무관한 flat 값이었다.
 * 이 모듈은 그 숫자들을 "예약(reservation)이 실제로 차감하는 값" 기준으로 단일화한다.
 */

/** 단위당 credit 단가. 예약/확정/환불/estimate/UI가 모두 이 상수를 쓴다. */
export const CREDIT_COST = {
  /** 영상 컷 take 1개 생성 */
  videoTake: 6,
  /** 이미지 후보 1장 생성 */
  imageVariant: 4,
  /** 렌더(내보내기) 스펙 1개 */
  render: 16,
  /** 게시용 품질 승급(고정 단가) */
  upgradeTake: 22,
} as const;

/** generateShot/generateAll 기본 take 수 */
export const DEFAULT_TAKE_COUNT = 3;
/** generateShot이 허용하는 최대 take 수 */
export const MAX_TAKE_COUNT = 3;
/** regenerate가 만드는 take 수 */
export const REGENERATE_TAKE_COUNT = 2;
/** 이미지 후보 기본 장수 */
export const DEFAULT_IMAGE_COUNT = 4;
/** 이미지 후보 최대 장수 */
export const MAX_IMAGE_COUNT = 4;
/** startRender 기본 렌더 스펙 수 */
export const DEFAULT_RENDER_COUNT = 1;
/** 표준 내보내기가 만드는 렌더 컷 수(6s/15s/30s). render preview/UI의 전체 내보내기 비용 표시 기준. */
export const DEFAULT_EXPORT_RENDER_COUNT = 3;
/** 한 프로젝트의 대략적 credit 예산 힌트(estimateRemaining 표시용). 액션 비용이 아니라 진척 표시용 가정값이다. */
export const TYPICAL_PROJECT_CREDIT_BUDGET = 180;

export type CostAction =
  | "generateShot"
  | "generateAll"
  | "regenerate"
  | "generateImages"
  | "registerExternalImage"
  | "upgradeTake"
  | "startRender";

export const COST_ACTIONS: readonly CostAction[] = [
  "generateShot",
  "generateAll",
  "regenerate",
  "generateImages",
  "registerExternalImage",
  "upgradeTake",
  "startRender",
];

export function isCostAction(value: unknown): value is CostAction {
  return typeof value === "string" && (COST_ACTIONS as readonly string[]).includes(value);
}

/**
 * 비용 계산 파라미터. 모든 필드는 선택이며, 액션이 실제로 사용하는 것만 의미를 가진다.
 * - takeCount: generateShot (1..MAX_TAKE_COUNT)
 * - shotCount: generateAll (해당 프로젝트의 생성 대상 컷 수)
 * - imageCount: generateImages (1..MAX_IMAGE_COUNT)
 * - renderCount: startRender (선택된 렌더 스펙 수)
 */
export type CostParams = {
  takeCount?: number;
  shotCount?: number;
  imageCount?: number;
  renderCount?: number;
};

function toClampedInt(value: number | undefined, fallback: number, min: number, max: number): number {
  const raw = typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : fallback;
  return Math.max(min, Math.min(raw, max));
}

function toNonNegativeInt(value: number | undefined, fallback: number): number {
  const raw = typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : fallback;
  return Math.max(0, raw);
}

/**
 * 액션 + 파라미터에 대해 "사용자가 실제로 예약/확정 청구받는" credit 수를 반환한다.
 * 이 값이 곧 reservation이 차감하는 값이고 UI가 표시해야 하는 값이다.
 */
export function creditCostForAction(action: CostAction, params: CostParams = {}): number {
  switch (action) {
    case "generateShot": {
      const takeCount = toClampedInt(params.takeCount, DEFAULT_TAKE_COUNT, 1, MAX_TAKE_COUNT);
      return takeCount * CREDIT_COST.videoTake;
    }
    case "generateAll": {
      // 컷마다 DEFAULT_TAKE_COUNT개의 take를 생성하므로 컷당 generateShot 1회와 동일하다.
      const shotCount = toNonNegativeInt(params.shotCount, 0);
      return shotCount * DEFAULT_TAKE_COUNT * CREDIT_COST.videoTake;
    }
    case "regenerate":
      return REGENERATE_TAKE_COUNT * CREDIT_COST.videoTake;
    case "generateImages": {
      const imageCount = toClampedInt(params.imageCount, DEFAULT_IMAGE_COUNT, 1, MAX_IMAGE_COUNT);
      return imageCount * CREDIT_COST.imageVariant;
    }
    case "registerExternalImage":
      // 외부 이미지 등록은 생성 비용이 없다.
      return 0;
    case "upgradeTake":
      return CREDIT_COST.upgradeTake;
    case "startRender": {
      const renderCount = Math.max(1, toNonNegativeInt(params.renderCount, DEFAULT_RENDER_COUNT));
      return renderCount * CREDIT_COST.render;
    }
  }
}

/** 액션별 예상 소요 시간(초). estimate 표시용이며 비용 정산과 무관하다. */
export function etaForAction(action: CostAction): number {
  return action === "startRender" ? 90 : 25;
}

/**
 * 사용 가능 credit을 받아 완전한 CostEstimate를 만든다(순수 함수).
 * availableCredits 출처(mock 전역 상태 / live 프로젝트 계정)는 호출자가 결정하고,
 * 비용 계산은 항상 동일 정책을 쓴다.
 */
export function buildCostEstimate(action: CostAction, params: CostParams, availableCredits: number): CostEstimate {
  const credits = creditCostForAction(action, params);
  const available = Math.max(0, Math.floor(availableCredits));
  return {
    credits,
    etaSec: etaForAction(action),
    availableCredits: available,
    affordable: available >= credits,
    shortfallCredits: Math.max(0, credits - available),
  };
}
