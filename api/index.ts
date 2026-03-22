import express from "express";
import NodeCache from "node-cache";

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// In-memory storage for analytics and feature flags
// Note: These will be reset on every function invocation or instance restart on Vercel
const analyticsLogs: any[] = [];
const featureFlags = [
  {
    id: "video-generation",
    name: "Video Generation",
    description: "AI-powered video synthesis for niches",
    isEnabled: true,
    rolloutPercentage: 10
  },
  {
    id: "neural-synthesis-v2",
    name: "Neural Synthesis v2",
    description: "Advanced prompt generation engine",
    isEnabled: true,
    rolloutPercentage: 100
  }
];

app.use(express.json({ limit: '10mb' }));

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

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

app.post("/api/analytics", (req, res) => {
  const log = {
    ...req.body,
    serverTimestamp: new Date().toISOString(),
    ip: req.ip
  };
  analyticsLogs.push(log);
  if (analyticsLogs.length > 1000) analyticsLogs.shift();
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

app.get("/api/feature-flags", (req, res) => {
  res.json(featureFlags);
});

export default app;
