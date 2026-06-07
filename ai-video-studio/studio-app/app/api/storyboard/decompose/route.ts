import { NextResponse } from "next/server";
import { INTENT_TEMPLATES } from "@/domain/templates";
import type { ErrorResponse, Intent } from "@/domain/types";
import { decomposeIdea } from "@/server/mock-service";
import { readJsonObject } from "../../json-body";

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
  const body = await readJsonObject(request);
  if (!body) return badRequest("Request body must be an object.");
  const idea = typeof body.idea === "string" ? body.idea.trim() : "";
  if (!idea) return badRequest("Idea is required.");
  if (typeof body.intent !== "string" || !(body.intent in INTENT_TEMPLATES)) return badRequest("Valid intent is required.");
  if (typeof body.projectId !== "undefined" && typeof body.projectId !== "string") return badRequest("Project id must be a string.");

  return NextResponse.json(
    decomposeIdea({
      projectId: typeof body.projectId === "string" && body.projectId.trim() ? body.projectId.trim() : undefined,
      idea,
      intent: body.intent as Intent
    })
  );
}
