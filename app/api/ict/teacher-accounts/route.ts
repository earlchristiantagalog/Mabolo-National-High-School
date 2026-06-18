import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import nodemailer from "nodemailer";

async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS teacher_accounts (
      id SERIAL PRIMARY KEY,
      teacher_name VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL,
      account_id VARCHAR(20) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

function generateAccountId(): string {
  const digits = Math.floor(10000000 + Math.random() * 90000000);
  return String(digits);
}

async function sendAccountEmail(
  email: string,
  teacherName: string,
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
    from: process.env.SMTP_FROM || "MNHS Enrollment <noreply@mnhs.edu.ph>",
    to: email,
    subject: `MNHS Teacher Account Created`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #8B1010; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">MABOLO NATIONAL HIGH SCHOOL</h1>
          <p style="margin: 5px 0 0; font-size: 12px;">Cebu City — Division of Cebu City</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
          <h2 style="color: #8B1010; margin-top: 0;">Teacher Account Created!</h2>
          <p>Hello ${teacherName},</p>
          <p>Your teacher account has been created. Below are your login credentials.</p>

          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
            <h3 style="color: #8B1010; margin-top: 0; font-size: 16px; margin-bottom: 15px;">Login Credentials</h3>
            <table style="width: 100%; font-size: 13px; color: #333;">
              <tr><td style="padding: 5px 0; color: #666; width: 120px;">Teacher ID</td><td style="padding: 5px 0; font-weight: bold; color: #8B1010; font-size: 16px; letter-spacing: 1px;">${accountId}</td></tr>
              <tr><td style="padding: 5px 0; color: #666;">Password</td><td style="padding: 5px 0; font-weight: bold; font-family: monospace;">${password}</td></tr>
            </table>
          </div>

          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffc107;">
            <p style="margin: 0; font-size: 13px; color: #856404;"><strong>Important:</strong> Please keep your Teacher ID and Password secure. Do not share your credentials with anyone.</p>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
          <p style="color: #999; font-size: 11px; text-align: center;">This is an automated message. Please do not reply directly to this email. For questions, visit the ICT office.</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureTable();
    const teachers = await query<{
      teacher_name: string;
      email: string | null;
      account_id: string | null;
      created_at: string | null;
      sections: { name: string; grade: string }[] | null;
    }[]>(
      `SELECT DISTINCT sp.teacher AS teacher_name,
              ta.email,
              ta.account_id,
              ta.created_at,
              COALESCE(
                (SELECT json_agg(json_build_object('name', t.name, 'grade', t.grade))
                 FROM (
                   SELECT DISTINCT s2.name, s2.grade
                   FROM section_periods sp2
                   JOIN sections s2 ON sp2.section_id = s2.id
                   WHERE sp2.teacher = sp.teacher
                 ) t),
                '[]'::json
              ) AS sections
       FROM section_periods sp
       LEFT JOIN teacher_accounts ta ON ta.teacher_name = sp.teacher
       WHERE sp.teacher IS NOT NULL AND sp.teacher != ''
       ORDER BY sp.teacher`
    );
    return NextResponse.json({ success: true, teachers });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable();
    const { teacherName, email, password } = await req.json();
    if (!teacherName || !email || !password) {
      return NextResponse.json({ success: false, error: "teacherName, email, and password are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = await query<{ id: number }[]>(
      "SELECT id FROM teacher_accounts WHERE teacher_name = $1",
      [teacherName]
    );
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: "Account already exists for this teacher" }, { status: 409 });
    }

    let accountId = generateAccountId();
    let attempts = 0;
    while (attempts < 10) {
      const dup = await query<{ id: number }[]>(
        "SELECT id FROM teacher_accounts WHERE account_id = $1",
        [accountId]
      );
      if (dup.length === 0) break;
      accountId = generateAccountId();
      attempts++;
    }

    await query(
      "INSERT INTO teacher_accounts (teacher_name, email, account_id, password) VALUES ($1, $2, $3, $4)",
      [teacherName, email, accountId, password]
    );

    try {
      await sendAccountEmail(email, teacherName, accountId, password);
    } catch (emailError) {
      console.error("Teacher account email send failed:", emailError);
    }

    return NextResponse.json({ success: true, accountId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
