import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

console.log("Server starting...");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db: any;
try {
  db = new Database("visitors.db");
  // Initialize database
  db.exec(`
    CREATE TABLE IF NOT EXISTS visitor_stats (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      total_count INTEGER DEFAULT 0,
      today_count INTEGER DEFAULT 0,
      last_reset_date TEXT
    )
  `);

  // Insert initial record if not exists
  const row = db.prepare("SELECT * FROM visitor_stats WHERE id = 1").get();
  if (!row) {
    db.prepare("INSERT INTO visitor_stats (id, total_count, today_count, last_reset_date) VALUES (1, 0, 0, ?)").run(new Date().toISOString().split('T')[0]);
  }
  console.log("Database initialized successfully");
} catch (err) {
  console.error("Failed to initialize database, using in-memory fallback:", err);
  // Simple in-memory fallback
  const memoryStats = {
    total_count: 0,
    today_count: 0,
    last_reset_date: new Date().toISOString().split('T')[0]
  };
  db = {
    prepare: (sql: string) => ({
      get: () => memoryStats,
      run: (...args: any[]) => {
        if (sql.includes("UPDATE")) {
          memoryStats.total_count = args[0];
          memoryStats.today_count = args[1];
          memoryStats.last_reset_date = args[2];
        }
      }
    })
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Request logger
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API to get and increment visitor count
  app.post("/api/visit", (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const stats = db.prepare("SELECT * FROM visitor_stats WHERE id = 1").get();

      let { total_count, today_count, last_reset_date } = stats;

      if (last_reset_date !== today) {
        today_count = 1;
        last_reset_date = today;
      } else {
        today_count += 1;
      }
      total_count += 1;

      db.prepare("UPDATE visitor_stats SET total_count = ?, today_count = ?, last_reset_date = ? WHERE id = 1")
        .run(total_count, today_count, last_reset_date);

      console.log(`Visit tracked: Today=${today_count}, Total=${total_count}`);
      res.json({ today: today_count, total: total_count });
    } catch (error) {
      console.error("Error in /api/visit:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/api/stats", (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const stats = db.prepare("SELECT * FROM visitor_stats WHERE id = 1").get();
      
      let { total_count, today_count, last_reset_date } = stats;
      
      if (last_reset_date !== today) {
        today_count = 0;
      }

      res.json({ today: today_count, total: total_count });
    } catch (error) {
      console.error("Error in /api/stats:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Vite in middleware mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static files from dist...");
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
