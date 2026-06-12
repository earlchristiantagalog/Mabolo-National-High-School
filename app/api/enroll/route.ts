import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate student ID: YEAR + 4-digit sequence
    const year = new Date().getFullYear().toString();
    const [rows] = await query(
      "SELECT COUNT(*) AS count FROM enrollments WHERE student_id LIKE ?",
      [year + "%"]
    ) as RowDataPacket[];
    const nextNum = (rows[0]?.count || 0) + 1;
    const studentId = year + String(nextNum).padStart(4, "0");

    // Map formData to DB columns
    const sql = `INSERT INTO enrollments SET ?`;
    const values: any = {
      student_id: studentId,
      enrollment_type: body.enrollmentType,
      grade_level: body.gradeLevel,
      strand: body.strand || null,
      tvl_specialization: body.tvlSpecialization || null,
      lrn: body.lrn || null,
      psa_birth_cert: body.psaBirthCert || null,
      last_name: body.lastName,
      first_name: body.firstName,
      middle_name: body.middleName || null,
      extension_name: body.extensionName || null,
      birthdate: body.birthdate,
      place_of_birth_city: body.placeOfBirthCity || null,
      place_of_birth_province: body.placeOfBirthProvince || null,
      mother_tongue: body.motherTongue || null,
      sex: body.sex,
      with_lrn: body.withLRN || null,
      returning_learner: body.returningLearner || null,
      ip_community: body.ipCommunity || null,
      ip_specify: body.ipSpecify || null,
      four_ps_beneficiary: body.fourPsBeneficiary || null,
      four_ps_household_id: body.fourPsHouseholdId || null,
      disability: body.disability || null,
      disability_type: body.disabilityType?.length ? JSON.stringify(body.disabilityType) : null,
      current_address: body.currentAddress || null,
      current_city: body.currentCity || null,
      current_province: body.currentProvince || null,
      current_barangay: body.currentBarangay || null,
      current_zip_code: body.currentZipCode || null,
      current_country: body.currentCountry || null,
      same_address: body.sameAddress || null,
      permanent_address: body.permanentAddress || null,
      permanent_city: body.permanentCity || null,
      permanent_province: body.permanentProvince || null,
      permanent_barangay: body.permanentBarangay || null,
      permanent_zip_code: body.permanentZipCode || null,
      permanent_country: body.permanentCountry || null,
      father_name: body.fatherName || null,
      father_contact: body.fatherContact || null,
      mother_maiden_name: body.motherMaidenName || null,
      mother_contact: body.motherContact || null,
      guardian_name: body.guardianName || null,
      guardian_contact: body.guardianContact || null,
      school_year: body.schoolYear,
    };

    await query(sql, [values]);

    return NextResponse.json({
      success: true,
      studentId,
      message: "Enrollment submitted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
