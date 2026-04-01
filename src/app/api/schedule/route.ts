import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getMonthSchedule, setMonthSchedule } from "@/lib/schedule";

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month");
  if (!month) {
    return NextResponse.json({ error: "month parameter required" }, { status: 400 });
  }
  const schedule = await getMonthSchedule(month);
  return NextResponse.json(schedule);
}

export async function PUT(request: Request) {
  const authenticated = await verifySession();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { month, schedule } = await request.json();
  if (!month || !schedule) {
    return NextResponse.json({ error: "month and schedule required" }, { status: 400 });
  }

  await setMonthSchedule(month, schedule);
  return NextResponse.json({ success: true });
}
