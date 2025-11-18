
const axios = require('axios');
const { sequelize } = require('../models/index.js');

class VectorStore {
  constructor() {
    this.apiUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'mistral:latest';
  }

  // Generate embeddings for a document
  async generateEmbedding(text) {
    try {
      const response = await axios.post(`${this.apiUrl}/api/embeddings`, {
        model: this.model,
        prompt: text,
      });
      return response.data.embedding;
    } catch (error) {
      console.error('Error generating embedding:', error.message);
      throw new Error('Failed to generate embedding');
    }
  }

  // Store a document with its embedding
  async storeDocument({ title, content, userId }) {
    try {
      const embedding = await this.generateEmbedding(content);
      const document = await sequelize.models.Document.create({
        title,
        content,
        userId,
        embedding: JSON.stringify(embedding), // Store embedding as JSON
      });
      return document;
    } catch (error) {
      console.error('Error storing document:', error.message);
      throw new Error('Failed to store document');
    }
  }

  // Search for similar documents
  async searchSimilar(query, userId, limit = 5) {
    try {
      const queryEmbedding = await this.generateEmbedding(query);
      const documents = await sequelize.models.Document.findAll({
        where: { userId },
      });

      // Simple cosine similarity comparison (in-memory)
      const results = documents
        .map(doc => {
          const docEmbedding = JSON.parse(doc.embedding || '[]');
          const similarity = this.cosineSimilarity(queryEmbedding, docEmbedding);
          return { ...doc.dataValues, similarity };
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      return results;
    } catch (error) {
      console.error('Error searching documents:', error.message);
      throw new Error('Failed to search documents');
    }
  }

  // Calculate cosine similarity between two vectors
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
  }
}

module.exports = new VectorStore();
