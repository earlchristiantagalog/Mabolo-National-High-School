import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { firstName, lastName, email, department, password } = await req.json();

    if (!firstName || !lastName || !email || !department) {
      return NextResponse.json({ success: false, error: "First name, last name, email, and department are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
    }

    const existing = await query<{ id: number }[]>(
      "SELECT id FROM staff_accounts WHERE email = $1 AND id != $2",
      [email, id]
    );
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: "Email is already used by another account" }, { status: 409 });
    }

    if (password && password.length > 0) {
      if (password.length < 6) {
        return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
      }
      await query(
        "UPDATE staff_accounts SET first_name = $1, last_name = $2, email = $3, department = $4, password = $5 WHERE id = $6",
        [firstName, lastName, email, department, password, id]
      );
    } else {
      await query(
        "UPDATE staff_accounts SET first_name = $1, last_name = $2, email = $3, department = $4 WHERE id = $5",
        [firstName, lastName, email, department, id]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await query("DELETE FROM staff_accounts WHERE id = $1", [id]);
    if ((result as { rowCount: number }).rowCount === 0) {
      return NextResponse.json({ success: false, error: "Staff account not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!status || !["Active", "Banned"].includes(status)) {
      return NextResponse.json({ success: false, error: "Status must be 'Active' or 'Banned'" }, { status: 400 });
    }

    const result = await query("UPDATE staff_accounts SET status = $1 WHERE id = $2", [status, id]);
    if ((result as { rowCount: number }).rowCount === 0) {
      return NextResponse.json({ success: false, error: "Staff account not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
