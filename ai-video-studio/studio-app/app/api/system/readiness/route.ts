import { NextResponse } from "next/server";
import { getRuntimeReadiness } from "@/server/readiness";

export function GET() {
  return NextResponse.json(getRuntimeReadiness());
}
