import { Pool } from "@neondatabase/serverless";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function query<T = Record<string, unknown>>(text: string, values: unknown[] = []): Promise<T> {
  const result = await pool.query(text, values);
  return result.rows as T;
}
