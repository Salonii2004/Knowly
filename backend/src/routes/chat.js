
const express = require('express');
const { authenticate } = require('../middleware/auth.js');
const { sequelize } = require('../models/index.js');

const router = express.Router();

// GET /api/chat/history - Fetch chat history for the authenticated user
router.get('/history', authenticate, async (req, res) => {
  try {
    const messages = await sequelize.models.ChatMessage.findAll({
      where: { userId: req.user.id },
      order: [['timestamp', 'ASC']],
    });
    res.status(200).json(
      messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        source: msg.source,
      }))
    );
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// POST /api/chat/message - Save a chat message
router.post('/message', authenticate, async (req, res) => {
  try {
    const { id, role, content, timestamp, source } = req.body;
    if (!id || !role || !content || !timestamp) {
      return res.status(400).json({ error: 'id, role, content, and timestamp are required' });
    }

    await sequelize.models.ChatMessage.create({
      id,
      role,
      content,
      timestamp,
      source: source || null,
      userId: req.user.id,
    });

    res.status(200).json({ message: 'Chat message saved successfully' });
  } catch (err) {
    console.error('Error saving chat message:', err);
    res.status(500).json({ error: 'Failed to save chat message' });
  }
});

module.exports = router;
