import { NextResponse } from "next/server";
import { timelineEvents } from "@/data/timeline";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, boolean> = {};

  // Check that timeline data loaded and is non-empty
  checks.timelineDataLoaded =
    Array.isArray(timelineEvents) && timelineEvents.length > 0;

  // Check that every event has required fields (guard against empty array)
  checks.timelineDataValid =
    timelineEvents.length > 0 &&
    timelineEvents.every(
      (e) =>
        typeof e.id === "string" &&
        typeof e.time === "string" &&
        Array.isArray(e.coords) &&
        e.coords.length === 2
    );

  const healthy = Object.values(checks).every(Boolean);
  const status = healthy ? 200 : 503;

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status }
  );
}
