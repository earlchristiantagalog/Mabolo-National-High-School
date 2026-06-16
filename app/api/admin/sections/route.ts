import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const sections = await query<{ id: number; name: string; grade: string; adviser: string | null; room_no: string | null; student_count: number }[]>(
      "SELECT id, name, grade, adviser, room_no, student_count FROM sections ORDER BY grade, name"
    );
    return NextResponse.json({ success: true, sections });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, grade, adviser, roomNo } = await req.json();
    if (!name || !grade) {
      return NextResponse.json({ success: false, error: "Name and grade are required" }, { status: 400 });
    }
    const rows = await query<{ id: number }[]>(
      `INSERT INTO sections (name, grade, adviser, room_no) VALUES ($1, $2, $3, $4) RETURNING id`,
      [name, grade, adviser || null, roomNo || null]
    );
    return NextResponse.json({ success: true, id: rows[0].id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
