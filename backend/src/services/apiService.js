class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('auth_token');
    
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    if (options.body) {
      if (options.body instanceof FormData) {
        // For file uploads, let browser set Content-Type
        delete config.headers['Content-Type'];
        config.body = options.body;
      } else {
        config.body = JSON.stringify(options.body);
      }
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || `HTTP ${response.status}` };
        }
        
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API Request failed:', error);
      return { 
        success: false, 
        error: error.message,
        status: error.name === 'TypeError' ? 'network_error' : 'server_error'
      };
    }
  }

  // RAG Query - Enhanced for your Ollama backend
  async ragQuery(query, topK = 3) {
    return this.request('/rag/query', {
      method: 'POST',
      body: { query }
    });
  }

  // Upload documents to RAG system
  async uploadDocuments(files, metadata = []) {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append('docs', file);
      const meta = metadata[index] || {
        id: `doc-${Date.now()}-${index}`,
        title: file.name,
        text: '', // Will be extracted from file
        metadata: {
          filename: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString()
        }
      };
      formData.append('docs_meta', JSON.stringify(meta));
    });

    return this.request('/rag/upload', {
      method: 'POST',
      body: formData
    });
  }

  // Get RAG system health
  async ragHealth() {
    return this.request('/rag/health');
  }

  // Enhanced search with RAG
  async search(query, filters = {}, useRAG = true) {
    if (useRAG) {
      const ragResult = await this.ragQuery(query, filters.topK || 5);
      
      if (ragResult.success) {
        return {
          success: true,
          data: {
            results: ragResult.data.sources?.map((source, index) => ({
              id: source.id,
              title: source.title,
              content: `Similarity: ${(source.similarity * 100).toFixed(1)}% - Document source`,
              source: 'RAG System',
              score: source.similarity,
              metadata: source,
              type: 'rag'
            })) || [],
            answer: ragResult.data.answer,
            query,
            model: ragResult.data.model,
            timestamp: new Date().toISOString()
          }
        };
      }
    }

    // Fallback to regular search
    return this.request('/search', {
      method: 'POST',
      body: { query, filters }
    });
  }

  // Chat with RAG context
  async chat(messages, useRAG = true) {
    const lastMessage = messages[messages.length - 1];
    
    if (useRAG && lastMessage.role === 'user') {
      const ragResult = await this.ragQuery(lastMessage.content, 3);
      
      if (ragResult.success) {
        const context = ragResult.data.sources?.map(src => 
          `[Source: ${src.title}] Similarity: ${(src.similarity * 100).toFixed(1)}%`
        ).join('\n') || '';

        return this.request('/chat', {
          method: 'POST',
          body: {
            messages: [
              ...messages.slice(0, -1),
              {
                ...lastMessage,
                content: `Context from documents:\n${context}\n\nQuestion: ${lastMessage.content}`
              }
            ],
            context: ragResult.data.answer,
            use_rag: true
          }
        });
      }
    }

    return this.request('/chat', {
      method: 'POST',
      body: { messages, use_rag: false }
    });
  }

  // System health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();