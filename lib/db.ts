import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "mnhs",
  ssl: process.env.MYSQL_SSL === "true" ? { rejectUnauthorized: true } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function query(sql: string, params?: any[]) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
