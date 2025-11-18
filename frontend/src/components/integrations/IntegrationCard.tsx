// IntegrationCard.tsx
import React from "react";
import { motion } from "framer-motion";

// Define the Integration type to match the main component
interface Integration {
  id: string;
  name: string;
  description: string;
  type: string;
  connected: boolean;
  apiKey?: string;
  status?: "connected" | "error" | "disconnected";
}

// Update the props interface to match what's being passed
interface IntegrationCardProps {
  integration: Integration; // Change from individual props to integration object
  onToggle: () => void;
  onCopyApiKey: () => void;
  viewMode: "grid" | "list";
  className?: string;
}

export default function IntegrationCard({
  integration,
  onToggle,
  onCopyApiKey,
  viewMode,
  className = "",
}: IntegrationCardProps) {
  const { name, description, type, connected, apiKey, status } = integration;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`p-6 transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-12 h-12 bg-gradient-to-br from-pink-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold"
          >
            {name.charAt(0)}
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 font-sans">{name}</h3>
            <p className="text-sm text-gray-600 font-sans">{type.toUpperCase()}</p>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            status === "connected" ? "bg-green-500" :
            status === "error" ? "bg-red-500" :
            "bg-gray-400"
          }`} />
          <span className="text-xs font-medium text-gray-600">
            {status === "connected" ? "Active" : 
             status === "error" ? "Error" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-6 line-clamp-2 font-sans">{description}</p>

      {/* Actions */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className={`flex-1 px-4 py-3 text-sm font-semibold rounded-2xl transition-all font-sans ${
            connected
              ? "bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {connected ? "Disconnect" : "Connect"}
        </motion.button>
        
        {apiKey && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCopyApiKey}
            className="px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-semibold rounded-2xl font-sans"
          >
            🔑
          </motion.button>
        )}
      </div>

      {/* Connection Status */}
      {connected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 p-3 bg-green-50 rounded-2xl border border-green-200"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-800 font-sans">
              Successfully connected
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}