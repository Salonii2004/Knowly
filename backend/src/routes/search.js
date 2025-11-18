import express from "express";
import { authenticate } from "../middleware/auth.js";
import fetch from "node-fetch";

const router = express.Router();

// POST /api/search - general queries (not document RAG)
router.post("/", authenticate, async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";

    const response = await fetch(`${OLLAMA_API_URL}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral:latest",
        messages: [{ role: "user", content: query }],
      }),
    });

    // Read raw text first
    const text = await response.text();

    if (!response.ok) {
      console.error("Ollama returned error:", text);
      return res.status(response.status).json({ error: `Ollama error: ${text}` });
    }

    // Try parsing JSON safely
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse Ollama JSON:", text);
      return res.status(500).json({ error: "Failed to parse Ollama response" });
    }

    const answer = data.choices?.[0]?.message?.content || "No answer generated";

    res.json({ answer, model: "mistral:latest", usage: data.usage || {} });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: err.message || "Failed to process query" });
  }
});



router.get("/recent", async (req, res) => {
  try {
    // Implement your recent searches logic here
    const recentSearches = []; // Replace with actual data
    res.json(recentSearches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
