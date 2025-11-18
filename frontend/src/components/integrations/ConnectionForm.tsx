// components/ConnectionForm.tsx
import { useState } from "react";
import { motion } from "framer-motion";

interface ConnectionFormProps {
  onSubmit: (config: { apiKey: string; endpoint?: string }) => void;
  integrationName: string;
}

export default function ConnectionForm({ onSubmit, integrationName }: ConnectionFormProps) {
  const [apiKey, setApiKey] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ apiKey, endpoint });
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
          API Key for {integrationName}
        </label>
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-pink-500 font-sans pr-12"
            placeholder="Enter your API key..."
            required
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showKey ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
          Endpoint URL (Optional)
        </label>
        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          className="w-full p-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-pink-500 font-sans"
          placeholder="https://api.example.com/v1"
        />
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg font-sans"
      >
        Save Connection
      </motion.button>
    </motion.form>
  );
}