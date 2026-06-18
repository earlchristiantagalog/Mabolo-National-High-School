import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sectionId = searchParams.get("sectionId");
    if (!sectionId) {
      return NextResponse.json({ success: false, error: "sectionId is required" }, { status: 400 });
    }
    const teachers = await query<{ teacher: string }[]>(
      `SELECT DISTINCT teacher FROM section_periods WHERE section_id = $1 AND teacher IS NOT NULL AND teacher != '' ORDER BY teacher`,
      [parseInt(sectionId)]
    );
    return NextResponse.json({ success: true, teachers: teachers.map((t) => t.teacher) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
