import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { syncDatabase } from "./models/index.js";
import authRouter from "./routes/auth.js";
import ragRouter from "./routes/rag.js";
import searchRouter from "./routes/search.js";
import healthRouter from "./routes/health.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Mounts
app.use("/api/auth", authRouter);
app.use("/api/rag", ragRouter);
app.use("/api/search", searchRouter);
app.use("/api/health", healthRouter);

// Performance monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`⚡ ${req.method} ${req.url} - ${duration}ms`);
  });
  next();
});

// Default route
app.get("/", (req, res) => res.json({ 
  status: "Server running ✅",
  performance: "Optimized for fast responses"
}));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ 
    error: 'Service optimizing for speed. Please try again.' 
  });
});

syncDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Fast server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("Database sync failed:", err));

export default app;