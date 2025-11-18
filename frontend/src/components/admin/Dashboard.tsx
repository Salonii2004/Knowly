import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Animation variants
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (custom?: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.6, 
      delay: (custom || 0) * 0.15, 
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { 
      duration: 0.5, 
      delay: i * 0.08, 
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
  hover: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    scale: 1.01,
    transition: { duration: 0.2 }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Chart component for advanced visualization
const MiniChart = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end h-12 space-x-1">
      {data.map((value, index) => (
        <motion.div
          key={index}
          initial={{ height: 0 }}
          animate={{ height: `${(value / max) * 100}%` }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
          className={`w-2 rounded-t-lg bg-gradient-to-t from-${color}-600 to-${color}-400`}
        />
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Enhanced stats data with charts
  const stats = [
    {
      title: "Total Users",
      value: "12,345",
      change: "+12% from last month",
      trend: "up",
      color: "teal",
      chartData: [30, 45, 60, 75, 85, 95, 100],
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-teal-200 rounded-full animate-ping"></div>
          <svg className="w-12 h-12 opacity-90 text-teal-600 relative" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
    },
    {
      title: "Active Chats",
      value: "5,678",
      change: "+8% from last month",
      trend: "up",
      color: "indigo",
      chartData: [40, 55, 70, 65, 80, 90, 85],
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-200 rounded-full animate-pulse"></div>
          <svg className="w-12 h-12 opacity-90 text-indigo-600 relative" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      ),
    },
    {
      title: "Searches",
      value: "23,456",
      change: "+15% from last month",
      trend: "up",
      color: "purple",
      chartData: [20, 35, 50, 65, 80, 95, 100],
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-purple-200 rounded-full animate-pulse delay-75"></div>
          <svg className="w-12 h-12 opacity-90 text-purple-600 relative" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4M7.835 4.413a2.7 2.7 0 001.806-.31 2.7 2.7 0 012.86 2.805c0 .523-.42.82-.42.82l-.385 1.28c-.063.212-.18.338-.298.338-.168 0-.3-.168-.3-.378v-1.053c0-.523-.42-.82-.42-.82a2.7 2.7 0 00-1.806-.31 2.7 2.7 0 00-2.86 2.804c0 .523.42.82.42.82l.385 1.28c.063.212.18.338.298.338.168 0 .3-.168.3-.378V9.747c0-.523.42-.82.42-.82a2.7 2.7 0 001.806-.31" />
          </svg>
        </div>
      ),
    },
    {
      title: "Integrations",
      value: "89",
      change: "+3 new this week",
      trend: "up",
      color: "pink",
      chartData: [60, 70, 75, 80, 85, 87, 89],
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-pink-200 rounded-full animate-pulse delay-150"></div>
          <svg className="w-12 h-12 opacity-90 text-pink-600 relative" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38 1.56-2.6 1.56-2.98 0a1.532 1.532 0 012.98 0zM10 10a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" />
          </svg>
        </div>
      ),
    },
  ];

  // Enhanced recent activity data
  const recentActivity = [
    { 
      user: "John Doe", 
      action: "Started a new chat", 
      time: "2 min ago", 
      status: "Success", 
      statusColor: "teal",
      avatar: "JD",
      priority: "high"
    },
    { 
      user: "Jane Smith", 
      action: "Connected Slack integration", 
      time: "5 min ago", 
      status: "Success", 
      statusColor: "indigo",
      avatar: "JS",
      priority: "medium"
    },
    { 
      user: "Mike Johnson", 
      action: "Updated profile settings", 
      time: "12 min ago", 
      status: "Completed", 
      statusColor: "green",
      avatar: "MJ",
      priority: "low"
    },
    { 
      user: "Sarah Wilson", 
      action: "Failed login attempt", 
      time: "15 min ago", 
      status: "Warning", 
      statusColor: "yellow",
      avatar: "SW",
      priority: "high"
    },
  ];

  // Enhanced user management data
  const users = [
    { 
      name: "John Doe", 
      email: "john@example.com", 
      role: "User", 
      status: "Active",
      lastActive: "2 hours ago",
      avatar: "JD"
    },
    { 
      name: "Jane Smith", 
      email: "jane@example.com", 
      role: "Admin", 
      status: "Active",
      lastActive: "5 minutes ago",
      avatar: "JS"
    },
    { 
      name: "Mike Johnson", 
      email: "mike@example.com", 
      role: "Moderator", 
      status: "Away",
      lastActive: "1 day ago",
      avatar: "MJ"
    },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 p-6 sm:p-8 space-y-12 relative overflow-hidden">
      {/* Beautiful Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Soft gradient orbs */}
        <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-teal-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -left-20 w-[600px] h-[600px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(#000000 1px, transparent 1px),
                             linear-gradient(90deg, #000000 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}></div>
        </div>
      </div>

      {/* Header with Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-2">Monitor your platform performance and user activity</p>
        </div>
        
        <div className="flex space-x-2 bg-white/80 backdrop-blur-lg rounded-2xl p-2 border border-gray-200/60 shadow-sm">
          {["overview", "analytics", "users", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-teal-500 to-indigo-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stats Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            custom={index}
            variants={cardVariants}
            whileHover="hover"
            className={`relative bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-${stat.color}-200/60 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300`}
          >
            {/* Animated Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100/30 group-hover:from-${stat.color}-100 group-hover:to-${stat.color}-200/40 transition-all duration-500`} />
            
            {/* Glow Effect */}
            <div className={`absolute -inset-1 bg-gradient-to-r from-${stat.color}-400 to-indigo-400 rounded-3xl blur opacity-0 group-hover:opacity-10 transition duration-500`}></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={`text-${stat.color}-700 font-medium text-sm uppercase tracking-wider`}>
                    {stat.title}
                  </p>
                  <p className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                    {stat.value}
                  </p>
                </div>
                {stat.icon}
              </div>
              
              {/* Mini Chart */}
              <div className="mb-3">
                <MiniChart data={stat.chartData} color={stat.color} />
              </div>
              
              <div className="flex items-center justify-between">
                <p className={`text-${stat.color}-700 text-sm font-medium`}>
                  {stat.change}
                </p>
                <div className={`w-2 h-2 rounded-full bg-${stat.color}-500 animate-pulse`}></div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Activity Table */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-teal-200/60 transition-all duration-300 hover:shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Recent Activity
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-300 font-medium"
            >
              View All
            </motion.button>
          </div>
          
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                whileHover="hover"
                className="flex items-center p-4 rounded-2xl bg-white/60 border border-gray-200/60 cursor-pointer group backdrop-blur-sm"
              >
                <div className={`w-10 h-10 rounded-2xl bg-${activity.statusColor}-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 border border-${activity.statusColor}-200`}>
                  <span className={`text-${activity.statusColor}-700 font-semibold text-sm`}>
                    {activity.avatar}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-800 font-medium truncate">{activity.user}</p>
                    <span className={`w-2 h-2 rounded-full bg-${activity.priority === 'high' ? 'red' : activity.priority === 'medium' ? 'yellow' : 'green'}-500`}></span>
                  </div>
                  <p className="text-gray-600 text-sm truncate">{activity.action}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-gray-500 text-sm">{activity.time}</p>
                  <span className={`px-2 py-1 bg-${activity.statusColor}-100 text-${activity.statusColor}-700 rounded-full text-xs font-medium border border-${activity.statusColor}-200`}>
                    {activity.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* User Management */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-indigo-200/60 transition-all duration-300 hover:shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              User Management
            </h3>
            <div className="flex space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/80 border border-gray-300/60 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300 backdrop-blur-sm"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 font-medium"
              >
                Add User
              </motion.button>
            </div>
          </div>
          
          <div className="space-y-3">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                whileHover="hover"
                className="flex items-center p-4 rounded-2xl bg-white/60 border border-gray-200/60 cursor-pointer group backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 border border-indigo-200">
                  <span className="text-indigo-700 font-semibold">{user.avatar}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-medium truncate">{user.name}</p>
                  <p className="text-gray-600 text-sm truncate">{user.email}</p>
                </div>
                
                <div className="text-right mr-4">
                  <p className="text-gray-800 font-medium">{user.role}</p>
                  <p className="text-gray-500 text-sm">{user.lastActive}</p>
                </div>
                
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-indigo-100 transition-colors duration-300 border border-gray-200"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-pink-100 transition-colors duration-300 border border-gray-200"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;