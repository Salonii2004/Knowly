import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // reset token from email

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  if (!token) {
    setError("Invalid or missing reset token.");
    return;
  }
  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  try {
    setLoading(true);
    const response = await fetch("http://localhost:5000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Password reset failed");
    }

    setSuccess("Password reset successfully! Redirecting to login...");
    setTimeout(() => navigate("/login"), 2500);
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Something went wrong");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-gray-100 to-teal-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Decorative accent */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400 to-blue-500 opacity-10" />
        
        {/* Header with Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="p-3 bg-teal-100 rounded-full"
          >
            <span className="text-2xl text-teal-600">🔒</span>
          </motion.div>
        </div>
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          Reset Your Password
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Enter your new password below to secure your account.
        </p>

        {/* Error and Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center"
          >
            <span className="mr-2">⚠</span> {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm flex items-center"
          >
            <span className="mr-2">✅</span> {success}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
                required
                minLength={6}
                placeholder="Enter new password"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
                required
                minLength={6}
                placeholder="Confirm new password"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 ${
              loading ? "bg-teal-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Resetting...
              </div>
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </form>

        {/* Back to Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-teal-600 hover:text-teal-800 font-medium transition-colors"
          >
            Back to Login
          </button>
        </p>
      </motion.div>
    </div>
  );
}