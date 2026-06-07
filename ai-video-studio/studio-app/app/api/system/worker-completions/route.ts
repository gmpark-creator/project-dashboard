import { NextResponse } from "next/server";
import { getWorkerCompletionSnapshot } from "@/server/worker-completions";
import { requireSystemAccess } from "@/server/system-access";

export function GET(request: Request) {
  const denied = requireSystemAccess(request);
  if (denied) return denied;
  return NextResponse.json(getWorkerCompletionSnapshot());
}
