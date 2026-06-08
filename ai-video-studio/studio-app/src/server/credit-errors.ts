import type { CostEstimate } from "../domain/types";

/**
 * 크레딧 예약 실패(잔액 부족) 에러.
 *
 * mock service와 live(Postgres) adapter가 공통으로 던진다. 어느 한쪽(특히 live adapter)이
 * 다른 쪽(mock service) 구현 파일을 import 하지 않도록 공통 서버 에러 모듈로 분리했다.
 * (외부 아키텍처 리뷰 2.3 — mock/live 경계 정리)
 *
 * estimate.credits 는 cost-policy 가 계산한 "사용자 청구 credit"이며, 이 에러는 그 값과 현재
 * 사용 가능 credit으로 부족분(shortfallCredits)만 패키징한다.
 */
export class CreditReservationError extends Error {
  estimate: CostEstimate;

  constructor(credits: number, availableCredits: number) {
    super("INSUFFICIENT_CREDITS");
    this.name = "CreditReservationError";
    this.estimate = {
      credits,
      etaSec: 0,
      availableCredits,
      affordable: false,
      shortfallCredits: Math.max(0, credits - availableCredits)
    };
  }
}

export function isCreditReservationError(error: unknown): error is CreditReservationError {
  return error instanceof CreditReservationError;
}
