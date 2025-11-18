// frontend/src/components/search/SearchBar.tsx
import React from 'react';
import { motion } from 'framer-motion';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  className?: string;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  className = '',
  placeholder = 'Search...'
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <motion.input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 pr-12 bg-white/95 backdrop-blur-lg border-2 border-gray-200/70 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 text-lg placeholder-gray-400 shadow-xl hover:shadow-2xl"
        whileFocus={{ scale: 1.02 }}
      />
      <motion.button
        type="submit"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
      >
        <motion.span
          animate={{ rotate: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🔍
        </motion.span>
      </motion.button>
    </form>
  );
};

// Keep default export for backward compatibility
export default SearchBar;