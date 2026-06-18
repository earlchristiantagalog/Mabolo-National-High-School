import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import nodemailer from "nodemailer";

function generateStudentId(): string {
  const year = new Date().getFullYear();
  const digits = String(Math.floor(1000 + Math.random() * 9000));
  return `${year}${digits}`;
}

async function sendAccountEmail(
  email: string,
  firstName: string,
  lastName: string,
  grade: string,
  sectionName: string,
  accountId: string,
  password: string,
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || "MNHS ICT Department <noreply@mnhs.edu.ph>",
    to: email,
    subject: `MNHS Student Account - ${grade} ${sectionName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #8B1010; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">MABOLO NATIONAL HIGH SCHOOL</h1>
          <p style="margin: 5px 0 0; font-size: 12px;">Cebu City — Division of Cebu City</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
          <h2 style="color: #8B1010; margin-top: 0;">Student Account Created!</h2>
          <p>Hello ${firstName},</p>
          <p>Your student account has been created. Below are your assignment details and login credentials.</p>

          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
            <h3 style="color: #8B1010; margin-top: 0; font-size: 16px; margin-bottom: 15px;">Section Assignment</h3>
            <table style="width: 100%; font-size: 13px; color: #333;">
              <tr><td style="padding: 5px 0; color: #666; width: 120px;">Grade Level</td><td style="padding: 5px 0; font-weight: bold;">${grade}</td></tr>
              <tr><td style="padding: 5px 0; color: #666;">Section</td><td style="padding: 5px 0; font-weight: bold;">${sectionName}</td></tr>
            </table>
          </div>

          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
            <h3 style="color: #8B1010; margin-top: 0; font-size: 16px; margin-bottom: 15px;">Login Credentials</h3>
            <table style="width: 100%; font-size: 13px; color: #333;">
              <tr><td style="padding: 5px 0; color: #666; width: 120px;">Student ID</td><td style="padding: 5px 0; font-weight: bold; color: #8B1010; font-size: 16px; letter-spacing: 1px;">${accountId}</td></tr>
              <tr><td style="padding: 5px 0; color: #666;">Password</td><td style="padding: 5px 0; font-weight: bold; font-family: monospace;">${password}</td></tr>
            </table>
          </div>

          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffc107;">
            <p style="margin: 0; font-size: 13px; color: #856404;"><strong>Important:</strong> Please keep your Student ID and Password secure. Do not share your credentials with anyone.</p>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
          <p style="color: #999; font-size: 11px; text-align: center;">This is an automated message. Please do not reply directly to this email. For questions, visit the ICT office or contact your section adviser.</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sectionId = searchParams.get("sectionId");

    let sql: string;
    let params: unknown[];

    if (sectionId) {
      sql = `
        SELECT ss.id, ss.full_name, ss.lrn, ss.gender, ss.section_id, ss.enrollment_id,
               sec.name AS section_name, sec.grade,
               COALESCE(e.last_name, e2.last_name) AS last_name,
               COALESCE(e.first_name, e2.first_name) AS first_name,
               COALESCE(e.middle_name, e2.middle_name) AS middle_name,
               COALESCE(e.email, e2.email) AS email,
               sa.account_id AS student_id, sa.email AS account_email
        FROM section_students ss
        JOIN sections sec ON ss.section_id = sec.id
        LEFT JOIN enrollments e ON ss.enrollment_id = e.id
        LEFT JOIN LATERAL (
          SELECT last_name, first_name, middle_name, email
          FROM enrollments WHERE lrn = ss.lrn
          ORDER BY id DESC LIMIT 1
        ) e2 ON ss.enrollment_id IS NULL AND ss.lrn IS NOT NULL
        LEFT JOIN student_accounts sa ON sa.student_id = ss.id
        WHERE ss.section_id = $1
        ORDER BY COALESCE(e.last_name, e2.last_name), COALESCE(e.first_name, e2.first_name)
      `;
      params = [parseInt(sectionId)];
    } else {
      sql = `
        SELECT ss.id, ss.full_name, ss.lrn, ss.gender, ss.section_id, ss.enrollment_id,
               sec.name AS section_name, sec.grade,
               COALESCE(e.last_name, e2.last_name) AS last_name,
               COALESCE(e.first_name, e2.first_name) AS first_name,
               COALESCE(e.middle_name, e2.middle_name) AS middle_name,
               COALESCE(e.email, e2.email) AS email,
               sa.account_id AS student_id, sa.email AS account_email
        FROM section_students ss
        JOIN sections sec ON ss.section_id = sec.id
        LEFT JOIN enrollments e ON ss.enrollment_id = e.id
        LEFT JOIN LATERAL (
          SELECT last_name, first_name, middle_name, email
          FROM enrollments WHERE lrn = ss.lrn
          ORDER BY id DESC LIMIT 1
        ) e2 ON ss.enrollment_id IS NULL AND ss.lrn IS NOT NULL
        LEFT JOIN student_accounts sa ON sa.student_id = ss.id
        ORDER BY sec.grade, sec.name, COALESCE(e.last_name, e2.last_name), COALESCE(e.first_name, e2.first_name)
      `;
      params = [];
    }

    const students = await query(sql, params);
    return NextResponse.json({ success: true, students });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { studentId, email, password } = await req.json();
    if (!studentId || !email || !password) {
      return NextResponse.json({ success: false, error: "studentId, email, and password are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = await query<{ id: number }[]>(
      "SELECT id FROM student_accounts WHERE student_id = $1",
      [studentId]
    );
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: "Account already exists for this student" }, { status: 409 });
    }

    let accountId = generateStudentId();
    let attempts = 0;
    while (attempts < 10) {
      const dup = await query<{ id: number }[]>(
        "SELECT id FROM student_accounts WHERE account_id = $1",
        [accountId]
      );
      if (dup.length === 0) break;
      accountId = generateStudentId();
      attempts++;
    }

    await query(
      "INSERT INTO student_accounts (student_id, account_id, email, password) VALUES ($1, $2, $3, $4)",
      [studentId, accountId, email, password]
    );

    const studentInfo = await query<{
      full_name: string; first_name: string; last_name: string;
      grade: string; section_name: string;
    }[]>(
      `SELECT ss.full_name, e.first_name, e.last_name, sec.grade, sec.name AS section_name
       FROM section_students ss
       JOIN sections sec ON ss.section_id = sec.id
       LEFT JOIN enrollments e ON ss.enrollment_id = e.id
       WHERE ss.id = $1`,
      [studentId]
    );

    if (studentInfo.length > 0) {
      const s = studentInfo[0];
      try {
        await sendAccountEmail(
          email,
          s.first_name || s.full_name,
          s.last_name || "",
          s.grade,
          s.section_name,
          accountId,
          password,
        );
      } catch (emailError) {
        console.error("Account email send failed:", emailError);
      }
    }

    return NextResponse.json({ success: true, accountId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
