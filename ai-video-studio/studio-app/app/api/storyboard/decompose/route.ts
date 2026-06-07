import { NextResponse } from "next/server";
import { INTENT_TEMPLATES } from "@/domain/templates";
import type { ErrorResponse, Intent } from "@/domain/types";
import { decomposeIdea } from "@/server/mock-service";

function badRequest(userMessage: string) {
  return NextResponse.json(
    {
      code: "BAD_REQUEST",
      userMessage,
      retryable: false,
      fallbackSuggested: false
    } satisfies ErrorResponse,
    { status: 400 }
  );
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { idea?: string; intent?: Intent; projectId?: string };
  const idea = body.idea?.trim() || "";
  if (!idea) return badRequest("Idea is required.");
  if (!body.intent || !(body.intent in INTENT_TEMPLATES)) return badRequest("Valid intent is required.");

  return NextResponse.json(
    decomposeIdea({
      projectId: typeof body.projectId === "string" && body.projectId.trim() ? body.projectId.trim() : undefined,
      idea,
      intent: body.intent
    })
  );
}
