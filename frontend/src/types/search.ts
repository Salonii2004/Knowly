export interface SearchResult {
  type: string;
  id: string;
  title: string;
  snippet: string;
  url: string;
  source: string;
  score: number;
}

export interface SearchFilters {
  source?: string;
  dateRange?: { from: string; to: string };
  keywords?: string[];
}
