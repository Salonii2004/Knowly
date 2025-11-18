// frontend/src/components/search/SearchResults.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { SearchResult } from '../../hooks/useSearch';

export interface SearchResultsProps {
  results: SearchResult[];
  className?: string;
  variants?: any; // Use any to avoid complex Framer Motion types
  renderItem?: (result: SearchResult, index: number) => React.ReactNode;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  className = '',
  variants,
  renderItem
}) => {
  const defaultRenderItem = (result: SearchResult, index: number) => (
    <motion.div
      key={result.id}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={variants}
      className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:border-blue-200/70 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-sm">
              {result.type === 'documents' ? '📄' : 
               result.type === 'websites' ? '🌍' : 
               result.type === 'crm' ? '👥' : '🧠'}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 line-clamp-1">
              {result.title}
            </h4>
            <p className="text-xs text-gray-500 capitalize">
              {result.type} • {result.date || 'Recent'}
            </p>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
        {result.snippet}
      </p>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center space-x-1">
            <span>⭐</span>
            <span>{Math.round((result.relevance || 0.7) * 100)}%</span>
          </span>
          <span>•</span>
          <span>AI Verified</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={className}>
      {results.map((result, index) => 
        renderItem ? renderItem(result, index) : defaultRenderItem(result, index)
      )}
    </div>
  );
};

// Keep default export for backward compatibility
export default SearchResults;