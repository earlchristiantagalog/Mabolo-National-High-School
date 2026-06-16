import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sectionId = searchParams.get("sectionId");
    if (!sectionId) {
      return NextResponse.json({ success: false, error: "sectionId is required" }, { status: 400 });
    }
    const periods = await query(
      "SELECT id, day, time, subject, teacher, room_no FROM section_periods WHERE section_id = $1 ORDER BY CASE day WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3 WHEN 'Thursday' THEN 4 WHEN 'Friday' THEN 5 END, time",
      [parseInt(sectionId)]
    );
    return NextResponse.json({ success: true, periods });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sectionId, day, time, subject, teacher, roomNo } = await req.json();
    if (!sectionId || !day || !time || !subject) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }
    await query(
      "INSERT INTO section_periods (section_id, day, time, subject, teacher, room_no) VALUES ($1, $2, $3, $4, $5, $6)",
      [sectionId, day, time, subject, teacher || null, roomNo || null]
    );
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
