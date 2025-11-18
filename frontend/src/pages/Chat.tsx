import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import debounce from "lodash/debounce";
import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";
import { useAuth } from "../contexts/AuthContext";
import api, { sendChatMessage, checkOllamaHealth, getAvailableModels, fetchRecentSearches } from "../api/api";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: Array<{
    id: string;
    title: string;
    content: string;
    similarity: number;
    sourceNumber: number;
  }>;
  model?: string;
  usage?: {
    prompt_eval_count: number;
    eval_count: number;
  };
}

interface Source {
  id: string;
  title: string;
  content: string;
  similarity: number;
  sourceNumber: number;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

// Enhanced Spinner with multiple variants
const Spinner = ({ size = "medium" }: { size?: "small" | "medium" | "large" }) => {
  const sizes = {
    small: "h-6 w-6",
    medium: "h-10 w-10",
    large: "h-16 w-16"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-8"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className={`rounded-full border-t-3 border-b-3 bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg ${sizes[size]}`}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border-3 border-blue-300/60 shadow-glow"
        />
      </div>
      <motion.p
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-2 text-sm font-medium text-gray-600"
      >
        Processing...
      </motion.p>
    </motion.div>
  );
};

// Enhanced Confetti with more variety
const Confetti = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(60)].map((_, i) => {
      const shapes = ["■", "●", "▲", "★"];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      return (
        <motion.div
          key={i}
          className="absolute text-xl"
          style={{
            color: `hsl(${Math.random() * 360}, 80%, 60%)`,
            left: `${Math.random() * 100}%`,
          }}
          initial={{ y: -50, scale: 0, rotate: 0 }}
          animate={{
            y: `calc(100vh + 100px)`,
            x: `${(Math.random() - 0.5) * 200}px`,
            scale: [0, 1, 0.5],
            rotate: Math.random() * 720,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            ease: "easeOut",
          }}
        >
          {shape}
        </motion.div>
      );
    })}
  </div>
);

