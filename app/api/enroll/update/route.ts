import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { referenceNumber, checkedRequirements, status } = await req.json();

    await query(
      "UPDATE enrollments SET checked_requirements = ?, status = ? WHERE reference_number = ?",
      [JSON.stringify(checkedRequirements), status, referenceNumber]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update requirements error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
