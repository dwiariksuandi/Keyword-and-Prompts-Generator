import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import NodeCache from "node-cache";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// In-memory storage for analytics and feature flags
const analyticsLogs: any[] = [];
const featureFlags = [
  {
    id: "video-generation",
    name: "Video Generation",
    description: "AI-powered video synthesis for niches",
    isEnabled: true,
    rolloutPercentage: 10 // Only 10% of users see this
  },
  {
    id: "neural-synthesis-v2",
    name: "Neural Synthesis v2",
    description: "Advanced prompt generation engine",
    isEnabled: true,
    rolloutPercentage: 100 // Fully rolled out
  }
];

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

    // Analytics Dashboard Endpoint
    app.post("/api/analytics", (req, res) => {
      const log = {
        ...req.body,
        serverTimestamp: new Date().toISOString(),
        ip: req.ip
      };
      analyticsLogs.push(log);
      if (analyticsLogs.length > 1000) analyticsLogs.shift(); // Keep last 1000
      console.log(`[Analytics] Event: ${log.event} (${log.testId || 'General'})`);
      res.json({ status: "ok" });
    });

    app.get("/api/analytics/stats", (req, res) => {
      const stats = analyticsLogs.reduce((acc: any, log: any) => {
        const key = log.testId || 'General';
        if (!acc[key]) acc[key] = { total: 0, variants: {} };
        acc[key].total++;
        if (log.variant) {
          if (!acc[key].variants[log.variant]) acc[key].variants[log.variant] = 0;
          acc[key].variants[log.variant]++;
        }
        return acc;
      }, {});
      res.json(stats);
    });

    // Feature Flagging Endpoint
    app.get("/api/feature-flags", (req, res) => {
      res.json(featureFlags);
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
