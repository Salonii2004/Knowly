export interface RAGDocument {
  id: string;
  title: string;
  text: string;
  embedding?: number[];
  metadata?: {
    fileName?: string;
    size?: number;
    type?: string;
    uploadedAt?: string;
    source?: string;
  };
}

export interface RAGQueryResponse {
  answer: string;
  sources: RAGSource[];
  model?: string;
  query: string;
}

export interface RAGSource {
  id: string;
  title: string;
  similarity: number;
  sourceNumber: number;
  text?: string;
  metadata?: Record<string, any>;
}

export interface RAGUploadResponse {
  message: string;
  count: number;
  documents?: RAGDocument[];
}

export interface RAGHealthResponse {
  status: "healthy" | "unhealthy";
  availableModels?: Array<{ name: string }>;
  error?: string;
}

export interface DocumentInput {
  id: string;
  title?: string;
  text?: string;
  metadata?: {
    fileName?: string;
    size?: number;
    type?: string;
    uploadedAt?: string;
  };
  status?: "pending" | "uploading" | "uploaded" | "error";
  file?: File;
  progress?: number;
  uploadedAt?: string;
}

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: string;
  resultCount?: number;
  answer?: string;
}

// Search result interface for display
export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  type: string;
  relevance?: number;
  date?: string;
  source?: string;
}