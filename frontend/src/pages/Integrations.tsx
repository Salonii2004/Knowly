import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IntegrationCard from "../components/integrations/IntegrationCard";
import { useIntegrations } from "../hooks/useIntegrations";

// Types
interface Integration {
  id: string;
  name: string;
  description: string;
  type: string;
  connected: boolean;
  apiKey?: string;
  status?: "connected" | "error" | "disconnected";
}

interface NewIntegration {
  name: string;
  description: string;
  type: string;
  category: string;
}

interface Filter {
  id: string;
  label: string;
  icon: string;
  count: number;
}

// Fixed animation variants with proper TypeScript types
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 40, 
    scale: 0.9,
    rotateX: -10,
    filter: "blur(10px)"
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 0.6, 
      delay: i * 0.15, 
      ease: "easeOut" as const,
    },
  }),
  hover: { 
    scale: 1.05, 
    rotateY: 5,
    y: -8,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    transition: { duration: 0.3, ease: "easeOut" as const }
  },
  tap: { scale: 0.98 }
};

const filterVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { 
      duration: 0.4, 
      delay: i * 0.08, 
      ease: "easeOut" as const,
    },
  }),
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    rotateX: 15,
    filter: "blur(10px)"
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 0.4, 
      ease: "easeOut" as const
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    rotateX: -15,
    transition: { duration: 0.3 } 
  },
};

