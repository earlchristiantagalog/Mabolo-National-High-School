import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q");

    if (!search) {
      return NextResponse.json(
        { success: false, error: "Search query is required" },
        { status: 400 }
      );
    }

    const rows = await query<{ id: number; reference_number: string; lrn: string | null; last_name: string; first_name: string; middle_name: string | null; sex: string; grade_level: string; email: string | null }[]>(
      `SELECT id, reference_number, lrn, last_name, first_name, middle_name, sex, grade_level, email
       FROM enrollments
       WHERE reference_number = $1 OR lrn = $1
       LIMIT 1`,
      [search]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
    }

    const row = rows[0];
    const middleName = row.middle_name ? ` ${row.middle_name}` : "";

    return NextResponse.json({
      success: true,
      student: {
        lrn: row.lrn || "",
        name: `${row.last_name}, ${row.first_name}${middleName}`,
        gender: row.sex,
        grade: `Grade ${row.grade_level}`,
        email: row.email || "",
        referenceNumber: row.reference_number,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Search student error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
