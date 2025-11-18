import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { testConnection } from "../api/api";

// Enhanced Error Boundary
interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-pink-100 relative overflow-hidden">
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-red-400 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.7, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="text-center p-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-200/60 max-w-md mx-4 relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <span className="text-3xl text-white">⚠️</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-3"
            >
              Oops! Something went wrong
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 mb-6 leading-relaxed"
            >
              {this.state.error?.message || "An unexpected error occurred while loading the application."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 justify-center"
            >
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                🔄 Reload Page
              </button>
              
              <button
                onClick={() => this.setState({ error: null, errorInfo: null })}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                ← Go Back
              </button>
            </motion.div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Advanced Floating Particle System
const QuantumParticle = ({ delay = 0, size = 2, color = "from-cyan-400 to-blue-500" }: { delay?: number; size?: number; color?: string }) => {
  const x = useMotionValue(Math.random() * 100);
  const y = useMotionValue(Math.random() * 100);
  
  const springX = useSpring(x, { damping: 20, stiffness: 100 });
  const springY = useSpring(y, { damping: 20, stiffness: 100 });
  
  const rotate = useTransform(springX, [0, 100], [0, 360]);

  useEffect(() => {
    const interval = setInterval(() => {
      x.set(Math.random() * 100);
      y.set(Math.random() * 100);
    }, 8000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, [x, y]);

  return (
    <motion.div
      className={`absolute rounded-full bg-gradient-to-r ${color}`}
      style={{
        width: size,
        height: size,
        x: springX,
        y: springY,
        rotate,
      }}
      initial={{ scale: 0 }}
      animate={{
        scale: [0, 1.5, 0],
        opacity: [0, 0.8, 0],
      }}
      transition={{ 
        duration: 6 + Math.random() * 4, 
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// Magnetic Button Component
const MagneticButton = ({ children, className = "", ...props }: any) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.1;
    const y = (clientY - (top + height / 2)) * 0.1;
    
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={position}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Enhanced Status Indicator
const StatusIndicator = ({ status = "Checking..." }: { status?: string }) => {
  const getStatusColor = () => {
    if (!status || status.includes("Error") || status.includes("error")) {
      return "bg-red-500";
    }
    if (status.includes("Checking") || status.includes("checking")) {
      return "bg-yellow-500";
    }
    return "bg-green-500";
  };

  const getStatusText = () => {
    if (!status) return "Backend: Unknown";
    if (status.includes("Error") || status.includes("error")) return "Backend: Offline";
    if (status.includes("Checking") || status.includes("checking")) return "Backend: Checking...";
    return "Backend: Online";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="inline-flex items-center gap-3 px-6 py-4 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/60 hover:shadow-3xl transition-all duration-300 cursor-pointer group"
      whileHover={{ scale: 1.05, y: -2 }}
    >
      <motion.div
        className={`w-4 h-4 rounded-full ${getStatusColor()} relative`}
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [1, 0.7, 1]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className={`absolute inset-0 ${getStatusColor()} rounded-full animate-ping opacity-40`} />
      </motion.div>
      
      <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
        {getStatusText()}
      </span>
      
      <motion.div
        className="w-1 h-1 rounded-full bg-gray-400"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      
      <span className="text-xs text-gray-500 font-medium">
        {status || "Checking connection..."}
      </span>
    </motion.div>
  );
};

// Advanced Animated Background
const CosmicBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const dampedX = useSpring(mouseX, { damping: 30, stiffness: 100 });
  const dampedY = useSpring(mouseY, { damping: 30, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;
      
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Cosmic Nebula Effects */}
      <motion.div
        className="absolute top-1/4 -right-40 w-[900px] h-[900px] bg-cyan-400 rounded-full mix-blend-soft-light filter blur-[140px] opacity-20"
        style={{
          x: useTransform(dampedX, [0, 100], [-80, 80]),
          y: useTransform(dampedY, [0, 100], [-80, 80]),
        }}
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute bottom-1/4 -left-40 w-[900px] h-[900px] bg-purple-500 rounded-full mix-blend-soft-light filter blur-[140px] opacity-20"
        style={{
          x: useTransform(dampedX, [0, 100], [80, -80]),
          y: useTransform(dampedY, [0, 100], [80, -80]),
        }}
        animate={{ 
          scale: [1.15, 1, 1.15],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-pink-400 rounded-full mix-blend-soft-light filter blur-[120px] opacity-15"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Quantum Particles */}
      {[...Array(15)].map((_, i) => (
        <QuantumParticle key={i} delay={i * 0.4} size={Math.random() * 4 + 1} />
      ))}

      {/* Large floating orbs */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-xl"
        animate={{
          y: [0, -40, 0],
          x: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute bottom-32 right-24 w-40 h-40 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-full blur-xl"
        animate={{
          y: [0, 30, 0],
          x: [0, -25, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Animated grid */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(120, 119, 198, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(120, 119, 198, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>
    </div>
  );
};

// Compact Feature Card
const CompactFeatureCard = ({ feature, index }: { feature: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const cardVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6, 
        delay: i * 0.15,
        ease: "easeOut"
      },
    }),
    hover: { 
      scale: 1.02, 
      y: -4,
      transition: { 
        duration: 0.3, 
        ease: "easeOut"
      } 
    },
  };

  return (
    <motion.div
      key={feature.id}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      className="group relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Subtle glow effect */}
      <motion.div
        className={`absolute -inset-2 ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300`}
        animate={{ scale: isHovered ? 1.05 : 1 }}
      />
      
      <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200/50 transition-all duration-300 h-full flex flex-col overflow-hidden">
        {/* Compact icon */}
        <div className="flex items-start justify-between mb-4">
          <motion.div
            className={`w-12 h-12 ${feature.gradient} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <motion.span
              className="text-lg text-white relative z-10"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {feature.icon}
            </motion.span>
            <div className="absolute inset-0 bg-white/20" />
          </motion.div>
          
          {/* Stats badge */}
          <motion.div
            className={`px-3 py-1 ${feature.gradient} bg-opacity-10 rounded-lg border border-opacity-20 ${feature.color.replace('from-', 'border-').replace(' to-', '-')} backdrop-blur-sm`}
            whileHover={{ scale: 1.05 }}
          >
            <span className={`text-xs font-semibold ${feature.color.replace('from-', 'text-').replace(' to-', '-')}`}>
              {feature.stats}
            </span>
          </motion.div>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <motion.h3
            className={`text-lg font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent mb-3 font-sans leading-tight`}
            whileHover={{ x: 2 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {feature.title}
          </motion.h3>
          
          <p className="text-sm text-gray-600 mb-4 font-sans leading-relaxed line-clamp-3">
            {feature.description}
          </p>
          
          {/* Compact capabilities list */}
          <div className="space-y-2">
            {feature.capabilities.slice(0, 3).map((capability: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-2 text-xs text-gray-500 group/capability"
                whileHover={{ x: 2 }}
              >
                <motion.div
                  className={`w-1.5 h-1.5 rounded-full ${feature.gradient} relative flex-shrink-0`}
                  whileHover={{ scale: 1.3 }}
                >
                  <div className={`absolute inset-0 ${feature.gradient} rounded-full animate-ping opacity-30`} />
                </motion.div>
                <span className="group-hover/capability:text-gray-700 transition-colors">
                  {capability}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Hover effect line */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-0.5 ${feature.gradient} rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
        />
      </div>
    </motion.div>
  );
};

// Advanced Confetti System - FIXED IMPLEMENTATION
const QuantumConfetti = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
    {[...Array(80)].map((_, i) => {
      const shapes = ["■", "●", "▲", "★", "♦", "♥", "♠", "♣", "✶", "✦"];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = Math.random() * 20 + 12;
      const colors = [
        "from-pink-500 to-rose-500",
        "from-purple-500 to-indigo-500", 
        "from-cyan-500 to-blue-500",
        "from-emerald-500 to-green-500",
        "from-amber-500 to-orange-500"
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      return (
        <motion.div
          key={i}
          className={`absolute font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}
          style={{
            fontSize: `${size}px`,
          }}
          initial={{ 
            x: "50%", 
            y: "50%", 
            scale: 0, 
            rotate: 0,
            opacity: 0
          }}
          animate={{
            x: `${(Math.random() - 0.5) * 200}%`,
            y: `${(Math.random() - 0.5) * 200}%`,
            scale: [0, 1.2, 0],
            rotate: Math.random() * 720,
            opacity: [0, 1, 0],
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 2 + Math.random() * 1.5, 
            ease: "easeOut",
            delay: Math.random() * 0.5
          }}
        >
          {shape}
        </motion.div>
      );
    })}
  </div>
);

// NEW: Quantum Leap Interactive Experience
const QuantumLeapExperience = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  const stages = [
    {
      title: "Current State",
      description: "Manual processes, scattered data, slow decisions",
      icon: "📊",
      color: "from-gray-400 to-gray-600",
      metrics: ["Manual workflows", "Data silos", "Slow analysis"]
    },
    {
      title: "AI Integration",
      description: "Smart automation, unified knowledge, faster insights",
      icon: "🤖",
      color: "from-blue-400 to-cyan-500",
      metrics: ["AI automation", "Unified search", "Real-time insights"]
    },
    {
      title: "Quantum Leap",
      description: "Predictive intelligence, autonomous decisions, exponential growth",
      icon: "🚀",
      color: "from-purple-500 to-pink-600",
      metrics: ["Predictive AI", "Autonomous ops", "10x productivity"]
    }
  ];

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-purple-900/90 to-slate-900 rounded-4xl p-12 text-center overflow-hidden group border border-white/10">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Pulsing core energy */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Orbital particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full"
            style={{
              x: -100,
              y: -100,
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Progress Indicator */}
        <motion.div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4 bg-black/30 rounded-2xl p-4 backdrop-blur-lg border border-white/10">
            {stages.map((stage, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveStage(index)}
                className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-500 ${
                  activeStage === index
                    ? `text-white bg-gradient-to-r ${stage.color} shadow-2xl`
                    : "text-gray-400 bg-white/5 hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-2">
                  {stage.icon}
                  {stage.title}
                </span>
                
                {/* Connection line */}
                {index < stages.length - 1 && (
                  <motion.div
                    className={`absolute -right-4 top-1/2 w-8 h-0.5 ${
                      activeStage > index ? `bg-gradient-to-r ${stage.color}` : "bg-gray-600"
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeStage > index ? 1 : 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stage Content */}
        <motion.div
          key={activeStage}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-black text-white mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            Ready for the{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Quantum Leap?
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {stages[activeStage].description}
          </motion.p>

          {/* Metrics Grid */}
          <motion.div
            className="grid grid-cols-3 gap-4 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {stages[activeStage].metrics.map((metric, index) => (
              <motion.div
                key={metric}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-black/30 backdrop-blur-lg rounded-xl p-4 border border-white/10"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div className="text-sm text-gray-300 font-medium">{metric}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button with Enhanced Effects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-8"
          >
            <MagneticButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
              className="relative px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 group/cta overflow-hidden"
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500"
              />
              
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                animate={{ x: isHovering ? ["0%", "100%"] : "0%" }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              
              <span className="relative z-10 flex items-center gap-3 text-lg">
                Start Your Quantum Journey
                <motion.span
                  animate={{ 
                    rotate: isHovering ? 360 : 0,
                    scale: isHovering ? 1.2 : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  🚀
                </motion.span>
              </span>
            </MagneticButton>
            
            {/* Secondary CTA */}
            <motion.p
              className="text-gray-400 mt-6 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Join 1,000+ enterprises already transformed •{" "}
              <button className="text-cyan-400 hover:text-cyan-300 underline transition-colors">
                Book a demo
              </button>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating metrics around the section */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xs text-cyan-400/40 font-mono"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            {["+300%", "10x ROI", "99.9%", "AI-Powered", "Real-time", "Secure"][i]}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// NEW: Interactive Demo Preview
const InteractiveDemoPreview = () => {
  const [activeDemo, setActiveDemo] = useState(0);
  
  const demos = [
    {
      title: "AI-Powered Search",
      description: "See how our semantic search understands context and intent",
      video: "/demos/search.mp4",
      stats: ["95% accuracy", "Sub-second results", "Multi-language"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Smart Document Processing",
      description: "Watch AI extract insights from complex documents instantly",
      video: "/demos/documents.mp4",
      stats: ["100+ formats", "Auto-categorization", "Smart tagging"],
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Real-time Analytics",
      description: "Experience live data visualization and predictive insights",
      video: "/demos/analytics.mp4",
      stats: ["Live dashboards", "Predictive AI", "Custom metrics"],
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.7 }}
      className="mt-16 bg-white/90 backdrop-blur-xl rounded-4xl p-8 shadow-2xl border border-gray-200/60"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4"
        >
          See Knowly in Action
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Experience the power of enterprise AI with our interactive demos
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Demo Selector */}
        <div className="space-y-4">
          {demos.map((demo, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveDemo(index)}
              className={`w-full p-6 text-left rounded-2xl transition-all duration-500 ${
                activeDemo === index
                  ? `bg-gradient-to-r ${demo.color} text-white shadow-2xl transform -translate-y-1`
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-lg"
              }`}
              whileHover={{ scale: activeDemo === index ? 1 : 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2">{demo.title}</h3>
                  <p className="text-sm opacity-90">{demo.description}</p>
                </div>
                <motion.div
                  animate={{ rotate: activeDemo === index ? 0 : -90 }}
                  transition={{ duration: 0.3 }}
                >
                  ▶
                </motion.div>
              </div>
              
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: activeDemo === index ? 1 : 0,
                  height: activeDemo === index ? "auto" : 0
                }}
                className="mt-4 flex gap-2 flex-wrap"
              >
                {demo.stats.map((stat, statIndex) => (
                  <span
                    key={statIndex}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activeDemo === index
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {stat}
                  </span>
                ))}
              </motion.div>
            </motion.button>
          ))}
        </div>

        {/* Demo Preview */}
        <motion.div
          key={activeDemo}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Mock browser frame */}
          <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="flex-1 text-center text-gray-400 text-sm">
              knowly.ai/demo/{demos[activeDemo].title.toLowerCase().replace(/\s+/g, '-')}
            </div>
          </div>
          
          {/* Demo content */}
          <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
            <motion.div
              className="text-6xl"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {["🔍", "📊", "🚀"][activeDemo]}
            </motion.div>
            
            {/* Animated elements based on demo */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
                ][activeDemo]
              }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// NEW: Trust Indicators Section
const TrustIndicators = () => {
  const companies = [
    { name: "TechCorp", logo: "🏢", caseStudy: "+300% efficiency" },
    { name: "InnovateLabs", logo: "🔬", caseStudy: "10x faster insights" },
    { name: "DataSystems", logo: "💾", caseStudy: "99.9% accuracy" },
    { name: "GlobalSoft", logo: "🌐", caseStudy: "50+ countries" },
    { name: "FutureTech", logo: "🚀", caseStudy: "AI-first approach" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.9 }}
      className="mt-16 text-center"
    >
      <motion.p
        className="text-gray-500 text-sm uppercase tracking-wider font-semibold mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Trusted by Industry Leaders
      </motion.p>

      <div className="flex flex-wrap justify-center gap-8 items-center">
        {companies.map((company, index) => (
          <motion.div
            key={company.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.1 + index * 0.1 }}
            whileHover={{ scale: 1.1, y: -2 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-gray-200/60 cursor-pointer group"
          >
            <div className="text-2xl mb-2">{company.logo}</div>
            <div className="font-semibold text-gray-800 text-sm">{company.name}</div>
            <div className="text-xs text-cyan-600 font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {company.caseStudy}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Enhanced Main Home Component
export default function Home() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [backendStatus, setBackendStatus] = useState<string>("Checking...");
  const navigate = useNavigate();

  useEffect(() => {
    setIsClient(true);
    testConnection()
      .then((result: { message: React.SetStateAction<string>; }) => setBackendStatus(result.message))
      .catch((err: { message: any; }) => setBackendStatus(`Error: ${err.message}`));
  }, []);

  const handleButtonClick = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const features = [
    {
      id: "1",
      title: "Advanced Search",
      description: "Fast, scalable keyword and semantic search with AI-powered ranking and precise results.",
      icon: "🔍",
      color: "from-cyan-500 to-blue-600",
      gradient: "bg-gradient-to-r from-cyan-500 to-blue-600",
      link: "/search",
      stats: "10x Faster",
      capabilities: ["Semantic Search", "Keyword Matching", "AI Ranking", "Relevance Scoring"]
    },
    {
      id: "2",
      title: "AI Assistant",
      description: "RAG-powered AI that provides accurate, context-aware responses with source citations.",
      icon: "💬",
      color: "from-violet-500 to-purple-600",
      gradient: "bg-gradient-to-r from-violet-500 to-purple-600",
      link: "/chat",
      stats: "24/7 Support",
      capabilities: ["Context-Aware", "Source Citations", "Multi-turn", "Real-time Learning"]
    },
    {
      id: "3",
      title: "Integrations",
      description: "Seamlessly connect with CRM, knowledge bases, and enterprise systems.",
      icon: "🔗",
      color: "from-emerald-500 to-green-600",
      gradient: "bg-gradient-to-r from-emerald-500 to-green-600",
      link: "/integrations",
      stats: "50+ Apps",
      capabilities: ["CRM Sync", "API Access", "Real-time Data", "Secure Connections"]
    },
  ];

  const stats = [
    { number: "99.9%", label: "Uptime", icon: "⚡" },
    { number: "<50ms", label: "Response", icon: "🚀" },
    { number: "1M+", label: "Documents", icon: "📚" },
    { number: "24/7", label: "Support", icon: "🤖" },
  ];

  if (!isClient) return null;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-100/30 flex flex-col relative overflow-hidden">
        <CosmicBackground />
        
        <main className="flex-grow flex flex-col items-center justify-center text-center p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto relative z-10">
          {/* Enhanced Status Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="mb-16"
          >
            <StatusIndicator status={backendStatus} />
          </motion.div>

          {/* Advanced Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", type: "spring", bounce: 0.2 }}
            className="space-y-16 relative max-w-6xl w-full"
          >
            {/* Main Title with Enhanced Effects */}
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3, type: "spring" }}
                className="relative"
              >
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 font-sans leading-none tracking-tight">
                  Knowly 
                </h1>
                
                {/* Animated title shadow */}
                <motion.div
                  className="absolute -inset-8 bg-gradient-to-r from-pink-500/20 via-purple-600/20 to-blue-600/20 blur-3xl rounded-full -z-10"
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              
              {/* Enhanced Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.6 }}
                className="space-y-6"
              >
                <motion.p
                  className="text-3xl md:text-4xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  The Future of{" "}
                  <span className="font-black bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                    Enterprise Intelligence
                  </span>
                </motion.p>
                
                <motion.p
                  className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Transform your business with AI-powered insights, intelligent automation, 
                  and seamless integration across all your data ecosystems.
                </motion.p>
              </motion.div>
            </div>

            {/* Enhanced Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.15, type: "spring" }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/60 hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="text-2xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-xs font-semibold text-gray-600 group-hover:text-gray-800 transition-colors uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link to="/search" className="group">
                <MagneticButton
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 25px 50px rgba(236, 72, 153, 0.4)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleButtonClick}
                  className="px-12 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-pink-400/50 font-sans text-lg group-hover:from-pink-600 group-hover:to-purple-700 relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Explore Search
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      🚀
                    </motion.span>
                  </span>
                </MagneticButton>
              </Link>
              
              <Link to="/chat" className="group">
                <MagneticButton
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 25px 50px rgba(6, 182, 212, 0.4)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleButtonClick}
                  className="px-12 py-5 border-2 border-cyan-400 text-cyan-700 font-bold rounded-2xl hover:bg-cyan-50/50 hover:border-cyan-500 transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 font-sans text-lg bg-white/90 backdrop-blur-sm shadow-xl group-hover:shadow-2xl"
                >
                  <span className="flex items-center gap-3">
                    Start AI Chat
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      💬
                    </motion.span>
                  </span>
                </MagneticButton>
              </Link>
            </motion.div>
          </motion.div>

          {/* Compact Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
          >
            {features.map((feature, index) => (
              <CompactFeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </motion.div>

          {/* NEW: Interactive Demo Preview */}
          <InteractiveDemoPreview />

          {/* NEW: Trust Indicators */}
          <TrustIndicators />

          {/* ULTIMATE: Quantum Leap Experience */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.1 }}
            className="mt-20 w-full max-w-6xl"
          >
            <QuantumLeapExperience />
          </motion.div>

          {/* Confetti Animation */}
          <AnimatePresence>
            {showConfetti && <QuantumConfetti />}
          </AnimatePresence>
        </main>
      </div>
    </ErrorBoundary>
  );
}