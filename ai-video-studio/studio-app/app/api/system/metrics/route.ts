import { NextResponse } from "next/server";
import { getSystemMetrics } from "@/server/metrics";

export function GET() {
  return NextResponse.json(getSystemMetrics());
}
