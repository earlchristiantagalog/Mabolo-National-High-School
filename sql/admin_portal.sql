CREATE TABLE IF NOT EXISTS sections (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  grade VARCHAR(20) NOT NULL,
  adviser VARCHAR(100),
  room_no VARCHAR(20),
  student_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS section_periods (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE,
  day VARCHAR(20) NOT NULL,
  time VARCHAR(50) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  teacher VARCHAR(100),
  room_no VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS section_students (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE,
  enrollment_id INTEGER REFERENCES enrollments(id) ON DELETE SET NULL,
  lrn VARCHAR(20),
  full_name VARCHAR(200) NOT NULL,
  gender VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);
