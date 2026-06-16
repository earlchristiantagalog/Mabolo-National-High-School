import mysql from 'mysql2/promise';

let pool: mysql.Pool;

if (process.env.NODE_ENV === 'production') {
    pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        connectionLimit: 10,
    });
} else {
    // Prevent hot-reloads from creating multiple pools in development
    if (!(global as any)._mysqlPool) {
        (global as any)._mysqlPool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT || '3306'),
            database: process.env.MYSQL_DATABASE,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            connectionLimit: 10,
        });
    }
    pool = (global as any)._mysqlPool;
}

export async function query<T>(sql: string, values: any[] = []): Promise<T> {
    const [rows] = await pool.execute(sql, values);
    return rows as T;
}