// Advanced Spinner Component
const QuantumSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="flex flex-col items-center justify-center py-16"
  >
    <div className="relative">
      {/* Main Orbital Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-transparent border-t-pink-500 border-r-indigo-500 rounded-full"
      />
      
      {/* Secondary Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-cyan-400 border-l-purple-400 rounded-full"
      />
      
      {/* Pulsating Core */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 m-auto w-6 h-6 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-full"
      />
      
      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
          initial={{ 
            x: 0, 
            y: 0,
            scale: 0 
          }}
          animate={{
            x: Math.cos((i * 60) * Math.PI / 180) * 30,
            y: Math.sin((i * 60) * Math.PI / 180) * 30,
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{ 
            duration: 2, 
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Glow Effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-500/20 to-indigo-600/20 rounded-full blur-xl animate-pulse" />
    </div>
    
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-6 text-lg font-semibold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent font-sans"
    >
      Loading Knowly Integrations...
    </motion.p>
  </motion.div>
);

// Advanced Skeleton Loader
const QuantumSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
  >
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className="bg-gradient-to-br from-gray-100/80 to-gray-200/60 backdrop-blur-xl rounded-3xl p-6 border border-white/50 relative overflow-hidden"
      >
        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          animate={{ x: [-200, 200] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="relative z-10">
          <div className="h-7 bg-gray-300 rounded-2xl w-3/4 mb-4" />
          <div className="h-4 bg-gray-300 rounded-2xl w-full mb-2" />
          <div className="h-4 bg-gray-300 rounded-2xl w-5/6 mb-4" />
          <div className="h-10 bg-gray-300 rounded-2xl w-1/2" />
        </div>
      </motion.div>
    ))}
  </motion.div>
);

// Floating Background Elements
const FloatingOrbs = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Large Background Orbs */}
    <motion.div
      animate={{ 
        y: [0, -20, 0],
        scale: [1, 1.05, 1]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-10 -right-32 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"
    />
    <motion.div
      animate={{ 
        y: [0, 30, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      className="absolute bottom-20 -left-32 w-96 h-96 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-3xl"
    />
    
    {/* Small Floating Particles */}
    {[...Array(25)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          background: `linear-gradient(45deg, 
            hsl(${Math.random() * 360}, 70%, 60%), 
            hsl(${Math.random() * 360}, 70%, 60%))`,
          width: `${2 + Math.random() * 4}px`,
          height: `${2 + Math.random() * 4}px`,
          filter: `blur(${Math.random() * 2}px)`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.random() * 20 - 10, 0],
          scale: [0, 1, 0],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

export default function Integrations() {
  // Mock data for demonstration - replace with your actual hook
  const mockIntegrations: Integration[] = [
    {
      id: "1",
      name: "Salesforce",
      description: "CRM integration for customer data",
      type: "crm",
      connected: true,
      apiKey: "sf-key-12345",
      status: "connected"
    },
    {
      id: "2",
      name: "Zendesk",
      description: "Support ticket management",
      type: "support",
      connected: false,
      apiKey: "zd-key-67890",
      status: "disconnected"
    }
  ];

  // Mock hook implementation - replace with your actual useIntegrations
  

 const { integrations = [], toggleIntegration, loading, error } = useIntegrations(); // Replace with your useIntegrations()
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newIntegration, setNewIntegration] = useState<NewIntegration>({ 
    name: "", 
    description: "", 
    type: "crm",
    category: "business"
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");
  const integrationsRef = useRef<HTMLDivElement>(null);

  const filters: Filter[] = [
  { id: "all", label: "All", icon: "🌐", count: integrations.length },
  { id: "crm", label: "CRM", icon: "📊", count: integrations.filter(i => i.type === "crm").length },
  { id: "support", label: "Support", icon: "🎧", count: integrations.filter(i => i.type === "support").length },
  { id: "communication", label: "Communication", icon: "💬", count: integrations.filter(i => i.type === "communication").length },
  { id: "marketing", label: "Marketing", icon: "📢", count: integrations.filter(i => i.type === "marketing").length },
  { id: "payment", label: "Payment", icon: "💳", count: integrations.filter(i => i.type === "payment").length },
  { id: "analytics", label: "Analytics", icon: "📈", count: integrations.filter(i => i.type === "analytics").length },
  { id: "connected", label: "Active", icon: "🔗", count: integrations.filter(i => i.connected).length },
];

  // Sort and filter integrations
  const filteredIntegrations = integrations
    .filter((i: Integration) => {
      const matchesFilter = filter === "all" ? true : 
                           filter === "connected" ? i.connected : i.type === filter;
      const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          i.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a: Integration, b: Integration) => {
      switch (sortBy) {
        case "name": return a.name.localeCompare(b.name);
        case "type": return a.type.localeCompare(b.type);
        case "status": return (a.connected === b.connected) ? 0 : a.connected ? -1 : 1;
        default: return 0;
      }
    });

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!newIntegration.name.trim()) errors.name = "Name is required";
    if (!newIntegration.description.trim()) errors.description = "Description is required";
    if (newIntegration.description.length < 10) errors.description = "Description must be at least 10 characters";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddIntegration = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Add your integration creation logic here
      console.log('Adding new integration:', newIntegration);
      setShowAddModal(false);
      setNewIntegration({ name: "", description: "", type: "crm", category: "business" });
      triggerConfetti();
    }
  };

  const handleToggleIntegration = (id: string) => {
    toggleIntegration(id);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1500);
  };

  const handleFilterChange = (id: string) => {
    setFilter(id);
    triggerConfetti();
    if (integrationsRef.current) {
      integrationsRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCopyApiKey = (apiKey: string = "") => {
    navigator.clipboard.writeText(apiKey);
    triggerConfetti();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col relative overflow-hidden">
      <FloatingOrbs />
      
      <main className="flex-grow p-4 sm:p-6 md:p-8 max-w-8xl mx-auto w-full z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-2xl rounded-4xl shadow-2xl border border-white/50 p-6 sm:p-8 lg:p-10 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.3) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }} />
          </div>

          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-8 relative"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl"
              >
                ⚡
              </motion.div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 font-sans">
                  Knowly Integrations
                </h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-gray-600 mt-2 font-sans max-w-2xl mx-auto"
                >
                  Connect your ecosystem with AI-powered seamless integrations
                </motion.p>
              </div>
            </div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 mt-6"
            >
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-gray-200/50">
                <div className="text-2xl font-bold text-gray-900">{integrations.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-gray-200/50">
                <div className="text-2xl font-bold text-green-600">
                  {integrations.filter(i => i.connected).length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-gray-200/50">
                <div className="text-2xl font-bold text-blue-600">
                  {integrations.filter(i => i.type === "crm").length}
                </div>
                <div className="text-sm text-gray-600">CRM</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Controls Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col lg:flex-row gap-4 mb-8 items-center justify-between"
          >
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-4 pr-12 bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 rounded-2xl focus:outline-none focus:border-pink-500/50 transition-all duration-300 text-sm placeholder-gray-400 font-sans shadow-lg"
                placeholder="Search integrations by name or description..."
                aria-label="Search integrations"
              />
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"
              >
                🔍
              </motion.div>
            </div>

            {/* View Controls */}
            <div className="flex gap-3 items-center">
              {/* Sort Dropdown */}
              <motion.select
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-4 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-pink-500/50"
              >
                <option value="name">Sort by Name</option>
                <option value="type">Sort by Type</option>
                <option value="status">Sort by Status</option>
              </motion.select>

              {/* View Toggle */}
              <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl p-1 border border-gray-200/50">
                {(["grid", "list"] as const).map((mode) => (
                  <motion.button
                    key={mode}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode(mode)}
                    className={`p-2 rounded-xl transition-all ${
                      viewMode === mode 
                        ? "bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-lg" 
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {mode === "grid" ? "⏹️" : "📃"}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Filter Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3 mb-8 justify-center"
          >
            {filters.map((f, i) => (
              <motion.button
                key={f.id}
                custom={i}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                variants={filterVariants}
                onClick={() => handleFilterChange(f.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 backdrop-blur-sm border ${
                  filter === f.id
                    ? "bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-lg border-transparent"
                    : "bg-white/80 text-gray-700 border-gray-200/50 hover:bg-white hover:shadow-md"
                } font-sans`}
              >
                <span className="text-lg">{f.icon}</span>
                {f.label}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  filter === f.id ? "bg-white/20" : "bg-gray-100"
                }`}>
                  {f.count}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Integration Cards Grid/List */}
          <div ref={integrationsRef} className="relative">
            {loading ? (
              <QuantumSkeleton />
            ) : error ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
                      ⚠️
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mb-2 font-sans">
                      Connection Error
                    </p>
                    <p className="text-gray-600 mb-6 font-sans max-w-md mx-auto">
                      {typeof error === 'string' ? error : "Unable to load integrations. Please check your connection."}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg font-sans"
                    >
                      🔄 Retry Connection
                    </motion.button>
                  </motion.div>
                ) :  filteredIntegrations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-32 h-32 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-6xl mx-auto mb-6 opacity-50">
                  🚀
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 font-sans">
                  No Integrations Found
                </h3>
                <p className="text-gray-600 mb-8 font-sans max-w-md mx-auto">
                  {searchQuery || filter !== "all" 
                    ? "Try adjusting your search or filter criteria."
                    : "Ready to connect your first integration? Let's get started!"
                  }
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg text-lg font-sans"
                >
                  + Add Your First Integration
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
                  : "flex flex-col gap-4"
                }
              >
                {filteredIntegrations.map((integration: Integration, index: number) => (
                  <motion.div
                    key={integration.id}
                    custom={index}
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                    layoutId={integration.id}
                  >
                    <IntegrationCard
                      integration={integration}
                      onToggle={() => handleToggleIntegration(integration.id)}
                      onCopyApiKey={() => handleCopyApiKey(integration.apiKey)}
                      viewMode={viewMode}
                      className={`${
                        viewMode === "grid" 
                          ? "h-full backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl border border-white/50"
                          : "backdrop-blur-sm rounded-2xl shadow-md border border-white/50"
                      } transition-all duration-300 ${
                        integration.connected 
                          ? "bg-gradient-to-br from-green-50 to-emerald-100/50" 
                          : "bg-white/80"
                      }`}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Enhanced Add Integration Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12 relative"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(236, 72, 153, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                y: [0, -5, 0],
                transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              onClick={() => setShowAddModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-2xl text-lg font-sans relative overflow-hidden group"
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              
              <span className="relative z-10 flex items-center gap-3">
                <motion.span
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  ✨
                </motion.span>
                Connect New Integration
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  +
                </motion.span>
              </span>
            </motion.button>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-gray-600 mt-4 font-sans"
            >
              Connect with 50+ supported platforms and services
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Enhanced Add Integration Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/50 max-w-md w-full relative"
              >
                {/* Modal Header */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4"
                  >
                    🚀
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 font-sans">
                    New Integration
                  </h2>
                  <p className="text-gray-600 mt-2 font-sans">
                    Connect your service with our AI-powered platform
                  </p>
                </div>

                <form onSubmit={handleAddIntegration} className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 font-sans mb-2 block">
                      Integration Name
                    </label>
                    <input
                      type="text"
                      value={newIntegration.name}
                      onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                      className={`w-full p-4 bg-white/80 backdrop-blur-sm border-2 rounded-2xl focus:outline-none transition-all font-sans ${
                        formErrors.name 
                          ? "border-red-500 focus:border-red-500" 
                          : "border-gray-200 focus:border-pink-500"
                      }`}
                      placeholder="e.g., Salesforce CRM"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-2 font-sans">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 font-sans mb-2 block">
                      Description
                    </label>
                    <textarea
                      value={newIntegration.description}
                      onChange={(e) => setNewIntegration({ ...newIntegration, description: e.target.value })}
                      className={`w-full p-4 bg-white/80 backdrop-blur-sm border-2 rounded-2xl focus:outline-none transition-all font-sans resize-none ${
                        formErrors.description 
                          ? "border-red-500 focus:border-red-500" 
                          : "border-gray-200 focus:border-pink-500"
                      }`}
                      placeholder="Describe what this integration does..."
                      rows={4}
                    />
                    {formErrors.description && (
                      <p className="text-red-500 text-sm mt-2 font-sans">{formErrors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 font-sans mb-2 block">
                        Type
                      </label>
                      <select
                        value={newIntegration.type}
                        onChange={(e) => setNewIntegration({ ...newIntegration, type: e.target.value })}
                        className="w-full p-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-pink-500 font-sans"
                      >
                        <option value="crm">CRM</option>
                        <option value="support">Support</option>
                        <option value="knowledge">Knowledge Base</option>
                        <option value="marketing">Marketing</option>
                        <option value="analytics">Analytics</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 font-sans mb-2 block">
                        Category
                      </label>
                      <select
                        value={newIntegration.category}
                        onChange={(e) => setNewIntegration({ ...newIntegration, category: e.target.value })}
                        className="w-full p-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-pink-500 font-sans"
                      >
                        <option value="business">Business</option>
                        <option value="development">Development</option>
                        <option value="productivity">Productivity</option>
                        <option value="communication">Communication</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg font-sans"
                    >
                      Create Integration
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl font-sans"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ 
                  y: -100,
                  x: 0,
                  rotate: 0,
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  y: [0, window.innerHeight],
                  x: [0, (Math.random() - 0.5) * 200],
                  rotate: [0, Math.random() * 360],
                  scale: [0, 1, 0.5],
                  opacity: [1, 1, 0]
                }}
                transition={{ 
                  duration: 1.5 + Math.random() * 1,
                  ease: "easeOut"
                }}
              >
                {["🎉", "✨", "🌟", "🎊", "💫", "⭐"][Math.floor(Math.random() * 6)]}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}