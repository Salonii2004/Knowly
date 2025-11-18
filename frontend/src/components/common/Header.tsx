// frontend/src/components/common/Header.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowUserMenu(false);
  };

  const navItems = [
    { path: "/search", label: "Search", icon: "🔍" },
    { path: "/chat", label: "Chat", icon: "💬" },
    { path: "/upload", label: "Upload", icon: "📤" },
    { path: "/integrations", label: "Integrations", icon: "🔗" },
  ];

  const adminItems = [
    { path: "/admin", label: "Admin", icon: "⚙️" },
  ];

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/50"
            : "bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl ${
                  isScrolled 
                    ? "bg-gradient-to-r from-slate-800 to-gray-800" 
                    : "bg-white/10"
                } flex items-center justify-center backdrop-blur-sm border border-white/10`}>
                  <span className="text-lg font-bold text-white">K</span>
                </div>
                <span className={`text-2xl font-black ${
                  isScrolled 
                    ? "text-slate-900" 
                    : "text-white"
                }`}>
                  Knowly
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {user ? (
                <>
                  {navItems.map((item) => (
                    <motion.div
                      key={item.path}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={item.path}
                        className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                          isActiveRoute(item.path)
                            ? isScrolled
                              ? "text-white bg-slate-800 shadow-lg"
                              : "text-white bg-white/20 shadow-lg"
                            : isScrolled
                            ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                        {isActiveRoute(item.path) && (
                          <motion.div
                            layoutId="activeIndicator"
                            className={`absolute inset-0 rounded-xl border-2 ${
                              isScrolled ? "border-slate-600" : "border-white/30"
                            }`}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  ))}

                  {user.role === "admin" &&
                    adminItems.map((item) => (
                      <motion.div
                        key={item.path}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to={item.path}
                          className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                            isActiveRoute(item.path)
                              ? isScrolled
                                ? "text-white bg-amber-700 shadow-lg"
                                : "text-white bg-amber-500/30 shadow-lg"
                              : isScrolled
                              ? "text-slate-700 hover:text-amber-800 hover:bg-amber-50"
                              : "text-white/80 hover:text-white hover:bg-amber-500/20"
                          }`}
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      </motion.div>
                    ))}

                  {/* User Menu */}
                  <div className="relative ml-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className={`flex items-center space-x-3 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        isScrolled
                          ? "bg-gradient-to-r from-slate-800 to-gray-800 text-white shadow-lg hover:shadow-xl border border-slate-700"
                          : "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 border border-white/10"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isScrolled ? "bg-slate-700 text-white" : "bg-white/20 text-white"
                      }`}>
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="hidden lg:block text-slate-900">{user.name || "User"}</span>
                      <motion.span
                        animate={{ rotate: showUserMenu ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className={isScrolled ? "text-slate-700" : "text-white/80"}
                      >
                        ▼
                      </motion.span>
                    </motion.button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden"
                        >
                          <div className="p-4 border-b border-gray-200/50 bg-slate-50">
                            <p className="font-semibold text-slate-900">{user.name}</p>
                            <p className="text-sm text-slate-600">{user.email}</p>
                            <p className="text-xs text-slate-700 font-medium capitalize mt-1 bg-slate-200 px-2 py-1 rounded-full inline-block">
                              {user.role}
                            </p>
                          </div>
                          
                          <div className="p-2 bg-white">
                            {/* CHANGED: Settings link to Profile */}
                            <Link
                              to="/profile"
                              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <span>👤</span>
                              <span>Profile</span>
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-2"
                            >
                              <span>🚪</span>
                              <span>Logout</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className={`px-6 py-2 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${
                      isScrolled
                        ? "bg-slate-800 text-white hover:bg-slate-900 border border-slate-700"
                        : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 border border-white/20"
                    }`}
                  >
                    Login
                  </Link>
                </motion.div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`p-2 rounded-xl transition-all duration-200 border ${
                  isScrolled
                    ? "text-slate-700 hover:bg-slate-100 border-slate-200"
                    : "text-white hover:bg-white/20 border-white/20"
                }`}
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <motion.span
                    animate={{ rotate: showMobileMenu ? 45 : 0, y: showMobileMenu ? 6 : 0 }}
                    className={`block h-0.5 w-6 ${
                      isScrolled ? "bg-slate-700" : "bg-white"
                    } transition-all`}
                  />
                  <motion.span
                    animate={{ opacity: showMobileMenu ? 0 : 1 }}
                    className={`block h-0.5 w-6 ${
                      isScrolled ? "bg-slate-700" : "bg-white"
                    } transition-all`}
                  />
                  <motion.span
                    animate={{ rotate: showMobileMenu ? -45 : 0, y: showMobileMenu ? -6 : 0 }}
                    className={`block h-0.5 w-6 ${
                      isScrolled ? "bg-slate-700" : "bg-white"
                    } transition-all`}
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`md:hidden backdrop-blur-xl border-t ${
                isScrolled 
                  ? "bg-white/95 border-gray-200/50" 
                  : "bg-slate-900/95 border-white/10"
              }`}
            >
              <div className="px-4 py-4 space-y-2">
                {user ? (
                  <>
                    {[...navItems, ...(user.role === "admin" ? adminItems : [])].map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setShowMobileMenu(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                          isActiveRoute(item.path)
                            ? isScrolled
                              ? "bg-slate-800 text-white"
                              : "bg-white/20 text-white"
                            : isScrolled
                            ? "text-slate-700 hover:bg-slate-100"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    {/* CHANGED: Settings link to Profile in mobile menu */}
                    <Link
                      to="/profile"
                      onClick={() => setShowMobileMenu(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        isScrolled
                          ? "text-slate-700 hover:bg-slate-100"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span>👤</span>
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        isScrolled
                          ? "text-red-600 hover:bg-red-50"
                          : "text-red-300 hover:bg-red-500/20"
                      }`}
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center justify-center space-x-3 px-4 py-3 font-semibold rounded-xl ${
                      isScrolled
                        ? "bg-slate-800 text-white hover:bg-slate-900"
                        : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                    }`}
                  >
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
};

export default Header;