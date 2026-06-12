-- Run this in your MySQL database (phpMyAdmin, MySQL Workbench, or CLI)

CREATE DATABASE IF NOT EXISTS mnhs;
USE mnhs;

-- Enrollments table with auto-generated student ID
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(10) NOT NULL UNIQUE,
  enrollment_type VARCHAR(20) NOT NULL,
  grade_level VARCHAR(2) NOT NULL,
  strand VARCHAR(50) DEFAULT NULL,
  tvl_specialization VARCHAR(50) DEFAULT NULL,
  lrn VARCHAR(12) DEFAULT NULL,
  psa_birth_cert VARCHAR(255) DEFAULT NULL,
  last_name VARCHAR(100) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100) DEFAULT NULL,
  extension_name VARCHAR(10) DEFAULT NULL,
  birthdate DATE NOT NULL,
  place_of_birth_city VARCHAR(100) DEFAULT NULL,
  place_of_birth_province VARCHAR(100) DEFAULT NULL,
  mother_tongue VARCHAR(50) DEFAULT NULL,
  sex VARCHAR(10) NOT NULL,
  with_lrn VARCHAR(5) DEFAULT NULL,
  returning_learner VARCHAR(5) DEFAULT NULL,
  ip_community VARCHAR(5) DEFAULT NULL,
  ip_specify VARCHAR(100) DEFAULT NULL,
  four_ps_beneficiary VARCHAR(5) DEFAULT NULL,
  four_ps_household_id VARCHAR(50) DEFAULT NULL,
  disability VARCHAR(5) DEFAULT NULL,
  disability_type JSON DEFAULT NULL,
  current_address TEXT DEFAULT NULL,
  current_city VARCHAR(100) DEFAULT NULL,
  current_province VARCHAR(100) DEFAULT NULL,
  current_barangay VARCHAR(100) DEFAULT NULL,
  current_zip_code VARCHAR(10) DEFAULT NULL,
  current_country VARCHAR(100) DEFAULT NULL,
  same_address VARCHAR(5) DEFAULT NULL,
  permanent_address TEXT DEFAULT NULL,
  permanent_city VARCHAR(100) DEFAULT NULL,
  permanent_province VARCHAR(100) DEFAULT NULL,
  permanent_barangay VARCHAR(100) DEFAULT NULL,
  permanent_zip_code VARCHAR(10) DEFAULT NULL,
  permanent_country VARCHAR(100) DEFAULT NULL,
  father_name VARCHAR(200) DEFAULT NULL,
  father_contact VARCHAR(50) DEFAULT NULL,
  mother_maiden_name VARCHAR(200) DEFAULT NULL,
  mother_contact VARCHAR(50) DEFAULT NULL,
  guardian_name VARCHAR(200) DEFAULT NULL,
  guardian_contact VARCHAR(50) DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  school_year VARCHAR(9) NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes
CREATE INDEX idx_student_id ON enrollments(student_id);
CREATE INDEX idx_status ON enrollments(status);
CREATE INDEX idx_school_year ON enrollments(school_year);
