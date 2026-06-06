import { NextResponse } from "next/server";
import { tickJobs } from "@/server/mock-service";

export function POST() {
  return NextResponse.json(tickJobs());
}
