import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import NodeCache from "node-cache";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

async function startServer() {
  try {
    const app = express();
    const PORT = 3000;

    app.use(express.json({ limit: '10mb' }));

    // API Routes
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok" });
    });

    // Generic cache proxy for Gemini results
    // This allows the frontend to persist expensive AI results across sessions
    app.post("/api/cache", (req, res) => {
      const { key, data } = req.body;
      if (!key || !data) {
        return res.status(400).json({ error: "Key and data are required" });
      }
      cache.set(key, data);
      res.json({ status: "ok" });
    });

    app.get("/api/cache/:key", (req, res) => {
      const data = cache.get(req.params.key);
      if (data) {
        res.json({ data });
      } else {
        res.status(404).json({ error: "Not found" });
      }
    });

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
