import { embedderReady } from "../utils/vectorDB.js";

export async function chatHandler(req, res) {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: "Message is required." });

  try {
    const reply = await getOpenAIResponse(message);
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Failed to generate response." });
  }
}
