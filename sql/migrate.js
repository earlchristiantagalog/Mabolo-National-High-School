require('dotenv').config({ path: '.env.local' });
const { Pool } = require('@neondatabase/serverless');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  // Ensure teacher_accounts table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS teacher_accounts (
      id SERIAL PRIMARY KEY,
      teacher_name VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL,
      account_id VARCHAR(20) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('teacher_accounts table created/verified');

  // List all tables
  const r = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
  console.log('All tables:', r.rows.map(t => t.table_name).join(', '));

  await pool.end();
}

main().catch(e => { console.error(e.message); process.exit(1); });
