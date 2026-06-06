import { NextResponse } from "next/server";
import { listImageAssets, registerExternalImage } from "@/server/mock-service";
import type { Aspect, ImageAssetRole } from "@/domain/types";

export async function GET(_request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  return NextResponse.json({ assets: listImageAssets(projectId) });
}

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    label?: string;
    role?: ImageAssetRole;
    url?: string;
    aspect?: Aspect;
    prompt?: string;
    rightsConfirmed?: boolean;
  };
  return NextResponse.json(
    registerExternalImage({
      projectId,
      label: body.label || "",
      role: body.role || "style",
      url: body.url || "",
      aspect: body.aspect,
      prompt: body.prompt,
      rightsConfirmed: body.rightsConfirmed
    }),
    { status: 201 }
  );
}
