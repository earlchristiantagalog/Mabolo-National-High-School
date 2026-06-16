import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { referenceNumber, checkedRequirements, status } = await req.json();

    await query(
      "UPDATE enrollments SET checked_requirements = $1, status = $2 WHERE reference_number = $3",
      [JSON.stringify(checkedRequirements), status, referenceNumber]
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Update requirements error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
