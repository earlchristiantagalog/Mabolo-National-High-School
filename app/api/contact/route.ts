import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await query(
      "INSERT INTO contact_messages (full_name, email, subject, message) VALUES (?, ?, ?, ?)",
      [body.full_name, body.email, body.subject, body.message]
    );

    return NextResponse.json({ success: true, message: "Message sent successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
