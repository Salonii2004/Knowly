import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRAG } from '../../hooks/useRAG';

export const RAGSearch: React.FC = () => {
  const {
    query,
    setQuery,
    answer,
    sources,
    loading,
    error,
    askQuestion,
    clearQuery,
    retry,
    recentQueries
  } = useRAG();

  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    askQuestion();
  };

  const handleQuickQuestion = (quickQuery: string) => {
    setQuery(quickQuery);
    askQuestion(quickQuery);
  };

  const quickQuestions = [
    "What are the main topics in my documents?",
    "Summarize the key points from uploaded files",
    "Find information about AI implementation",
    "What security guidelines are mentioned?",
    "Extract important dates and deadlines"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Search Input */}
      <motion.form
        onSubmit={handleSubmit}
        className="relative mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask a question about your documents..."
            className="w-full px-6 py-4 text-lg bg-white/95 backdrop-blur-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all duration-300 pr-40 placeholder-gray-500 shadow-lg"
            disabled={loading}
          />
          
          <div className="absolute right-2 top-2 flex gap-2">
            {query && (
              <button
                type="button"
                onClick={clearQuery}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            )}
            
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                !query.trim() || loading
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Thinking...
                </div>
              ) : (
                'Ask AI'
              )}
            </button>
          </div>
        </div>
      </motion.form>

      {/* Quick Questions */}
      {!query && recentQueries.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Try asking:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickQuestions.map((question, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => handleQuickQuestion(question)}
                className="p-4 text-left bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all duration-300 group"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="text-cyan-600 text-sm mb-1">💡</div>
                <div className="text-gray-700 text-sm group-hover:text-cyan-800">
                  {question}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Queries */}
      {recentQueries.length > 0 && !query && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Questions</h3>
          <div className="space-y-3">
            {recentQueries.slice(0, 5).map((recent) => (
              <motion.div
                key={recent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-white/60 backdrop-blur-lg rounded-xl border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-gray-900 font-medium">{recent.query}</div>
                  <button
                    onClick={() => handleQuickQuestion(recent.query)}
                    className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                  >
                    Ask again
                  </button>
                </div>
                <div className="text-gray-600 text-sm line-clamp-2">
                  {recent.answer}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">!</span>
                </div>
                <span className="text-red-700">{error}</span>
              </div>
              <button
                onClick={retry}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Answer */}
      <AnimatePresence>
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Answer</h3>
              </div>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {answer}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sources */}
      <AnimatePresence>
        {sources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Sources ({sources.length})
            </h3>
            <div className="grid gap-4">
              {sources.map((source, index) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-gray-200 hover:border-cyan-300 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{source.title}</h4>
                    <span className="text-xs text-cyan-600 bg-cyan-100 px-2 py-1 rounded-full">
                      {Math.round((source.similarity || 0) * 100)}% match
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Source #{source.sourceNumber} • {source.id}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!query && !answer && recentQueries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Ask Questions About Your Documents
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Upload documents and ask questions in natural language. The AI will search through your content and provide answers with sources.
          </p>
        </motion.div>
      )}
    </div>
  );
};