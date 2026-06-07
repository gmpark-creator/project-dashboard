import { NextResponse } from "next/server";
import { INTENT_TEMPLATES } from "@/domain/templates";
import type { Intent } from "@/domain/types";
import { decomposeStoryboard, StoryDecomposerUnavailableError } from "@/server/story-decomposer";
import { apiError } from "../../error-response";
import { readJsonObject } from "../../json-body";

function badRequest(userMessage: string) {
  return apiError("BAD_REQUEST", userMessage, 400);
}

export async function POST(request: Request) {
  const body = await readJsonObject(request);
  if (!body) return badRequest("Request body must be an object.");
  const idea = typeof body.idea === "string" ? body.idea.trim() : "";
  if (!idea) return badRequest("Idea is required.");
  if (typeof body.intent !== "string" || !(body.intent in INTENT_TEMPLATES)) return badRequest("Valid intent is required.");
  if (typeof body.projectId !== "undefined" && typeof body.projectId !== "string") return badRequest("Project id must be a string.");

  try {
    return NextResponse.json(
      decomposeStoryboard({
        projectId: typeof body.projectId === "string" && body.projectId.trim() ? body.projectId.trim() : undefined,
        idea,
        intent: body.intent as Intent
      })
    );
  } catch (error) {
    if (error instanceof StoryDecomposerUnavailableError) {
      return apiError("DECOMPOSER_UNAVAILABLE", "Story decomposition is not available in the current runtime configuration.", 503);
    }
    throw error;
  }
}
