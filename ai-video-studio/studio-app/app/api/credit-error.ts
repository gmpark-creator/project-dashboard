import { NextResponse } from "next/server";
import { isCreditReservationError } from "@/server/mock-service";

export function creditReservationResponse(error: unknown) {
  if (!isCreditReservationError(error)) return null;
  return NextResponse.json(
    {
      code: "INSUFFICIENT_CREDITS",
      userMessage: "사용 가능한 크레딧이 부족합니다.",
      retryable: false,
      fallbackSuggested: false,
      estimate: error.estimate
    },
    { status: 402 }
  );
}
