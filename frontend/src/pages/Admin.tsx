
import Dashboard from "../components/admin/Dashboard";
import { motion } from "framer-motion";

export default function Admin() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      
      <main className="flex-grow p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8 text-center lg:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl lg:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600"
          >
            Admin Dashboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto lg:mx-0"
          >
            Advanced platform management with real-time analytics, user insights, and performance monitoring.
          </motion.p>
        </div>
        <Dashboard />
      </main>
      
    </div>
  );
}