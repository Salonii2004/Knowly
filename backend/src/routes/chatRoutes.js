import express from "express";
import { ChatMessage, User } from "../models/index.js";

const router = express.Router();

/**
 * POST /chat
 * Save user message + create AI response
 */
router.post("/", async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: "userId and message are required" });
    }

    // Save user message
    const userMessage = await ChatMessage.create({
      userId,
      role: "user",
      message,
    });

    // TODO: Replace with real AI (e.g., OpenAI) response
    const botResponseText = `Echo: ${message}`;

    // Save bot response
    const botMessage = await ChatMessage.create({
      userId,
      role: "assistant",
      message: botResponseText,
    });

    res.json({
      userMessage,
      botMessage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

/**
 * GET /chat/history/:userId
 * Get all messages for a user
 */
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await ChatMessage.findAll({
      where: { userId },
      order: [["createdAt", "ASC"]],
      include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
