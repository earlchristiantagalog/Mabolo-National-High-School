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
);
