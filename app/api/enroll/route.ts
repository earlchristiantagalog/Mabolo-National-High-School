import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";

async function generateReferenceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${year}${random}`;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEnrollmentEmail(email: string, refNo: string, firstName: string, enrollmentType: string) {
  const requirementsList: Record<string, string[]> = {
    new: ["PSA Birth Certificate", "Form 138 (Report Card)", "Good Moral Certificate", "2x2 ID Picture (2 copies)"],
    old: ["Form 138 (Report Card)", "Good Moral Certificate", "2x2 ID Picture (1 copy)"],
    transferee: ["PSA Birth Certificate", "Form 137 (Permanent Record)", "Good Moral Certificate", "2x2 ID Picture (2 copies)"],
    "balik-aral": ["PSA Birth Certificate", "Good Moral Certificate", "2x2 ID Picture (2 copies)", "Certificate of Attendance / Enrollment (if available)"],
  };

  const requirements = requirementsList[enrollmentType] || requirementsList["new"];
  const requirementsHtml = requirements.map(r => `<li style="padding: 4px 0;">${r}</li>`).join("");

  const mailOptions = {
    from: process.env.SMTP_FROM || "MNHS Enrollment <noreply@mnhs.edu.ph>",
    to: email,
    subject: `Enrollment Received - Reference No. ${refNo}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #8B1010; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">MABOLO NATIONAL HIGH SCHOOL</h1>
          <p style="margin: 5px 0 0; font-size: 12px;">Cebu City — Division of Cebu City</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
          <h2 style="color: #8B1010; margin-top: 0;">Enrollment Received!</h2>
          <p>Hello ${firstName},</p>
          <p>Your enrollment application has been received. Please save your reference number for future transactions.</p>

          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee; text-align: center;">
            <p style="margin: 0 0 5px; color: #666; font-size: 12px;">YOUR REFERENCE NUMBER</p>
            <p style="margin: 0; color: #8B1010; font-size: 28px; font-weight: bold; letter-spacing: 2px;">${refNo}</p>
          </div>

          <h3 style="color: #8B1010; margin-top: 25px; font-size: 16px;">Requirements to Submit</h3>
          <p style="color: #666; font-size: 13px; margin-bottom: 10px;">Please bring the following documents to the registrar's office:</p>
          <ul style="color: #333; font-size: 13px; padding-left: 20px; margin-bottom: 20px;">
            ${requirementsHtml}
          </ul>

          <h3 style="color: #8B1010; margin-top: 25px; font-size: 16px;">Enrollment Procedure</h3>
          <ol style="color: #333; font-size: 13px; padding-left: 20px; margin-bottom: 20px;">
            <li style="padding: 4px 0;">Present your reference number and requirements at the registrar's office.</li>
            <li style="padding: 4px 0;">Documents will be verified and reviewed by the enrollment staff.</li>
            <li style="padding: 4px 0;">Wait for confirmation via email or phone within 3–5 working days.</li>
            <li style="padding: 4px 0;">Once approved, you will receive your official student credentials.</li>
          </ol>

          <h3 style="color: #8B1010; margin-top: 25px; font-size: 16px;">Office Hours</h3>
          <p style="color: #333; font-size: 13px; margin-bottom: 5px;">Monday to Friday — 7:00 AM to 4:00 PM</p>
          <p style="color: #333; font-size: 13px;">Saturday — 7:00 AM to 12:00 PM (by schedule)</p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
          <p style="color: #999; font-size: 11px; text-align: center;">This is an automated message. Please do not reply directly to this email. For questions, visit the registrar's office or call the school.</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const referenceNumber = await generateReferenceNumber();

    const get = (key: string): string | null => {
      const val = formData.get(key);
      if (val === null || val === undefined || val instanceof File) return null;
      const str = String(val).trim();
      return str === "" ? null : str;
    };

    const email = get("email");

    const values = [
      referenceNumber,
      get("schoolYear"),
      get("enrollmentType"),
      get("gradeLevel"),
      get("strand"),
      get("tvlSpecialization"),
      get("lrn"),
      get("psaBirthCert"),
      get("lastName"),
      get("firstName"),
      get("middleName"),
      get("extensionName"),
      email,
      get("birthdate"),
      get("placeOfBirthCity"),
      get("placeOfBirthProvince"),
      get("motherTongue"),
      get("sex"),
      get("withLRN"),
      get("returningLearner"),
      get("ipCommunity"),
      get("ipSpecify"),
      get("fourPsBeneficiary"),
      get("fourPsHouseholdId"),
      get("disability"),
      get("disabilityType"),
      get("currentAddress"),
      get("currentCity"),
      get("currentProvince"),
      get("currentBarangay"),
      get("currentZipCode"),
      get("currentCountry"),
      get("sameAddress"),
      get("permanentAddress"),
      get("permanentCity"),
      get("permanentProvince"),
      get("permanentBarangay"),
      get("permanentZipCode"),
      get("permanentCountry"),
      get("fatherName"),
      get("fatherContact"),
      get("motherMaidenName"),
      get("motherContact"),
      get("guardianName"),
      get("guardianContact"),
    ];

    const cols = [
      "reference_number", "school_year", "enrollment_type", "grade_level", "strand", "tvl_specialization",
      "lrn", "psa_birth_cert", "last_name", "first_name", "middle_name", "extension_name",
      "email", "birthdate", "place_of_birth_city", "place_of_birth_province", "mother_tongue", "sex",
      "with_lrn", "returning_learner", "ip_community", "ip_specify",
      "four_ps_beneficiary", "four_ps_household_id", "disability", "disability_type",
      "current_address", "current_city", "current_province", "current_barangay", "current_zip_code", "current_country",
      "same_address", "permanent_address", "permanent_city", "permanent_province",
      "permanent_barangay", "permanent_zip_code", "permanent_country",
      "father_name", "father_contact", "mother_maiden_name", "mother_contact",
      "guardian_name", "guardian_contact",
    ];

    const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");

    await query(
      `INSERT INTO enrollments (${cols.join(", ")}) VALUES (${placeholders})`,
      values
    );

    if (email) {
      try {
        await sendEnrollmentEmail(email, referenceNumber, get("firstName") || "Student", get("enrollmentType") || "new");
      } catch (emailError) {
        console.error("Email send failed:", emailError);
      }
    }

    let savedFiles: Record<string, string> = {};
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "enrollments", referenceNumber);
      await mkdir(uploadDir, { recursive: true });
      for (const [key, value] of formData.entries()) {
        if (value instanceof File && value.size > 0) {
          const ext = value.name.split(".").pop();
          const filename = `${key}.${ext}`;
          const buffer = Buffer.from(await value.arrayBuffer());
          await writeFile(path.join(uploadDir, filename), buffer);
          savedFiles[key] = `/uploads/enrollments/${referenceNumber}/${filename}`;
        }
      }
    } catch {
      console.log("File upload skipped (read-only filesystem)");
    }

    return NextResponse.json({ success: true, referenceNumber, files: savedFiles });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
