import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate random applicant ID: YEAR + random 4-digit number
    const year = new Date().getFullYear().toString();
    let applicantId = "";
    let retries = 0;
    while (retries < 10) {
      const rand = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
      applicantId = year + rand;
      const [existing] = await query(
        "SELECT id FROM applicants WHERE applicant_id = ? LIMIT 1",
        [applicantId]
      ) as RowDataPacket[];
      if (!existing || existing.length === 0) break;
      retries++;
    }
    if (retries >= 10) {
      return NextResponse.json({ error: "Unable to generate unique ID. Please try again." }, { status: 500 });
    }

    await query(
      `INSERT INTO applicants (
        applicant_id, enrollment_type, grade_level, strand, tvl_specialization,
        lrn, psa_birth_cert, last_name, first_name, middle_name, extension_name,
        birthdate, place_of_birth_city, place_of_birth_province, mother_tongue, sex,
        with_lrn, returning_learner, ip_community, ip_specify,
        four_ps_beneficiary, four_ps_household_id, disability, disability_type,
        current_address, current_city, current_province, current_barangay,
        current_zip_code, current_country, same_address, permanent_address,
        permanent_city, permanent_province, permanent_barangay, permanent_zip_code,
        permanent_country, father_name, father_contact, mother_maiden_name,
        mother_contact, guardian_name, guardian_contact, school_year
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        applicantId,
        body.enrollmentType,
        body.gradeLevel,
        body.strand || null,
        body.tvlSpecialization || null,
        body.lrn || null,
        body.psaBirthCert || null,
        body.lastName,
        body.firstName,
        body.middleName || null,
        body.extensionName || null,
        body.birthdate,
        body.placeOfBirthCity || null,
        body.placeOfBirthProvince || null,
        body.motherTongue || null,
        body.sex,
        body.withLRN || null,
        body.returningLearner || null,
        body.ipCommunity || null,
        body.ipSpecify || null,
        body.fourPsBeneficiary || null,
        body.fourPsHouseholdId || null,
        body.disability || null,
        body.disabilityType?.length ? JSON.stringify(body.disabilityType) : null,
        body.currentAddress || null,
        body.currentCity || null,
        body.currentProvince || null,
        body.currentBarangay || null,
        body.currentZipCode || null,
        body.currentCountry || null,
        body.sameAddress || null,
        body.permanentAddress || null,
        body.permanentCity || null,
        body.permanentProvince || null,
        body.permanentBarangay || null,
        body.permanentZipCode || null,
        body.permanentCountry || null,
        body.fatherName || null,
        body.fatherContact || null,
        body.motherMaidenName || null,
        body.motherContact || null,
        body.guardianName || null,
        body.guardianContact || null,
        body.schoolYear,
      ]
    );

    return NextResponse.json({
      success: true,
      studentId: applicantId,
      message: "Enrollment submitted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
