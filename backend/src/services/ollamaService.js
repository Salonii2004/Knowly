const axios = require('axios');

class OllamaService {
  constructor() {
    this.apiUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'mistral:latest'; // Updated to mistral:latest
  }

  async generateChatCompletion(prompt, model = this.model) {
    try {
      const response = await axios.post(`${this.apiUrl}/api/generate`, {
        model,
        prompt,
      });
      return response.data;
    } catch (error) {
      console.error('Ollama API error:', error.response?.data || error.message);
      throw new Error(`Ollama service error: ${error.response?.statusText || error.message}`);
    }
  }

  async checkHealth() {
    try {
      const response = await axios.get(`${this.apiUrl}/api/tags`);
      return {
        status: 'healthy',
        models: response.data.models,
      };
    } catch (error) {
      console.error('Ollama health check error:', error.message);
      return { status: 'unhealthy', error: error.message };
    }
  }
}

module.exports = new OllamaService();