const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');

// Read .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

async function main() {
  const pool = new Pool({ connectionString: env.DATABASE_URL });

  const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
  console.log('All tables:', tables.rows.map(t => t.table_name).join(', '));

  for (const row of tables.rows) {
    try {
      const count = await pool.query(`SELECT COUNT(*) FROM "${row.table_name}"`);
      console.log(`  ${row.table_name}: ${count.rows[0].count} rows`);
    } catch (e) {
      console.log(`  ${row.table_name}: ERROR - ${e.message}`);
    }
  }

  await pool.end();
}

main().catch(e => { console.error(e.message); process.exit(1); });
