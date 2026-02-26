import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("visitors.db");

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API to get and increment visitor count
  app.post("/api/visit", (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const stats: any = db.prepare("SELECT * FROM visitor_stats WHERE id = 1").get();

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

    res.json({ today: today_count, total: total_count });
  });

  app.get("/api/stats", (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const stats: any = db.prepare("SELECT * FROM visitor_stats WHERE id = 1").get();
    
    let { total_count, today_count, last_reset_date } = stats;
    
    if (last_reset_date !== today) {
      today_count = 0;
      // We don't update DB here, just return 0 for today if not reset yet
    }

    res.json({ today: today_count, total: total_count });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
