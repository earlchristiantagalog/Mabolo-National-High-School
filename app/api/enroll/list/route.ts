import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const applicants = await query<any[]>(
      "SELECT * FROM enrollments ORDER BY created_at DESC"
    );
    return NextResponse.json({ success: true, applicants });
  } catch (error: any) {
    console.error("Fetch applicants error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
