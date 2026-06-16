import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import mysql from "mysql2/promise";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function getEnrollments() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    database: process.env.MYSQL_DATABASE || "mnhs",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
  });
  const [rows] = await pool.execute(
    "SELECT * FROM enrollments ORDER BY created_at DESC"
  );
  await pool.end();
  return rows;
}

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("fetch-applicants", async () => {
      try {
        const data = await getEnrollments();
        socket.emit("applicants-data", data);
      } catch (err) {
        socket.emit("applicants-error", "Failed to fetch data");
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Broadcast new enrollment when called externally
  (global as any).broadcastEnrollment = (data: any) => {
    io.emit("new-enrollment", data);
  };

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}/registrar`);
  });
});
