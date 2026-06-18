import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
    }

    const existing = await query<{ id: number }[]>(
      "SELECT id FROM student_accounts WHERE email = $1 AND id != $2",
      [email, id]
    );
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: "Email is already used by another account" }, { status: 409 });
    }

    if (password && password.length > 0) {
      if (password.length < 6) {
        return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
      }
      await query("UPDATE student_accounts SET email = $1, password = $2 WHERE id = $3", [email, password, id]);
    } else {
      await query("UPDATE student_accounts SET email = $1 WHERE id = $2", [email, id]);
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
    const result = await query("DELETE FROM student_accounts WHERE id = $1", [id]);
    if ((result as { rowCount: number }).rowCount === 0) {
      return NextResponse.json({ success: false, error: "Student account not found" }, { status: 404 });
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

    const result = await query("UPDATE student_accounts SET status = $1 WHERE id = $2", [status, id]);
    if ((result as { rowCount: number }).rowCount === 0) {
      return NextResponse.json({ success: false, error: "Student account not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
