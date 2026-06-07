import { NextResponse } from "next/server";
import { INTENT_TEMPLATES } from "@/domain/templates";
import { createProject, listProjects } from "@/server/mock-service";
import type { Aspect, Intent, Tier } from "@/domain/types";
import { apiError } from "../error-response";
import { isJsonObject, readJsonObject } from "../json-body";

const validAspects = new Set<Aspect>(["9:16", "16:9", "1:1", "4:5"]);
const validTiers = new Set<Tier>(["fast", "economy", "final"]);

export function GET() {
  return NextResponse.json({ projects: listProjects() });
}

export async function POST(request: Request) {
  const body = await readJsonObject(request);
  if (!body) {
    return apiError("BAD_REQUEST", "요청 형식이 올바르지 않습니다.", 400);
  }
  const idea = typeof body.idea === "string" ? body.idea.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : undefined;
  if (typeof body.title !== "undefined" && typeof body.title !== "string") {
    return apiError("BAD_REQUEST", "프로젝트 제목은 문자열이어야 합니다.", 400);
  }
  if (!idea || typeof body.intent !== "string" || !(body.intent in INTENT_TEMPLATES)) {
    return apiError("BAD_REQUEST", "아이디어와 목적이 필요합니다.", 400);
  }
  const advancedInput = typeof body.advanced === "undefined" ? undefined : isJsonObject(body.advanced) ? body.advanced : null;
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
  const tier = advancedInput?.tier;
  if (typeof tier !== "undefined" && (typeof tier !== "string" || !validTiers.has(tier as Tier))) {
    return apiError("BAD_REQUEST", "지원하지 않는 생성 품질 단계입니다.", 400);
  }
  const advanced = advancedInput
    ? {
        aspect: aspect as Aspect | undefined,
        durationSec: durationSec as number | undefined,
        tier: tier as Tier | undefined
      }
    : undefined;
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") {
    return apiError("MOCK_MUTATION_UNAVAILABLE", "Mock-backed project creation is not available in production mode.", 503);
  }
  return NextResponse.json(createProject({ title, idea, intent: body.intent as Intent, advanced }), { status: 201 });
}
