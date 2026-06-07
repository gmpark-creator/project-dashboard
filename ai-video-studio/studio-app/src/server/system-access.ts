import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import type { ErrorResponse } from "../domain/types";

function productionMode() {
  return process.env.CUTPILOT_RUNTIME_MODE === "production";
}

function errorResponse(code: string, userMessage: string, status: number) {
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

function tokenMatches(input: string | null, expected: string) {
  if (!input) return false;
  const actual = Buffer.from(input);
  const target = Buffer.from(expected);
  if (actual.length !== target.length) return false;
  return timingSafeEqual(actual, target);
}

function requestToken(request: Request) {
  const authorization = request.headers.get("authorization");
  const bearer = authorization?.match(/^Bearer\s+(.+)$/i)?.[1] || null;
  return bearer || request.headers.get("x-cutpilot-admin-token");
}

export function requireSystemAccess(request: Request) {
  if (!productionMode()) return null;

  const expected = process.env.CUTPILOT_ADMIN_TOKEN;
  if (!expected) {
    return errorResponse("ADMIN_TOKEN_NOT_CONFIGURED", "System API access is not configured.", 503);
  }

  if (tokenMatches(requestToken(request), expected)) return null;
  return errorResponse("ADMIN_ACCESS_REQUIRED", "Admin access is required for this system endpoint.", 401);
}
