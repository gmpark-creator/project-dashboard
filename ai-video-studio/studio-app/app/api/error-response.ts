import { NextResponse } from "next/server";
import type { ErrorResponse } from "@/domain/types";

export function apiError(code: string, userMessage: string, status: number) {
  return NextResponse.json(
    {
      code,
      userMessage,
      retryable: false,
      fallbackSuggested: false
    } satisfies ErrorResponse,
    { status }
  );
}
