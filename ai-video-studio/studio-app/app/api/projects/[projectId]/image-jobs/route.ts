import { NextResponse } from "next/server";
import { createImageJob } from "@/server/mock-service";
import type { Aspect, ImageAssetRole, ImageMakerPurpose } from "@/domain/types";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    prompt?: string;
    purpose?: ImageMakerPurpose;
    role?: ImageAssetRole;
    aspect?: Aspect;
    style?: string;
    count?: number;
  };
  return NextResponse.json(
    createImageJob({
      projectId,
      prompt: body.prompt || "",
      purpose: body.purpose || "photoreal",
      role: body.role || "keyframe",
      aspect: body.aspect || "9:16",
      style: body.style,
      count: body.count
    }),
    { status: 202 }
  );
}
