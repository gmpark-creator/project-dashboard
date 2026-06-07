import { NextResponse } from "next/server";
import { INTENT_TEMPLATES } from "@/domain/templates";
import { createProject, listProjects } from "@/server/mock-service";
import type { Aspect, Intent } from "@/domain/types";
import { apiError } from "../error-response";

const validAspects = new Set<Aspect>(["9:16", "16:9", "1:1", "4:5"]);

type ProjectCreateBody = {
  title?: string;
  idea?: string;
  intent?: string;
  advanced?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function GET() {
  return NextResponse.json({ projects: listProjects() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as ProjectCreateBody;
  const idea = body.idea?.trim() || "";
  const title = body.title?.trim();
  if (!idea || !body.intent || !(body.intent in INTENT_TEMPLATES)) {
    return apiError("BAD_REQUEST", "아이디어와 목적이 필요합니다.", 400);
  }
  const advancedInput = typeof body.advanced === "undefined" ? undefined : isRecord(body.advanced) ? body.advanced : null;
  if (advancedInput === null) {
    return apiError("BAD_REQUEST", "고급 설정 형식이 올바르지 않습니다.", 400);
  }

  const aspect = advancedInput?.aspect;
  if (typeof aspect !== "undefined" && (typeof aspect !== "string" || !validAspects.has(aspect as Aspect))) {
    return apiError("BAD_REQUEST", "지원하지 않는 화면 비율입니다.", 400);
  }
  const durationSec = advancedInput?.durationSec;
  if (typeof durationSec !== "undefined" && (typeof durationSec !== "number" || !Number.isInteger(durationSec) || durationSec < 1)) {
    return apiError("BAD_REQUEST", "영상 길이는 1초 이상의 정수여야 합니다.", 400);
  }
  const advanced = advancedInput
    ? {
        aspect: aspect as Aspect | undefined,
        durationSec: durationSec as number | undefined
      }
    : undefined;
  return NextResponse.json(createProject({ title, idea, intent: body.intent as Intent, advanced }), { status: 201 });
}
