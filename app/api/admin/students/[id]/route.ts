import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const rows = await query<{ section_id: number }[]>("SELECT section_id FROM section_students WHERE id = $1", [id]);
    if (rows.length > 0) {
      await query("DELETE FROM section_students WHERE id = $1", [id]);
      await query("UPDATE sections SET student_count = GREATEST(student_count - 1, 0) WHERE id = $1", [rows[0].section_id]);
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
