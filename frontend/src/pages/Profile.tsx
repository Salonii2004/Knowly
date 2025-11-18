// frontend/pages/Settings.tsx
import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

// Define proper TypeScript interfaces that extend your existing User interface
interface ExtendedUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  bio?: string;
  company?: string;
  department?: string;
}

interface FormData {
  name: string;
  email: string;
  role: "user" | "admin";
  bio: string;
  company: string;
  department: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  bio?: string;
  general?: string;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  weeklyDigest: boolean;
}

interface PrivacySettings {
  dataSharing: boolean;
  profileVisibility: string;
  searchIndexing: boolean;
}

// Fixed animation variants with proper typing
const sectionVariants = {
  hidden: { 
    opacity: 0, 
    y: 40, 
    scale: 0.95, 
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
      duration: 0.8, 
      delay: i * 0.2, 
      ease: "easeOut" as const
    },
  }),
  hover: { 
    scale: 1.02, 
    y: -5,
    rotateY: 2,
    transition: { duration: 0.4, ease: "easeOut" as const } 
  },
  tap: { scale: 0.98 }
};

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 50,
    filter: "blur(10px)"
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 0.5, 
      ease: "easeOut" as const
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    y: -30,
    transition: { duration: 0.3 } 
  },
};

// Fixed floating orb variants with proper typing
const floatingOrbVariants = {
  float: (i: number) => ({
    y: [0, -20, 0],
    x: [0, Math.sin(i) * 10, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 4 + i,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  })
};

export default function Settings() {
  const { user, logout } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState<FormData>({ 
    name: user?.name || "", 
    email: user?.email || "", 
    role: user?.role || "user",
    bio: user?.bio || "",
    company: user?.company || "",
    department: user?.department || ""
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: false,
    sms: false,
    weeklyDigest: true
  });
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataSharing: false,
    profileVisibility: "private",
    searchIndexing: false
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock updateUser function since it doesn't exist in your AuthContext
  const updateUser = async (userData: Partial<FormData>): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Updating user with:", userData);
      // In a real app, you would call your API here
      setSuccessMessage("Profile updated successfully! 🎉");
    } catch (error) {
      throw new Error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced form validation
  const validateForm = useCallback(() => {
    const errors: FormErrors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email format";
    if (formData.bio.length > 200) errors.bio = "Bio must be less than 200 characters";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Enhanced save profile with loading state
  const handleSaveProfile = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        setIsLoading(true);
        try {
          await updateUser(formData);
          setShowEditModal(false);
          setSuccessMessage("Profile updated successfully! 🎉");
          setShowConfetti(true);
          setTimeout(() => {
            setShowConfetti(false);
            setSuccessMessage("");
          }, 3000);
        } catch (err) {
          setFormErrors({ general: "Failed to update profile. Please try again." });
        } finally {
          setIsLoading(false);
        }
      }
    },
    [formData, validateForm]
  );

  const handleLogout = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      logout();
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setIsLoading(false);
      }, 1500);
    }, 800);
  }, [logout]);

  // Enhanced keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && showEditModal) {
        setShowEditModal(false);
        setFormData({ 
          name: user?.name || "", 
          email: user?.email || "", 
          role: user?.role || "user",
          bio: user?.bio || "",
          company: user?.company || "",
          department: user?.department || ""
        });
      }
    },
    [showEditModal, user]
  );

  // Canvas background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }

    const particles: Particle[] = [];

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: `hsl(${Math.random() * 60 + 200}, 70%, ${60 + Math.random() * 20}%)`
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Draw connections
        particles.slice(index + 1).forEach(particle2 => {
          const dx = particle.x - particle2.x;
          const dy = particle.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "privacy", label: "Privacy", icon: "🛡️" },
    { id: "advanced", label: "Advanced", icon: "⚙️" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col relative overflow-hidden">
      {/* Enhanced Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f3e8ff 100%)' }}
      />

      {/* Enhanced Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={floatingOrbVariants}
            animate="float"
            className="absolute rounded-full opacity-30"
            style={{
              background: `radial-gradient(circle at 30% 30%, 
                hsl(${200 + i * 45}, 70%, 70%), 
                hsl(${220 + i * 45}, 80%, 60%)`,
              width: `${80 + i * 20}px`,
              height: `${80 + i * 20}px`,
              left: `${10 + i * 12}%`,
              top: `${5 + i * 8}%`,
              filter: 'blur(40px)'
            }}
          />
        ))}
      </div>

      <main className="flex-grow p-4 sm:p-6 md:p-8 lg:p-10 max-w-4xl mx-auto w-full z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6 sm:p-8 md:p-10 transition-all duration-500 hover:shadow-2xl space-y-8 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.3) 2%, transparent 0%), 
                              radial-gradient(circle at 75px 75px, rgba(139, 92, 246, 0.2) 2%, transparent 0%)`,
              backgroundSize: '100px 100px'
            }} />
          </div>

          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12 relative"
          >
            <div className="relative inline-block">
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 font-sans mb-4"
                animate={{ backgroundPosition: ['0%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                style={{ backgroundSize: '200% auto' }}
              >
                Knowly Profile
              </motion.h1>
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </div>
            
            <motion.p 
              className="text-gray-600 mt-4 text-lg font-light max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Fine-tune your enterprise RAG experience with precision controls and advanced customization
            </motion.p>

            {/* Status Badge */}
            <motion.div
              className="absolute top-0 -right-4"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <div className="relative">
                <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-full text-green-600 text-sm font-medium flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Enterprise Active
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Tab Navigation */}
          <motion.div 
            className="flex space-x-2 p-2 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 border border-blue-500/30' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-4 text-green-700 font-medium text-center backdrop-blur-sm"
              >
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {user ? (
            <div className="space-y-8">
              {/* Profile Section */}
              <AnimatePresence mode="wait">
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <motion.div
                      custom={0}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      whileTap="tap"
                      variants={sectionVariants}
                      className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/60 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="flex items-start justify-between mb-6">
                        <h3 className="text-2xl font-semibold text-gray-800 font-sans">Profile Information</h3>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                          </div>
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-500 font-medium">Full Name</label>
                            <p className="text-gray-800 font-semibold">{user.name || "Not set"}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500 font-medium">Email Address</label>
                            <p className="text-gray-800 font-semibold">{user.email}</p>
                          </div>
                          {(user as ExtendedUser).bio && (
                            <div>
                              <label className="text-sm text-gray-500 font-medium">Bio</label>
                              <p className="text-gray-800 font-semibold">{(user as ExtendedUser).bio}</p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-500 font-medium">Role</label>
                            <div className="flex items-center gap-2">
                              <p className="text-gray-800 font-semibold capitalize">{user.role}</p>
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-600 text-xs rounded-full border border-blue-500/30">
                                Verified
                              </span>
                            </div>
                          </div>
                          {(user as ExtendedUser).company && (
                            <div>
                              <label className="text-sm text-gray-500 font-medium">Company</label>
                              <p className="text-gray-800 font-semibold">{(user as ExtendedUser).company}</p>
                            </div>
                          )}
                          {(user as ExtendedUser).department && (
                            <div>
                              <label className="text-sm text-gray-500 font-medium">Department</label>
                              <p className="text-gray-800 font-semibold">{(user as ExtendedUser).department}</p>
                            </div>
                          )}
                          <div>
                            <label className="text-sm text-gray-500 font-medium">Member Since</label>
                            <p className="text-gray-800 font-semibold">{new Date().toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowEditModal(true)}
                        className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2"
                      >
                        <span>Edit Profile</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}

                {/* Notifications Section */}
                {activeTab === "notifications" && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      custom={1}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      variants={sectionVariants}
                      className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/60"
                    >
                      <h3 className="text-2xl font-semibold text-gray-800 mb-6 font-sans">Notification Preferences</h3>
                      <div className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                          <motion.label
                            key={key}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/60 hover:bg-white/80 transition-colors duration-200 cursor-pointer group"
                            whileHover={{ x: 4 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <span className="text-purple-500">🔔</span>
                              </div>
                              <div>
                                <div className="text-gray-800 font-medium capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                <div className="text-gray-500 text-sm">
                                  Receive {key} notifications
                                </div>
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => setNotifications(prev => ({
                                  ...prev,
                                  [key]: e.target.checked
                                }))}
                                className="sr-only"
                              />
                              <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                                value ? 'bg-blue-500' : 'bg-gray-300'
                              }`}>
                                <motion.div
                                  className={`w-4 h-4 bg-white rounded-full shadow-lg`}
                                  animate={{ x: value ? 24 : 0 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                />
                              </div>
                            </div>
                          </motion.label>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Privacy Section */}
                {activeTab === "privacy" && (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      custom={2}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      variants={sectionVariants}
                      className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/60"
                    >
                      <h3 className="text-2xl font-semibold text-gray-800 mb-6 font-sans">Privacy & Security</h3>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <label className="flex items-center justify-between p-4 rounded-xl bg-white/60 hover:bg-white/80 transition-colors duration-200">
                            <span className="text-gray-800 font-medium">Data Sharing for Analytics</span>
                            <input
                              type="checkbox"
                              checked={privacySettings.dataSharing}
                              onChange={(e) => setPrivacySettings(prev => ({
                                ...prev,
                                dataSharing: e.target.checked
                              }))}
                              className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500 focus:ring-offset-white"
                            />
                          </label>
                          
                          <div>
                            <label className="text-gray-800 font-medium mb-2 block">Profile Visibility</label>
                            <select
                              value={privacySettings.profileVisibility}
                              onChange={(e) => setPrivacySettings(prev => ({
                                ...prev,
                                profileVisibility: e.target.value
                              }))}
                              className="w-full p-3 bg-white/60 border border-white/60 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="private">Private</option>
                              <option value="team">Team Only</option>
                              <option value="public">Public</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced Action Buttons */}
              <motion.div
                custom={3}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                variants={sectionVariants}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/60"
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 font-sans">Account Actions</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-600 rounded-xl font-semibold border border-red-500/30 hover:border-red-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <span>🚪</span>
                        Sign Out
                      </>
                    )}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 rounded-xl font-semibold border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>📥</span>
                    Export Data
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 rounded-xl font-semibold border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>🔄</span>
                    Sync Devices
                  </motion.button>
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl mx-auto mb-6 flex items-center justify-center text-3xl">
                🔐
              </div>
              <p className="text-gray-600 text-xl font-medium mb-6">Authentication Required</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = "/login"}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                Sign In to Continue
              </motion.button>
            </motion.div>
          )}

          {/* Enhanced Edit Modal */}
          <AnimatePresence>
            {showEditModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={() => setShowEditModal(false)}
              >
                <motion.div
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-white/60 max-w-md w-full shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 font-sans">Edit Profile</h2>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowEditModal(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      ✕
                    </motion.button>
                  </div>

                  {formErrors.general && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-xl border border-red-200"
                    >
                      {formErrors.general}
                    </motion.p>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    {(['name', 'email', 'bio', 'company', 'department'] as const).map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {field}
                        </label>
                        {field === 'bio' ? (
                          <textarea
                            value={formData[field]}
                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                            className="w-full p-3 bg-white/80 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={3}
                            placeholder={`Enter your ${field}`}
                          />
                        ) : (
                          <input
                            type={field === 'email' ? 'email' : 'text'}
                            value={formData[field]}
                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                            className="w-full p-3 bg-white/80 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Enter your ${field}`}
                          />
                        )}
                        {formErrors[field as keyof FormErrors] && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors[field as keyof FormErrors]}
                          </p>
                        )}
                      </div>
                    ))}

                    <div className="flex gap-3 pt-4">
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          'Save Changes'
                        )}
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold border border-gray-200 hover:border-gray-300 transition-colors"
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
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: `hsl(${Math.random() * 360}, 100%, 60%)`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ scale: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    y: [-20, 100],
                    rotate: [0, 360],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}