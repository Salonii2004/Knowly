// frontend/src/pages/Search.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRAG } from "../hooks/useRAG";
import { RAGSource, RecentSearch, SearchResult } from "../types/rag";

// Quantum Spinner Component
const QuantumSpinner = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    className="flex flex-col items-center justify-center py-16"
  >
    <div className="relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-transparent rounded-full bg-gradient-conic from-cyan-500 via-blue-600 to-purple-600"
      />
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg"
      />
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            x: [0, Math.cos(i * 90) * 30, 0],
            y: [0, Math.sin(i * 90) * 30, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-6 text-center"
    >
      <motion.p
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent"
      >
        AI Processing Your Question
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-gray-500 mt-2"
      >
        Searching through your documents with RAG technology...
      </motion.p>
    </motion.div>
  </motion.div>
);

// Skeleton Loader Component
const SkeletonLoader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  >
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className="group"
      >
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-gray-200/50 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse" />
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg flex-1 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-4/6" />
            </div>
            <div className="flex justify-between items-center pt-4">
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 animate-pulse" />
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

// Floating Particle Component
const FloatingParticle = ({ delay = 0 }: { delay?: number }) => {
  const x = useMotionValue(Math.random() * 100);
  const y = useMotionValue(Math.random() * 100);
  
  const springX = useSpring(x, { damping: 20, stiffness: 100 });
  const springY = useSpring(y, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const interval = setInterval(() => {
      x.set(Math.random() * 100);
      y.set(Math.random() * 100);
    }, 10000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, [x, y]);

  return (
    <motion.div
      className="absolute rounded-full opacity-40"
      style={{
        width: Math.random() * 4 + 1,
        height: Math.random() * 4 + 1,
        x: springX,
        y: springY,
        background: `linear-gradient(45deg, 
          hsl(${Math.random() * 360}, 100%, 65%), 
          hsl(${Math.random() * 360}, 100%, 65%))`,
      }}
      initial={{ scale: 0 }}
      animate={{
        scale: [0, 1.5, 0],
        opacity: [0, 0.6, 0],
      }}
      transition={{ 
        duration: 8 + Math.random() * 4, 
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// Quantum Confetti Component
const QuantumConfetti = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
    {[...Array(50)].map((_, i) => {
      const shapes = ["■", "●", "▲", "★", "♦", "♥", "♠", "♣", "✶", "✦"];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = Math.random() * 24 + 12;
      const colors = [
        "from-cyan-500 to-blue-500",
        "from-purple-500 to-indigo-500", 
        "from-blue-500 to-cyan-500",
        "from-emerald-500 to-green-500",
        "from-amber-500 to-orange-500"
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      return (
        <motion.div
          key={i}
          className={`absolute font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}
          style={{
            fontSize: `${size}px`,
          }}
          initial={{ 
            x: "50%", 
            y: "50%", 
            scale: 0, 
            rotate: 0,
            opacity: 0
          }}
          animate={{
            x: `${(Math.random() - 0.5) * 200}%`,
            y: `${(Math.random() - 0.5) * 200}%`,
            scale: [0, 1.3, 0],
            rotate: Math.random() * 720,
            opacity: [0, 1, 0],
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 2 + Math.random() * 1.5, 
            ease: "easeOut",
            delay: Math.random() * 0.5
          }}
        >
          {shape}
        </motion.div>
      );
    })}
  </div>
);

// Search Bar Component
const SearchBar: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  className?: string;
  placeholder?: string;
}> = ({ value, onChange, onSubmit, className = "", placeholder = "Search..." }) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        className={className}
        placeholder={placeholder}
      />
    </div>
  );
};

// Search Results Component
const SearchResults: React.FC<{
  results: SearchResult[];
  className?: string;
  variants?: any;
  renderItem: (result: SearchResult, index: number) => React.ReactNode;
}> = ({ results, className = "", variants, renderItem }) => {
  return (
    <div className={className}>
      {results.map((result, index) => renderItem(result, index))}
    </div>
  );
};

// Animation Variants
const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  enter: { 
    opacity: 1, 
    scale: 1,
  }
};

const resultVariants = {
  hidden: { 
    opacity: 0, 
    y: 30, 
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
  },
  hover: { 
    scale: 1.03, 
    y: -5,
  },
};

const filterVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.9 },
  visible: { opacity: 1, x: 0, scale: 1 },
  hover: { scale: 1.05, y: -1 }
};

// Main Search Component with RAG Integration
const SearchPage: React.FC = () => {
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

  const [showConfetti, setShowConfetti] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchCount, setSearchCount] = useState(0);

  const handleSearchSubmit = () => {
    if (!query.trim()) return;
    
    setSearchCount(prev => prev + 1);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    askQuestion();
  };

  const handleClearSearch = () => {
    clearQuery();
    setFilter("all");
  };

  const handleRetry = () => {
    retry();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handleQuickQuestion = (quickQuery: string) => {
    setQuery(quickQuery);
    askQuestion(quickQuery);
  };

  // Convert RAG sources to search results for display
  const ragResults: SearchResult[] = sources.map((source: RAGSource, index: number) => ({
    id: source.id,
    title: source.title,
    snippet: source.text || `Document source with ${(source.similarity * 100).toFixed(1)}% relevance match`,
    type: 'documents',
    date: new Date().toISOString(),
    relevance: source.similarity,
    source: 'RAG System'
  }));

  const filters = [
    { id: "all", label: "All Results", icon: "🌐", count: ragResults.length },
    { id: "documents", label: "Documents", icon: "📄", count: ragResults.length },
    { id: "ai", label: "AI Answer", icon: "🤖", count: answer ? 1 : 0 },
  ];

  const filteredResults = filter === "ai" ? [] : ragResults;

  const stats = {
    total: ragResults.length,
    sources: Array.from(new Set(ragResults.map(r => r.type))).length
  };

  const quickQuestions = [
    "What are the main topics in my documents?",
    "Summarize the key points from uploaded files",
    "Find information about AI implementation",
    "What security guidelines are mentioned?",
    "Extract important dates and deadlines"
  ];

  return (
    <motion.div
      initial="initial"
      animate="enter"
      variants={pageVariants}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-100/20 flex flex-col relative overflow-hidden"
    >
      {/* Advanced Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-0 -right-40 w-[600px] h-[600px] bg-cyan-400 rounded-full mix-blend-soft-light filter blur-[120px] opacity-20"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute bottom-0 -left-40 w-[600px] h-[600px] bg-blue-400 rounded-full mix-blend-soft-light filter blur-[120px] opacity-20"
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {[...Array(20)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.3} />
        ))}

        <div className="absolute inset-0 opacity-[0.02]">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>
      </div>

      <main className="flex-grow p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/60 p-8 transition-all duration-500 hover:shadow-3xl relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(6, 182, 212, 0.3) 2%, transparent 0%), 
                              radial-gradient(circle at 75px 75px, rgba(59, 130, 246, 0.2) 2%, transparent 0%)`,
              backgroundSize: '100px 100px'
            }} />
          </div>

          <div className="relative z-10">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8 text-center"
            >
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-xl text-white">🤖</span>
                </div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
                  Knowly Search
                </h1>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                Ask questions about your documents and get AI-powered answers with sources.
              </p>
            </motion.div>

            {/* Search Bar Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8"
            >
              <div className="max-w-4xl mx-auto">
                <SearchBar
                  value={query}
                  onChange={setQuery}
                  onSubmit={handleSearchSubmit}
                  className="w-full p-5 pr-14 bg-white/95 backdrop-blur-lg border-2 border-gray-200/70 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all duration-300 text-lg placeholder-gray-400 shadow-xl hover:shadow-2xl"
                  placeholder="Ask anything about your documents..."
                />
                
                {query && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center justify-between mt-4 text-sm text-gray-500"
                  >
                    <div className="flex items-center space-x-6">
                      <span className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span>RAG Analysis Active</span>
                      </span>
                      <span>{stats.sources} data sources</span>
                    </div>
                    <span>Search #{searchCount}</span>
                  </motion.div>
                )}
              </div>
            </motion.div>

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
            {!query && recentQueries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 max-w-4xl mx-auto"
              >
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                  <span>🕒</span>
                  <span>Recent Questions</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {recentQueries.map((search: RecentSearch, i: number) => (
                    <motion.button
                      key={search.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setQuery(search.query);
                        askQuestion(search.query);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100/80 backdrop-blur-sm rounded-xl hover:bg-gray-200 transition-all duration-300 border border-gray-200/50 hover:border-gray-300 shadow-sm"
                    >
                      {search.query}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AI Answer Section */}
            <AnimatePresence>
              {answer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">AI</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">AI Answer</h3>
                      <span className="text-xs text-cyan-600 bg-cyan-100 px-2 py-1 rounded-full">
                        RAG Powered
                      </span>
                    </div>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {answer}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-8"
            >
              <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
                {filters.map((f, i) => (
                  <motion.button
                    key={f.id}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    variants={filterVariants}
                    onClick={() => setFilter(f.id)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border ${
                      filter === f.id
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg border-transparent"
                        : "bg-white/80 text-gray-700 hover:bg-white border-gray-200/60 hover:border-gray-300 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <span className="text-lg">{f.icon}</span>
                    <span>{f.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      filter === f.id 
                        ? "bg-white/20 text-white" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {f.count}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {error ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200/50"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl text-white">⚠️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Search Error</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {error}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRetry}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    🔄 Retry Search
                  </motion.button>
                </motion.div>
              ) : loading ? (
                <QuantumSpinner />
              ) : filteredResults.length === 0 && query && !answer ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200/50"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl text-white">📚</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Documents Found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Try uploading documents first or ask a different question.
                  </p>
                  <Link 
                    to="/upload"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span>Upload Documents</span>
                    <span>→</span>
                  </Link>
                </motion.div>
              ) : filteredResults.length > 0 ? (
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      Found {filteredResults.length} relevant documents
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>RAG-Powered Search</span>
                    </div>
                  </motion.div>

                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <SearchResults
                      results={filteredResults}
                      className="space-y-6"
                      variants={resultVariants}
                      renderItem={(result: SearchResult, index: number) => (
                        <motion.div
                          key={result.id}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                          variants={resultVariants}
                          className="group relative"
                        >
                          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:border-cyan-200/70 transition-all duration-300 cursor-pointer h-full flex flex-col">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <div className="flex items-start justify-between mb-3 relative z-10">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                                  <span className="text-white text-sm">📄</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 line-clamp-1">
                                    {result.title}
                                  </h4>
                                  <p className="text-xs text-gray-500 capitalize">
                                    {result.type} • {result.date ? new Date(result.date).toLocaleDateString() : "Recent"}
                                  </p>
                                </div>
                              </div>
                              <motion.span
                                whileHover={{ scale: 1.2, rotate: 90 }}
                                className="text-gray-400 group-hover:text-cyan-500 transition-colors"
                              >
                                ↗
                              </motion.span>
                            </div>

                            <div className="flex-1 relative z-10">
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                {result.snippet}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50 relative z-10">
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <span>🔍</span>
                                  <span>{Math.round((result.relevance || 0.7) * 100)}% match</span>
                                </span>
                                <span>•</span>
                                <span>RAG Source</span>
                              </div>
                              <motion.span
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                className="text-xs text-cyan-500 font-medium"
                              >
                                View Details
                              </motion.span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    />
                  </div>
                </div>
              ) : !query ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-3xl">🤖</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-400 mb-3">Ask About Your Documents</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Enter a question above to search through your uploaded documents with AI-powered RAG technology.
                  </p>
                </motion.div>
              ) : null}
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showConfetti && <QuantumConfetti />}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default SearchPage;