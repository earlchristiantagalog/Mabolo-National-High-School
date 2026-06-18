import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import nodemailer from "nodemailer";

async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS staff_accounts (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      department VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      account_id VARCHAR(20) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'Active',
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
  firstName: string,
  department: string,
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
    subject: `MNHS Staff Account - ${department}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #8B1010; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">MABOLO NATIONAL HIGH SCHOOL</h1>
          <p style="margin: 5px 0 0; font-size: 12px;">Cebu City — Division of Cebu City</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
          <h2 style="color: #8B1010; margin-top: 0;">Staff Account Created!</h2>
          <p>Hello ${firstName},</p>
          <p>Your staff account for the <strong>${department}</strong> department has been created. Below are your login credentials.</p>
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
            <h3 style="color: #8B1010; margin-top: 0; font-size: 16px; margin-bottom: 15px;">Login Credentials</h3>
            <table style="width: 100%; font-size: 13px; color: #333;">
              <tr><td style="padding: 5px 0; color: #666; width: 120px;">Staff ID</td><td style="padding: 5px 0; font-weight: bold; color: #8B1010; font-size: 16px; letter-spacing: 1px;">${accountId}</td></tr>
              <tr><td style="padding: 5px 0; color: #666;">Password</td><td style="padding: 5px 0; font-weight: bold; font-family: monospace;">${password}</td></tr>
            </table>
          </div>
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffc107;">
            <p style="margin: 0; font-size: 13px; color: #856404;"><strong>Important:</strong> Please keep your Staff ID and Password secure.</p>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
          <p style="color: #999; font-size: 11px; text-align: center;">This is an automated message. Please do not reply directly to this email.</p>
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
    const staff = await query<{
      id: number;
      account_id: string;
      name: string;
      department: string;
      email: string;
      status: string;
    }[]>(
      `SELECT id, account_id, first_name || ' ' || last_name AS name, department, email, status
       FROM staff_accounts
       ORDER BY last_name, first_name`
    );
    return NextResponse.json({ success: true, staff });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable();
    const { firstName, lastName, email, department, password } = await req.json();

    if (!firstName || !lastName || !email || !department || !password) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = await query<{ id: number }[]>(
      "SELECT id FROM staff_accounts WHERE email = $1",
      [email]
    );
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: "Account already exists with this email" }, { status: 409 });
    }

    let accountId = generateAccountId();
    let attempts = 0;
    while (attempts < 10) {
      const dup = await query<{ id: number }[]>(
        "SELECT id FROM staff_accounts WHERE account_id = $1",
        [accountId]
      );
      if (dup.length === 0) break;
      accountId = generateAccountId();
      attempts++;
    }

    await query(
      "INSERT INTO staff_accounts (first_name, last_name, department, email, account_id, password) VALUES ($1, $2, $3, $4, $5, $6)",
      [firstName, lastName, department, email, accountId, password]
    );

    try {
      await sendAccountEmail(email, firstName, department, accountId, password);
    } catch (emailError) {
      console.error("Staff account email send failed:", emailError);
    }

    return NextResponse.json({ success: true, accountId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
