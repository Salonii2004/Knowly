// src/routes/health.js
import express from "express";
import axios from "axios";

const router = express.Router();

// GET /api/health - Check server and Ollama health
router.get("/", async (req, res) => {
  try {
    const ollamaUrl = process.env.OLLAMA_API_URL || "http://localhost:11434";

    let ollamaStatus = "unhealthy";
    let availableModels = [];

    try {
      // Fetch available Ollama models
      const response = await axios.get(`${ollamaUrl}/v1/models`);
      if (response.data && Array.isArray(response.data.data)) {
        availableModels = response.data.data.map((model) => ({
          name: model.id,
          created: model.created,
          owned_by: model.owned_by,
        }));
        ollamaStatus = "healthy";
      }
    } catch (error) {
      console.error("Ollama health check failed:", error.message);
      ollamaStatus = "unhealthy";
    }

    res.status(200).json({
      status: "ok",
      server: "running",
      timestamp: new Date().toISOString(),
      ollama: {
        status: ollamaStatus,
        availableModels,
      },
    });
  } catch (err) {
    console.error("Health check error:", err.message);
    res.status(500).json({ status: "error", message: "Health check failed" });
  }
});

export default router;
