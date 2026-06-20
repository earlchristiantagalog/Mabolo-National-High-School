import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Ensure status column exists on all account tables
    await query(`ALTER TABLE admin_accounts ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Active'`);
    await query(`ALTER TABLE staff_accounts ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Active'`);
    await query(`ALTER TABLE teacher_accounts ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Active'`);
    await query(`ALTER TABLE student_accounts ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Active'`);

    const { emailOrId, password } = await req.json();

    if (!emailOrId || !password) {
      return NextResponse.json({ success: false, error: "Email/Account ID and password are required" }, { status: 400 });
    }

    const input = emailOrId.trim();

    // Check admin accounts
    const admin = await query<{
      id: number; first_name: string; last_name: string; role: string;
      email: string; account_id: string; status: string;
    }[]>(
      `SELECT id, first_name, last_name, role, email, account_id, status
       FROM admin_accounts
       WHERE (email = $1 OR account_id = $1) AND password = $2 LIMIT 1`,
      [input, password]
    );
    if (admin.length > 0) {
      const a = admin[0];
      if (a.status === "Banned") {
        return NextResponse.json({ success: false, error: "Your account has been banned" }, { status: 403 });
      }
      return NextResponse.json({
        success: true,
        user: {
          id: a.id, name: `${a.first_name} ${a.last_name}`, email: a.email,
          accountId: a.account_id, role: a.role, type: "admin",
        },
      });
    }

    // Check staff accounts
    const staff = await query<{
      id: number; first_name: string; last_name: string; department: string;
      email: string; account_id: string; status: string;
    }[]>(
      `SELECT id, first_name, last_name, department, email, account_id, status
       FROM staff_accounts
       WHERE (email = $1 OR account_id = $1) AND password = $2 LIMIT 1`,
      [input, password]
    );
    if (staff.length > 0) {
      const s = staff[0];
      if (s.status === "Banned") {
        return NextResponse.json({ success: false, error: "Your account has been banned" }, { status: 403 });
      }
      return NextResponse.json({
        success: true,
        user: {
          id: s.id, name: `${s.first_name} ${s.last_name}`, email: s.email,
          accountId: s.account_id, department: s.department, type: "staff",
        },
      });
    }

    // Check teacher accounts
    const teacher = await query<{
      id: number; teacher_name: string; email: string;
      account_id: string; status: string;
    }[]>(
      `SELECT id, teacher_name, email, account_id, status
       FROM teacher_accounts
       WHERE (email = $1 OR account_id = $1) AND password = $2 LIMIT 1`,
      [input, password]
    );
    if (teacher.length > 0) {
      const t = teacher[0];
      if (t.status === "Banned") {
        return NextResponse.json({ success: false, error: "Your account has been banned" }, { status: 403 });
      }
      return NextResponse.json({
        success: true,
        user: {
          id: t.id, name: t.teacher_name, email: t.email,
          accountId: t.account_id, type: "teacher",
        },
      });
    }

    // Check student accounts
    const student = await query<{
      id: number; account_id: string; email: string; status: string;
      full_name: string; grade: string; section_name: string;
    }[]>(
      `SELECT sa.id, sa.account_id, sa.email, sa.status,
              ss.full_name, sec.grade, sec.name AS section_name
       FROM student_accounts sa
       JOIN section_students ss ON sa.student_id = ss.id
       JOIN sections sec ON ss.section_id = sec.id
       WHERE (sa.email = $1 OR sa.account_id = $1) AND sa.password = $2 LIMIT 1`,
      [input, password]
    );
    if (student.length > 0) {
      const s = student[0];
      if (s.status === "Banned") {
        return NextResponse.json({ success: false, error: "Your account has been banned" }, { status: 403 });
      }
      return NextResponse.json({
        success: true,
        user: {
          id: s.id, name: s.full_name, email: s.email,
          accountId: s.account_id, grade: s.grade, section: s.section_name,
          type: "student",
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid email/account ID or password" },
      { status: 401 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Login error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
