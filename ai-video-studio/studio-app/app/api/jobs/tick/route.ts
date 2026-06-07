import { NextResponse } from "next/server";
import { getJobQueueSnapshot } from "@/server/queue-snapshot";

export function POST() {
  return NextResponse.json(getJobQueueSnapshot());
}
