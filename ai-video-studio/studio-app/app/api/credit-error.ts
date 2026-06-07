import { NextResponse } from "next/server";
import { isCreditReservationError } from "@/server/mock-service";

export function creditReservationResponse(error: unknown) {
  if (!isCreditReservationError(error)) return null;
  return NextResponse.json(
    {
      code: "INSUFFICIENT_CREDITS",
      userMessage: "Not enough available credits.",
      retryable: false,
      fallbackSuggested: false,
      estimate: error.estimate
    },
    { status: 402 }
  );
}
