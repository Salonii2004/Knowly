import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* AI-themed Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Neural Network Nodes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-purple-400/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-indigo-100 shadow-2xl shadow-indigo-100/50 overflow-hidden">
          {/* Header with AI Theme */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              animate={{ x: ["0%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
            
            {/* AI Brain Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
            >
              <span className="text-2xl">🧠</span>
            </motion.div>
            
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Welcome Back
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-white/90 text-sm"
            >
              Continue your AI-powered workflow
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
                      placeholder={field.id === "email" ? "name@company.com" : "Enter your password"}
                      required
                      autoComplete={field.id === "email" ? "email" : "current-password"}
                      disabled={loading}
                    />
                    <motion.span
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      animate={{ scale: focusedField === field.id ? 1.1 : 1 }}
                    >
                      {field.icon}
                    </motion.span>
                  </div>
                </motion.div>
              ))}

              {/* Remember Me & Forgot Password */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center text-gray-600 text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2 w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  Remember this device
                </label>
                <Link
                  to="/forgot-password"
                  className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors duration-300"
                >
                  Forgot Password?
                </Link>
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
                      Accessing AI Workspace...
                    </div>
                  ) : (
                    "Access My Workspace"
                  )}
                </motion.span>
                
                {/* Shine effect */}
                {!loading && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    animate={{ x: ["0%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  />
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative flex items-center py-4"
            >
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </motion.div>

            {/* Enterprise SSO Options */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-3"
            >
              <button
                type="button"
                className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <span>🔐</span>
                <span className="font-medium">Single Sign-On (SSO)</span>
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Google", icon: "🔍", color: "hover:bg-red-50 hover:border-red-200" },
                  { name: "GitHub", icon: "💻", color: "hover:bg-gray-50 hover:border-gray-200" },
                ].map((provider, index) => (
                  <motion.button
                    key={provider.name}
                    type="button"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 bg-white border border-gray-200 rounded-xl text-gray-600 transition-all duration-300 ${provider.color} flex items-center justify-center space-x-2`}
                  >
                    <span>{provider.icon}</span>
                    <span className="text-sm font-medium">{provider.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-center pt-4 border-t border-gray-100"
            >
              <p className="text-gray-600 text-sm">
                New to Knowly?{" "}
                <Link
                  to="/signup"
                  className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors duration-300"
                >
                  Create AI Workspace
                </Link>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Quick Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-center"
        >
          
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;