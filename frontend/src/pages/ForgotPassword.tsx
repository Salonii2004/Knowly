// frontend/src/pages/ForgotPassword.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage("");
  setError("");

  try {
   await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    setMessage("If this email exists, a reset link has been sent.");
  } catch (err: any) {
    setError(err.message || "Something went wrong");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-indigo-100 to-coral-100 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-coral-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-8 transform transition-all hover:scale-[1.02]">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600">
            Forgot Password?
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Enter your email and we’ll send you a reset link.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="text-coral-600 bg-coral-50 p-4 rounded-xl text-center font-medium border border-coral-200 animate-pulse">
            {error}
          </div>
        )}
        {message && (
          <div className="text-teal-600 bg-teal-50 p-4 rounded-xl text-center font-medium border border-teal-200 animate-fade-in">
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-teal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 text-sm sm:text-base"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-indigo-500 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-teal-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading ? "Sending Reset Link..." : "Send Reset Link"}
          </button>
        </form>

        {/* Links */}
        <div className="text-center space-y-3 pt-4 border-t border-teal-200">
          <p className="text-gray-600 text-sm sm:text-base">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:underline transition"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
