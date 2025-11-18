import { useState, useCallback } from 'react';
import { ragService } from '../services/ragService';
import { useAuth } from '../contexts/AuthContext'; // Add this import
import { RAGSource, RecentSearch } from '../types/rag';

export const useRAG = () => {
  const [query, setQuery] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [sources, setSources] = useState<RAGSource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [recentQueries, setRecentQueries] = useState<RecentSearch[]>([]);

  // Add authentication context
  const { getToken, user } = useAuth();

  // Query the RAG system
  const askQuestion = useCallback(async (question: string = query) => {
    if (!question.trim()) return;
    
    console.log("🔍 RAG Query Started:", question);
    console.log("👤 User:", user);
    console.log("🔑 Token present:", !!getToken());
    
    setLoading(true);
    setError(null);
    setAnswer('');
    setSources([]);

    try {
      // Check authentication first
      const token = getToken();
      if (!token) {
        throw new Error('Please log in to search documents');
      }

      console.log("🚀 Calling ragService.query...");
      const result = await ragService.query(question);
      console.log("✅ RAG Service Response:", result);
      
      if (result.success && result.data) {
        setAnswer(result.data.answer);
        setSources(result.data.sources || []);
        
        // Add to recent queries
        const newRecent: RecentSearch = {
          id: Date.now().toString(),
          query: question,
          timestamp: new Date().toISOString(),
          resultCount: result.data.sources?.length || 0,
          answer: result.data.answer
        };
        
        setRecentQueries(prev => [newRecent, ...prev.slice(0, 9)]); // Keep last 10
      } else {
        const errorMsg = result.error || 'Failed to get answer from RAG system';
        console.error("❌ RAG Service Error:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error("❌ RAG Query Error:", err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      
      // Don't redirect automatically - show error message instead
      if (errorMsg.includes('401') || errorMsg.includes('auth') || errorMsg.includes('token') || errorMsg.includes('login')) {
        setError('Authentication failed. Please check if you are logged in.');
      } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
        setError('Network error. Please check your connection.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }, [query, getToken, user]);

  // Upload documents
  const uploadDocuments = useCallback(async (files: File[]): Promise<{ success: boolean; count?: number; error?: string }> => {
    if (!files || files.length === 0) {
      return { success: false, error: 'No files provided' };
    }
    
    console.log("📤 Uploading documents:", files.length);
    console.log("🔑 Token present:", !!getToken());
    
    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Check authentication first
      const token = getToken();
      if (!token) {
        throw new Error('Please log in to upload documents');
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      console.log("🚀 Calling ragService.uploadDocuments...");
      const result = await ragService.uploadDocuments(files);
      console.log("✅ Upload Response:", result);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (result.success && result.data) {
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 1000);
        return { success: true, count: result.data.count };
      } else {
        const errorMsg = result.error || 'Upload failed';
        console.error("❌ Upload Error:", errorMsg);
        setError(errorMsg);
        setUploading(false);
        setUploadProgress(0);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error("❌ Upload Error:", err);
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMsg);
      setUploading(false);
      setUploadProgress(0);
      return { success: false, error: errorMsg };
    }
  }, [getToken]);

  // Clear current query and results
  const clearQuery = useCallback(() => {
    setQuery('');
    setAnswer('');
    setSources([]);
    setError(null);
  }, []);

  // Retry last query
  const retry = useCallback(() => {
    if (query) {
      askQuestion();
    }
  }, [query, askQuestion]);

  // Check system health
  const checkHealth = useCallback(async (): Promise<boolean> => {
    try {
      const result = await ragService.health();
      return result.success ? true : false;
    } catch (err) {
      console.error("❌ Health check failed:", err);
      return false;
    }
  }, []);

  return {
    // State
    query,
    answer,
    sources,
    loading,
    error,
    uploading,
    uploadProgress,
    recentQueries,
    
    // Actions
    setQuery,
    askQuestion,
    uploadDocuments,
    clearQuery,
    retry,
    checkHealth
  };
};