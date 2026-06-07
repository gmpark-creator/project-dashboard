import { NextResponse } from "next/server";
import { INTENT_TEMPLATES } from "@/domain/templates";
import { createProject, listProjects } from "@/server/mock-service";
import type { Intent } from "@/domain/types";
import { apiError } from "../error-response";

export function GET() {
  return NextResponse.json({ projects: listProjects() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    title?: string;
    idea?: string;
    intent?: string;
    advanced?: { aspect?: "9:16" | "16:9" | "1:1" | "4:5"; durationSec?: number };
  };
  const idea = body.idea?.trim() || "";
  const title = body.title?.trim();
  if (!idea || !body.intent || !(body.intent in INTENT_TEMPLATES)) {
    return apiError("BAD_REQUEST", "아이디어와 목적이 필요합니다.", 400);
  }
  return NextResponse.json(createProject({ title, idea, intent: body.intent as Intent, advanced: body.advanced }), { status: 201 });
}
