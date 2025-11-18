// frontend/src/services/ragService.ts
import api from '../api/api';

export const ragService = {
  async query(question: string) {
    try {
      const response = await api.post('/api/rag/query', { 
        message: question,
        model: 'mistral:latest'
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('RAG Query Error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Query failed'
      };
    }
  },

  async uploadDocuments(files: File[]) {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('documents', file);
      });

      const response = await api.post('/api/rag/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Upload Error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Upload failed'
      };
    }
  },

  async health() {
    try {
      const response = await api.get('/api/health');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Health Check Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};