import React from "react";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-coral-50 to-pink-50">
      <main className="flex-grow flex flex-col items-center justify-center p-8 max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl text-center space-y-8 border border-coral-200/50">
        <div className="relative">
          <div className="w-28 h-28 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-16 h-16 text-coral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.034 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-coral-600 to-pink-600">
            Unauthorized
          </h1>
        </div>
        <p className="text-gray-700 text-lg max-w-sm">
          You do not have permission to access this page. Please check your credentials or contact support.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-coral-500 text-white rounded-xl font-semibold hover:bg-coral-600 transition transform hover:scale-105 duration-300"
          >
            Go to Login
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 border border-teal-300 text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition transform hover:scale-105 duration-300"
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}