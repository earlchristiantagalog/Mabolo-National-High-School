import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }
    const body = await request.json();

    const { error } = await supabase
      .from("contact_messages")
      .insert([body]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Message sent successfully." });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
