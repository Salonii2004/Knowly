// src/routes/rag.js
import express from 'express';
import { addDocuments, queryDocuments } from '../utils/vectorDB.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Add documents
router.post('/', authenticate, async (req, res) => {
  try {
    const docs = req.body; // Expect array of { id, text, metadata }
    if (!Array.isArray(docs) || docs.some(doc => !doc.id || !doc.text)) {
      return res.status(400).json({ error: 'Invalid documents format. Expected array of { id, text, metadata }' });
    }
    // Optional: Save to Sequelize first (if using relational storage)
    // await sequelize.models.Document.bulkCreate(docs);
    await addDocuments(docs);
    res.status(200).json({ message: 'Documents added successfully' });
  } catch (err) {
    console.error('Error adding documents:', err);
    res.status(500).json({ error: 'Failed to add documents' });
  }
});

// Query documents
router.get('/search', authenticate, async (req, res) => {
  try {
    const { query, topK = 3 } = req.query;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter required' });
    }
    const results = await queryDocuments(query, parseInt(topK));
    res.status(200).json(results);
  } catch (err) {
    console.error('Error querying documents:', err);
    res.status(500).json({ error: 'Failed to query documents' });
  }
});
router.use((req, res, next) => {
  if (!embedderReady) return res.status(503).json({ error: "Embedding service not ready" });
  next();
});



app.get("/api/health", (req, res) => {
  res.json({ status: embedderReady ? "ready" : "loading" });
});


export default router;