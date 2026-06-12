-- Run this in your Supabase SQL Editor (https://app.supabase.com/project/_/sql)

-- 1. Create sequence for generating student ID numbers
CREATE SEQUENCE IF NOT EXISTS student_id_seq START 1;

-- 2. Function to generate student ID: YEAR + 4-digit padded number
CREATE OR REPLACE FUNCTION generate_student_id()
RETURNS TEXT AS $$
DECLARE
  year_prefix TEXT;
  next_num INTEGER;
BEGIN
  year_prefix := TO_CHAR(NOW(), 'YYYY');
  next_num := NEXTVAL('student_id_seq');
  RETURN year_prefix || LPAD(CAST(next_num AS TEXT), 4, '0');
END;
$$ LANGUAGE plpgsql;

-- 3. Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id BIGSERIAL PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL DEFAULT generate_student_id(),
  enrollment_type TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  strand TEXT,
  tvl_specialization TEXT,
  lrn TEXT,
  psa_birth_cert TEXT,
  last_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  extension_name TEXT,
  birthdate DATE NOT NULL,
  place_of_birth_city TEXT,
  place_of_birth_province TEXT,
  mother_tongue TEXT,
  sex TEXT NOT NULL,
  with_lrn TEXT,
  returning_learner TEXT,
  ip_community TEXT,
  ip_specify TEXT,
  four_ps_beneficiary TEXT,
  four_ps_household_id TEXT,
  disability TEXT,
  disability_type TEXT[],
  current_address TEXT,
  current_city TEXT,
  current_province TEXT,
  current_barangay TEXT,
  current_zip_code TEXT,
  current_country TEXT,
  same_address TEXT,
  permanent_address TEXT,
  permanent_city TEXT,
  permanent_province TEXT,
  permanent_barangay TEXT,
  permanent_zip_code TEXT,
  permanent_country TEXT,
  father_name TEXT,
  father_contact TEXT,
  mother_maiden_name TEXT,
  mother_contact TEXT,
  guardian_name TEXT,
  guardian_contact TEXT,
  status TEXT DEFAULT 'pending',
  school_year TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 6. Policies: allow anon inserts (public forms)
CREATE POLICY "Allow anon insert enrollments" ON enrollments
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon insert contact" ON contact_messages
  FOR INSERT TO anon WITH CHECK (true);

-- 7. Indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_school_year ON enrollments(school_year);
