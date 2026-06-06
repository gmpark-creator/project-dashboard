import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/server/mock-service";
import type { Intent } from "@/domain/types";

export function GET() {
  return NextResponse.json({ projects: listProjects() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    title?: string;
    idea?: string;
    intent?: Intent;
    advanced?: { aspect?: "9:16" | "16:9" | "1:1" | "4:5"; durationSec?: number };
  };
  const idea = body.idea?.trim() || "";
  const title = body.title?.trim();
  if (!idea || !body.intent) {
    return NextResponse.json({ code: "BAD_REQUEST", userMessage: "아이디어와 목적이 필요합니다." }, { status: 400 });
  }
  return NextResponse.json(createProject({ title, idea, intent: body.intent, advanced: body.advanced }), { status: 201 });
}
