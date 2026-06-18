import { NextResponse } from "next/server";
import { query } from "@/lib/db";

interface EnrollmentRow {
  id: number;
  reference_number: string;
  school_year: string;
  enrollment_type: string;
  grade_level: string;
  strand: string | null;
  tvl_specialization: string | null;
  lrn: string | null;
  psa_birth_cert: string | null;
  last_name: string;
  first_name: string;
  middle_name: string | null;
  extension_name: string | null;
  email: string | null;
  birthdate: string;
  place_of_birth_city: string;
  place_of_birth_province: string | null;
  mother_tongue: string | null;
  sex: string;
  with_lrn: string;
  returning_learner: string;
  ip_community: string;
  ip_specify: string | null;
  four_ps_beneficiary: string;
  four_ps_household_id: string | null;
  disability: string;
  disability_type: string | null;
  current_address: string | null;
  current_city: string | null;
  current_province: string | null;
  current_barangay: string | null;
  current_zip_code: string | null;
  current_country: string | null;
  same_address: string;
  permanent_address: string | null;
  permanent_city: string | null;
  permanent_province: string | null;
  permanent_barangay: string | null;
  permanent_zip_code: string | null;
  permanent_country: string | null;
  father_name: string | null;
  father_contact: string | null;
  mother_maiden_name: string | null;
  mother_contact: string | null;
  guardian_name: string | null;
  guardian_contact: string | null;
  status: string;
  checked_requirements: string | null;
  created_at: string;
  updated_at: string;
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const applicants = await query<EnrollmentRow[]>(
      "SELECT * FROM enrollments ORDER BY created_at DESC"
    );
    return NextResponse.json({ success: true, applicants });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Fetch applicants error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
