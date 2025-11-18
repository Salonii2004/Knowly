// frontend/src/hooks/useSearch.ts
import { useState, useEffect } from 'react';

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  type: string;
  date?: string;
  relevance?: number;
}

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
}

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Mock function to simulate search
  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock results
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Enterprise Data Analysis Report',
          snippet: 'Comprehensive analysis of enterprise data patterns and insights gathered from multiple sources.',
          type: 'documents',
          date: '2024-01-15',
          relevance: 0.95
        },
        {
          id: '2',
          title: 'Customer Relationship Management Data',
          snippet: 'Latest updates from CRM system including customer interactions and sales pipeline.',
          type: 'crm',
          date: '2024-01-14',
          relevance: 0.87
        },
        {
          id: '3',
          title: 'Knowledge Base Documentation',
          snippet: 'Technical documentation and knowledge base articles for enterprise systems.',
          type: 'knowledge',
          date: '2024-01-13',
          relevance: 0.78
        }
      ];
      
      setResults(mockResults);
      
      // Add to recent searches
      if (searchQuery.trim()) {
        const newSearch: RecentSearch = {
          id: Date.now().toString(),
          query: searchQuery,
          timestamp: Date.now()
        };
        setRecentSearches(prev => [newSearch, ...prev.slice(0, 4)]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Search failed'));
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    if (query.trim()) {
      performSearch(query);
    }
  };

  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
    } else {
      setResults([]);
    }
  }, [query]);

  return {
    query,
    setQuery,
    results,
    recentSearches,
    loading,
    error,
    retry
  };
};