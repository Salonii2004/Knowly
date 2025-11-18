import axios from "axios";

// Safely access environment variable for Vite
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
console.log("API_BASE_URL:", API_BASE_URL);

if (!API_BASE_URL) {
  throw new Error('VITE_API_URL is not defined in the environment variables. Please set it in your .env file.');
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken }); // ✅ FIXED
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError: any) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Login
export async function loginUser(email: string, password: string) {
  const res = await api.post("/api/auth/login", { email, password }); // ✅ FIXED
  const { accessToken, refreshToken, user } = res.data;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("user", JSON.stringify(user));
  return user;
}

// Send a chat message (RAG or general chat)
// In your api.ts - update the sendChatMessage function
export async function sendChatMessage(
  message: string,
  model: string = 'mistral:latest',
  token?: string | null,
  isDocumentQuery: boolean = false
): Promise<{
  answer: string;
  sources?: Array<{ id: string; title: string; content: string; similarity: number; sourceNumber: number }>;
  model?: string;
  usage?: { prompt_eval_count: number; eval_count: number };
}> {
  try {
    const endpoint = isDocumentQuery ? '/api/rag/query' : '/api/rag/chat';
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    
    console.log(`Sending request to: ${API_BASE_URL}${endpoint}`);

    // Add timeout for faster failure detection
    const timeoutConfig = { ...config, timeout: 8000 }; // 8 second timeout
    
    const response = await api.post(endpoint, { 
      message, 
      model 
    }, timeoutConfig);
    
    return response.data;
    
  } catch (err: any) {
    console.error("Chat API error:", err);
    
    // 🚀 IMMEDIATE FALLBACK RESPONSES - No waiting for backend
    if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error') || !err.response) {
      // Network connection failed - provide instant fallback
      const fallbackAnswers = [
        "I'm here to help! It seems our chat service is temporarily unavailable. Please try again in a moment.",
        "I'd love to chat with you! The backend connection seems to be down temporarily.",
        "Hello! I'm ready to assist, but there seems to be a connection issue. Please check if the server is running.",
        "Thanks for your message! The AI service is currently unavailable. Try refreshing the page."
      ];
      
      const randomAnswer = fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];
      
      return {
        answer: randomAnswer,
        model: 'fallback',
        usage: { prompt_eval_count: 0, eval_count: 0 }
      };
    }
    
    // For other errors, throw normally
    const errorMessage = err.response?.data?.error || err.message || 'Unknown error';
    throw new Error(errorMessage);
  }
}

// Check Ollama health
export async function checkOllamaHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  availableModels?: Array<{ name: string }>;
  error?: string;
}> {
  try {
    const response = await api.get('/api/health'); // ✅ FIXED
    return {
      status: response.data.ollama.status,
      availableModels: response.data.ollama.availableModels || [],
    };
  } catch (error: any) {
    console.error('Health check error:', error.message);
    return { status: 'unhealthy', availableModels: [], error: 'Chat service is unavailable. Please try again later.' };
  }
}

// Get available Ollama models
export async function getAvailableModels(): Promise<Array<{ name: string }>> {
  try {
    const response = await api.get('/api/health'); // ✅ FIXED
    return response.data.ollama.availableModels || [];
  } catch (error: any) {
    console.error('Models fetch error:', error.message);
    return [];
  }
}

// Search documents
export async function searchDocuments(query: string, topK: number = 5): Promise<any[]> {
  try {
    console.log("🔍 Searching with query:", query);
    const response = await api.post('/api/search', { query, topK }); // ✅ FIXED
    console.log("✅ Search response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Search error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      console.error("❌ Authentication failed - redirecting to login");
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    
    throw new Error(error.response?.data?.error || 'Search failed');
  }
}

// Upload documents
export async function uploadDocuments(documents: Array<{ id: string; text: string; metadata?: any }>): Promise<{ message: string; count: number }> {
  try {
    const response = await api.post('/api/rag/upload', { documents }); // ✅ FIXED - assuming this route exists
    return response.data;
  } catch (error: any) {
    console.error('Upload error:', error.message);
    throw new Error(error.response?.data?.error || 'Upload failed');
  }
}

// Get chat history
export async function getChatHistory(): Promise<any[]> {
  try {
    const response = await api.get('/api/chat/history'); // ⚠️ Check if this route exists in your backend
    return response.data;
  } catch (error: any) {
    console.error('Chat history error:', error.message);
    return [];
  }
}

// Get recent searches
export async function fetchRecentSearches(): Promise<any[]> {
  try {
    const response = await api.get('/api/search/recent'); // ✅ FIXED
    return response.data;
  } catch (error: any) {
    console.error('Recent searches error:', error.message);
    return [];
  }
}

// Test API connection
export async function testConnection(): Promise<{ message: string }> {
  try {
    const response = await api.get('/api/health'); // ✅ FIXED
    return response.data;
  } catch (error: any) {
    console.error('Connection test error:', error.message);
    throw new Error('Backend connection failed. Please try again later.');
  }
}

// Logout
export async function logoutUser() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await api.post('/api/auth/logout', { refreshToken }); // ✅ FIXED
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.clear();
    window.location.href = '/login';
  }
}

export default api;