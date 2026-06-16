import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sectionId = searchParams.get("sectionId");
    if (!sectionId) {
      return NextResponse.json({ success: false, error: "sectionId is required" }, { status: 400 });
    }
    const students = await query(
      "SELECT id, lrn, full_name, gender FROM section_students WHERE section_id = $1 ORDER BY full_name",
      [parseInt(sectionId)]
    );
    return NextResponse.json({ success: true, students });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sectionId, enrollmentId, lrn, fullName, gender } = await req.json();
    if (!sectionId || !fullName) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }
    await query(
      "INSERT INTO section_students (section_id, enrollment_id, lrn, full_name, gender) VALUES ($1, $2, $3, $4, $5)",
      [sectionId, enrollmentId || null, lrn || null, fullName, gender || null]
    );
    await query("UPDATE sections SET student_count = student_count + 1 WHERE id = $1", [sectionId]);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
