// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await axios.post("/api/auth/login", { email, password });
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);
  };

  const signup = async (name: string, email: string, password: string, role: string) => {
    await axios.post("/api/auth/signup", { name, email, password, role });
    // Do NOT auto-login → redirect user to login page instead
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const forgotPassword = async (email: string) => {
    await axios.post("/api/auth/forgot-password", { email });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