// Enhanced Modal with better animations
const ClearModal = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
    role="dialog"
    aria-labelledby="clear-chat-title"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 max-w-sm w-full mx-4"
    >
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-white text-lg">⚠️</span>
        </div>
        <h2 id="clear-chat-title" className="text-xl font-bold text-gray-900 mb-2">Clear Chat?</h2>
        <p className="text-sm text-gray-600">This will permanently delete all messages in this conversation.</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all font-medium shadow-md"
        >
          Clear Chat
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// Enhanced Source Display with better organization
const SourceDisplay = ({ sources }: { sources: Source[] }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    transition={{ duration: 0.4 }}
    className="mt-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/30 shadow-sm"
  >
    <div className="flex items-center gap-2 mb-3">
      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <span className="text-white text-xs">📚</span>
      </div>
      <h4 className="text-sm font-semibold text-gray-700">Reference Sources</h4>
      <span className="bg-blue-500/20 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
        {sources.length} sources
      </span>
    </div>
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {sources.map((source, index) => (
        <motion.div
          key={source.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center font-medium">
                {source.sourceNumber}
              </span>
              <span className="text-sm font-medium text-gray-800 line-clamp-1 flex-1">
                {source.title}
              </span>
            </div>
            <span className="bg-green-500/20 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
              {Math.round(source.similarity * 100)}% match
            </span>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">{source.content}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// Enhanced Toast System
const ToastDisplay = ({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    <AnimatePresence>
      {toasts.map((toast, index) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300,
            delay: index * 0.1 
          }}
          className={`relative p-4 rounded-2xl shadow-lg text-white max-w-sm backdrop-blur-sm border border-white/20 ${
            toast.type === "success"
              ? "bg-gradient-to-r from-green-500 to-emerald-600"
              : toast.type === "error"
              ? "bg-gradient-to-r from-red-500 to-rose-600"
              : "bg-gradient-to-r from-blue-500 to-purple-600"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                {toast.type === "success" && "✓"}
                {toast.type === "error" && "!"}
                {toast.type === "info" && "i"}
              </div>
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="ml-3 text-lg font-bold hover:scale-110 transition-transform"
            >
              &times;
            </button>
          </div>
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 3.5, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-b-2xl origin-left"
          />
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// Enhanced Sidebar with search functionality
const RecentSearchesSidebar = ({
  searches,
  onSelect,
  isOpen,
  toggleSidebar,
}: {
  searches: { id: string; query: string; createdAt: string }[];
  onSelect: (query: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSearches = searches.filter(search =>
    search.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/20 z-50 p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Recent Searches</h3>
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Search within sidebar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 bg-gray-100/50 rounded-xl text-sm border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>

        <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {filteredSearches.length > 0 ? (
            filteredSearches.slice(0, 15).map((search, index) => (
              <motion.button
                key={search.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, backgroundColor: "#eff6ff" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(search.query)}
                className="w-full text-left p-3 bg-gray-100/50 rounded-xl text-sm text-gray-700 hover:bg-blue-100/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                    {search.query}
                  </span>
                  <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                    {new Date(search.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Click to reuse
                </div>
              </motion.button>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-400">🔍</span>
              </div>
              <p className="text-sm text-gray-500">No recent searches found</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

// Enhanced Message Component
const MessageBubble = ({ 
  message, 
  isLastMessage, 
  loading, 
  onEdit, 
  onCopy, 
  onRegenerate,
  userInitial 
}: {
  message: ChatMessage;
  isLastMessage: boolean;
  loading: boolean;
  onEdit: (id: string, content: string) => void;
  onCopy: (content: string) => void;
  onRegenerate: () => void;
  userInitial: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleSaveEdit = () => {
    onEdit(message.id, editContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex gap-3 mb-6 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
          message.role === "user" 
            ? "bg-gradient-to-r from-blue-500 to-purple-600" 
            : "bg-gradient-to-r from-gray-500 to-gray-700"
        }`}
      >
        <span className="text-white font-bold text-sm">
          {message.role === "user" ? userInitial : "AI"}
        </span>
      </motion.div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[75%] ${message.role === "user" ? "text-right" : "text-left"}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-gray-600">
            {message.role === "user" ? "You" : "Knowly AI"}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`relative group rounded-3xl p-4 shadow-lg ${
            message.role === "user"
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto"
              : "bg-white text-gray-800 border border-gray-200/50"
          }`}
        >
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                rows={4}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save & Resend
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm leading-relaxed whitespace-pre-wrap mb-3">
                {message.content}
              </p>

              {message.sources && message.sources.length > 0 && (
                <SourceDisplay sources={message.sources} />
              )}

              {message.model && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex justify-between text-xs opacity-75">
                    <span>Model: {message.model}</span>
                    <span>Tokens: {message.usage?.eval_count || "N/A"}</span>
                  </div>
                </div>
              )}

              {/* Message Actions */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className={`absolute -top-4 ${message.role === "user" ? "-left-2" : "-right-2"} flex gap-1 bg-white/95 backdrop-blur-sm rounded-full p-1 shadow-lg border border-gray-200/50`}
              >
                <button
                  onClick={() => onCopy(message.content)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                  title="Copy message"
                >
                  📋
                </button>
                {message.role === "user" && (
                  <button
                    onClick={() => {
                      setEditContent(message.content);
                      setIsEditing(true);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                    title="Edit message"
                  >
                    ✏️
                  </button>
                )}
                {message.role === "assistant" && isLastMessage && !loading && (
                  <button
                    onClick={onRegenerate}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                    title="Regenerate response"
                  >
                    🔄
                  </button>
                )}
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Custom scrollbar styles component
const CustomScrollbarStyles = () => (
  <style>
    {`
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(156, 163, 175, 0.5);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(156, 163, 175, 0.7);
      }
    `}
  </style>
);

export default function Chat() {
  const { getToken, refreshAuthToken, user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("mistral:latest");
  const [ollamaStatus, setOllamaStatus] = useState<"healthy" | "unhealthy" | "checking">("checking");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [recentSearches, setRecentSearches] = useState<{ id: string; query: string; createdAt: string }[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const userInitial = user ? (user.name?.[0] || user.email?.[0] || "U").toUpperCase() : "U";

  const addToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Enhanced example prompts with categories
  const examplePrompts = [
    {
      category: "Document Analysis",
      prompts: [
        "Summarize the key findings from the latest quarterly report",
        "What are the main action items from the project documentation?",
        "Extract important dates and deadlines from the uploaded files"
      ]
    },
    {
      category: "Data Insights",
      prompts: [
        "Show me the sales trends for the last quarter",
        "What are the most common support ticket issues?",
        "Analyze customer feedback sentiment from recent surveys"
      ]
    },
    {
      category: "Research & Analysis",
      prompts: [
        "Compare different approaches mentioned in the research papers",
        "What are the pros and cons of the proposed solutions?",
        "Find relevant case studies for our current project"
      ]
    }
  ];

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const init = async () => {
      setOllamaStatus("checking");
      try {
        const health = await checkOllamaHealth();
        setOllamaStatus(health.status === "healthy" ? "healthy" : "unhealthy");

        const models = await getAvailableModels();
        const names = models.map((m: any) => m.name);
        setAvailableModels(names);
        if (names.length && !names.includes(selectedModel)) setSelectedModel(names[0] || "");
      } catch (err) {
        console.error(err);
        setOllamaStatus("unhealthy");
        addToast("Failed to connect to chat service.", "error");
      }
    };
    init();
    loadRecentSearches();
  }, [addToast, selectedModel]);

  const loadRecentSearches = async () => {
    try {
      const searches = await fetchRecentSearches();
      setRecentSearches(searches || []);
    } catch (err) {
      console.error("Recent searches error:", err);
      setRecentSearches([]);
    }
  };

  const refreshOllama = async () => {
    setOllamaStatus("checking");
    try {
      const health = await checkOllamaHealth();
      setOllamaStatus(health.status === "healthy" ? "healthy" : "unhealthy");

      const models = await getAvailableModels();
      const names = models.map((m: any) => m.name);
      setAvailableModels(names);
      if (names.length && !names.includes(selectedModel)) setSelectedModel(names[0] || "");
      addToast("Services refreshed.", "success");
    } catch (err) {
      console.error(err);
      setOllamaStatus("unhealthy");
      addToast("Failed to refresh.", "error");
    }
  };

  // ✅ FIXED: Use the existing sendChatMessage API function instead of manual fetch
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError("");

    try {
      const isDocumentQuery =
        message.toLowerCase().includes("document") ||
        message.toLowerCase().includes("file") ||
        message.toLowerCase().includes("rag");

      // ✅ Use the existing API function which handles tokens automatically
      const data = await sendChatMessage(message, selectedModel, getToken(), isDocumentQuery);
      
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: data.answer || "No response received.",
        timestamp: new Date().toISOString(),
        sources: data.sources || [],
        model: data.model || selectedModel,
        usage: data.usage,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      loadRecentSearches();
      triggerConfetti();
    } catch (err: any) {
      if (err.message.includes("expired") || err.message.includes("log in")) {
        navigate("/login");
        return;
      }
      const errorContent = err.message || "An unexpected error occurred.";
      setError(errorContent);
      const errorMsg: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: `Error: ${errorContent}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      addToast(errorContent, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    const lastIndex = messages.length - 1;
    if (lastIndex < 1 || messages[lastIndex].role !== "assistant" || messages[lastIndex - 1].role !== "user") {
      addToast("No response to regenerate.", "info");
      return;
    }

    const userQuery = messages[lastIndex - 1].content;
    setMessages((prev) => prev.slice(0, -1));
    setLoading(true);
    setError("");

    try {
      const isDocumentQuery =
        userQuery.toLowerCase().includes("document") ||
        userQuery.toLowerCase().includes("file") ||
        userQuery.toLowerCase().includes("rag");

      const data = await sendChatMessage(userQuery, selectedModel, getToken(), isDocumentQuery);
      
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: data.answer || "No response received.",
        timestamp: new Date().toISOString(),
        sources: data.sources || [],
        model: data.model || selectedModel,
        usage: data.usage,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      addToast("Response regenerated.", "success");
    } catch (err: any) {
      const errorContent = err.message || "Regeneration failed.";
      setError(errorContent);
      const errorMsg: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: `Error: ${errorContent}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      addToast(errorContent, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditMessage = async (id: string, content: string) => {
    if (!content.trim()) return;

    const messageIndex = messages.findIndex((m) => m.id === id);
    if (messageIndex === -1 || messages[messageIndex].role !== "user") return;

    const updatedMessage = { ...messages[messageIndex], content: content, timestamp: new Date().toISOString() };
    setMessages((prev) => [
      ...prev.slice(0, messageIndex),
      updatedMessage,
      ...prev.slice(messageIndex + 1),
    ]);

    addToast("Message updated.", "success");

    setLoading(true);
    setError("");
    try {
      const isDocumentQuery =
        content.toLowerCase().includes("document") ||
        content.toLowerCase().includes("file") ||
        content.toLowerCase().includes("rag");

      const data = await sendChatMessage(content, selectedModel, getToken(), isDocumentQuery);
      
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: data.answer || "No response received.",
        timestamp: new Date().toISOString(),
        sources: data.sources || [],
        model: data.model || selectedModel,
        usage: data.usage,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      loadRecentSearches();
      triggerConfetti();
    } catch (err: any) {
      const errorContent = err.message || "Failed to process edited message.";
      setError(errorContent);
      const errorMsg: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: `Error: ${errorContent}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      addToast(errorContent, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setShowClearModal(false);
    addToast("Chat cleared.", "success");
    triggerConfetti();
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    addToast("Copied to clipboard!", "success");
    triggerConfetti();
  };

  const handleExportChat = () => {
    const chatText = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n---\n\n");
    const blob = new Blob([chatText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `knowly-chat-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast("Chat exported as TXT.", "success");
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const debouncedScroll = useCallback(
    debounce(() => {
      if (chatWindowRef.current) {
        chatWindowRef.current.scrollTo({ top: chatWindowRef.current.scrollHeight, behavior: "smooth" });
      }
    }, 100),
    []
  );

  useEffect(() => {
    debouncedScroll();
  }, [messages, loading, debouncedScroll]);

  const renderMessage = (message: ChatMessage) => {
    const isLastMessage = messages[messages.length - 1]?.id === message.id;
    
    return (
      <MessageBubble
        key={message.id}
        message={message}
        isLastMessage={isLastMessage}
        loading={loading}
        onEdit={handleEditMessage}
        onCopy={handleCopyMessage}
        onRegenerate={handleRegenerate}
        userInitial={userInitial}
      />
    );
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"} flex flex-col relative overflow-hidden transition-colors duration-500`}>
      {/* Custom Scrollbar Styles */}
      <CustomScrollbarStyles />
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="flex-grow p-4 sm:p-6 max-w-7xl mx-auto w-full z-10 relative">
        <ToastDisplay toasts={toasts} onDismiss={dismissToast} />
        
        <div className={`${theme === "dark" ? "bg-gray-800/90 text-white" : "bg-white/95 text-gray-900"} backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 h-[calc(100vh-4rem)] flex flex-col overflow-hidden min-h-0`}>
          
          {/* Enhanced Header */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl pt-4 pb-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200/30 -mx-6 px-6">
            <div className="flex items-center gap-4 flex-1">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <span className="text-white text-xl">🤖</span>
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                  Knowly AI
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <motion.div
                    className={`w-2.5 h-2.5 rounded-full ${
                      ollamaStatus === "healthy"
                        ? "bg-green-500 shadow-lg shadow-green-200"
                        : ollamaStatus === "unhealthy"
                        ? "bg-red-500 shadow-lg shadow-red-200"
                        : "bg-yellow-500 shadow-lg shadow-yellow-200"
                    }`}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-sm text-gray-600 capitalize">{ollamaStatus}</span>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className={`text-sm border border-gray-300/50 ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white/80 text-gray-800"} rounded-xl px-3 py-1.5 shadow-sm hover:shadow-md transition-all backdrop-blur-sm`}
                    disabled={availableModels.length === 0 || ollamaStatus === "unhealthy"}
                  >
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4 sm:mt-0">
              {[
                { icon: "📜", label: "History", action: () => setIsSidebarOpen(true) },
                { icon: "🔄", label: "Refresh", action: refreshOllama, disabled: ollamaStatus === "checking" },
                { icon: "📤", label: "Export", action: handleExportChat },
                { icon: "🗑️", label: "Clear", action: () => setShowClearModal(true) },
                { icon: theme === "light" ? "🌙" : "☀️", label: "Theme", action: toggleTheme },
              ].map((button, index) => (
                <motion.button
                  key={button.label}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={button.action}
                  disabled={button.disabled}
                  className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 hover:shadow-md transition-all text-gray-700 hover:text-gray-900 disabled:opacity-50"
                  title={button.label}
                >
                  <span className="text-lg">{button.icon}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Enhanced Chat Area */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {messages.length === 0 && !loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0.8, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl"
                >
                  <span className="text-4xl">🚀</span>
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to Knowly AI</h2>
                <p className="text-gray-600 mb-8 max-w-md text-lg">
                  Your intelligent assistant for documents, data, and research. Ask anything!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
                  {examplePrompts.map((category, categoryIndex) => (
                    <motion.div
                      key={category.category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: categoryIndex * 0.2 }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-gray-200/50"
                    >
                      <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                        {category.category}
                      </h3>
                      <div className="space-y-2">
                        {category.prompts.map((prompt, promptIndex) => (
                          <motion.button
                            key={promptIndex}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSendMessage(prompt)}
                            className="w-full text-left p-3 bg-gray-50/50 rounded-xl text-sm text-gray-700 hover:bg-blue-50/50 transition-all border border-transparent hover:border-blue-200/50"
                          >
                            💡 {prompt}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div ref={chatWindowRef} className="h-full overflow-y-auto pr-2 custom-scrollbar">
                <ChatWindow messages={messages} loading={loading} renderItem={renderMessage} />
                {loading && <Spinner />}
              </div>
            )}
          </div>

          {/* Enhanced Input Area */}
          <div className="mt-4 pt-4 border-t border-gray-200/30">
            <ChatInput
              onSend={handleSendMessage}
              disabled={loading || ollamaStatus === "unhealthy" || ollamaStatus === "checking"}
              placeholder={ollamaStatus === "unhealthy" ? "Service unavailable..." : "Ask anything..."}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-sm text-red-600 mt-3 text-center bg-red-50/50 p-3 rounded-xl"
              >
                ⚠️ {error}
              </motion.p>
            )}
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <RecentSearchesSidebar
          searches={recentSearches}
          onSelect={(query) => {
            handleSendMessage(query);
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Enhanced Modals */}
        <AnimatePresence mode="wait">
          {showClearModal && <ClearModal onConfirm={handleClearChat} onCancel={() => setShowClearModal(false)} />}
        </AnimatePresence>

        {/* Enhanced Confetti */}
        <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>
      </main>
    </div>
  );
}