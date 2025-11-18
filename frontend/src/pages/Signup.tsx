import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength calculator
  useEffect(() => {
    const calculateStrength = () => {
      let strength = 0;
      if (formData.password.length >= 8) strength += 25;
      if (/[A-Z]/.test(formData.password)) strength += 25;
      if (/[0-9]/.test(formData.password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25;
      setPasswordStrength(strength);
    };
    calculateStrength();
  }, [formData.password]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await signup(formData.name, formData.email, formData.password, formData.role);
      navigate("/Login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-400";
    if (passwordStrength < 75) return "bg-yellow-400";
    return "bg-green-400";
  };

  const getStrengthText = () => {
    if (passwordStrength < 50) return "Weak";
    if (passwordStrength < 75) return "Medium";
    return "Strong";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* AI-themed Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Neural Network Nodes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-indigo-400/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Main Card with AI Theme */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-indigo-100 shadow-2xl shadow-indigo-100/50 overflow-hidden">
          {/* Header with AI Theme */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              animate={{ x: ["0%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
            
            {/* AI Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
            >
              <span className="text-2xl">🤖</span>
            </motion.div>
            
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Join Knowly AI
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-white/90 text-sm"
            >
              Start your intelligent workspace journey
            </motion.p>
          </div>

          <div className="p-8 space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm backdrop-blur-sm flex items-center"
                >
                  <span className="mr-2">⚠️</span>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { id: "name", label: "Full Name", type: "text", icon: "👤" },
                { id: "email", label: "Work Email", type: "email", icon: "✉️" },
                { id: "password", label: "Password", type: "password", icon: "🔒" },
              ].map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <label
                    htmlFor={field.id}
                    className="block mb-2 font-semibold text-gray-700 text-sm"
                  >
                    {field.label}
                  </label>
                  <div className="relative">
                    <motion.input
                      id={field.id}
                      type={field.type}
                      value={formData[field.id as keyof typeof formData]}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      onFocus={() => setFocusedField(field.id)}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full p-4 bg-white border rounded-2xl focus:outline-none transition-all duration-300 text-gray-800 placeholder-gray-500 ${
                        focusedField === field.id
                          ? "border-indigo-400 shadow-lg shadow-indigo-100 ring-2 ring-indigo-100"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder={field.id === "email" ? "name@company.com" : `Enter your ${field.label.toLowerCase()}`}
                      required
                      disabled={loading}
                    />
                    <motion.span
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      animate={{ scale: focusedField === field.id ? 1.1 : 1 }}
                    >
                      {field.icon}
                    </motion.span>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {field.id === "password" && formData.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 space-y-2"
                    >
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Password strength:</span>
                        <span className={`font-semibold ${
                          passwordStrength >= 75 ? "text-green-600" : 
                          passwordStrength >= 50 ? "text-yellow-600" : "text-red-600"
                        }`}>
                          {getStrengthText()}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${getStrengthColor()}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${passwordStrength}%` }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {/* Role Selection for AI Workspace */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  I will use Knowly as a:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { 
                      value: "user", 
                      label: "Team Member", 
                      description: "Chat, search & upload",
                      emoji: "💬",
                      features: ["AI Chat", "Document Upload", "Search"]
                    },
                    { 
                      value: "admin", 
                      label: "Workspace Admin", 
                      description: "Manage team & integrations",
                      emoji: "⚡",
                      features: ["Team Management", "Integrations", "Analytics"]
                    }
                  ].map((roleOption) => (
                    <motion.button
                      key={roleOption.value}
                      type="button"
                      onClick={() => handleChange("role", roleOption.value)}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                        formData.role === roleOption.value
                          ? "bg-indigo-50 border-indigo-400 text-indigo-700 shadow-md shadow-indigo-100"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{roleOption.emoji}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm mb-1">{roleOption.label}</div>
                          <div className="text-xs text-gray-500 mb-2">{roleOption.description}</div>
                          <div className="space-y-1">
                            {roleOption.features.map((feature, idx) => (
                              <div key={idx} className="text-xs text-gray-400 flex items-center">
                                <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Terms Agreement */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex items-start space-x-3 text-sm text-gray-600"
              >
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label>
                  I agree to the{" "}
                  <a href="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Privacy Policy
                  </a>
                </label>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 relative overflow-hidden ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl hover:shadow-indigo-200"
                }`}
              >
                <motion.span
                  className="relative z-10"
                  animate={{ opacity: loading ? 0.8 : 1 }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <motion.svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </motion.svg>
                      Creating AI Workspace...
                    </div>
                  ) : (
                    "Create AI Workspace"
                  )}
                </motion.span>
                
                {/* Animated background shine */}
                {!loading && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    animate={{ x: ["0%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  />
                )}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center pt-6 border-t border-gray-100"
            >
              <p className="text-gray-600 text-sm">
                Already have an AI workspace?{" "}
                <Link
                  to="/login"
                  className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors duration-300"
                >
                  Sign in to Knowly
                </Link>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Feature Highlights - Fixed JSX Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          {[
            { icon: "🧠", text: "AI-Powered" },
            { icon: "🔍", text: "Smart Search" },
            { icon: "📚", text: "RAG System" },
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
              className="bg-white/50 backdrop-blur-sm rounded-2xl p-3 border border-white/60"
            >
              <div className="text-lg mb-1">{feature.icon}</div>
              <div className="text-xs text-gray-600 font-medium">{feature.text}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;