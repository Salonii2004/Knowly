// frontend/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, useMemo, ReactNode } from "react";
import {
  loginUser,
  signupUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  updateUserProfile,
} from "../services/auth";

export interface User {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
  bio?: string;
  company?: string;
  department?: string;
  avatar?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  initialLoading: boolean;
  actionLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  getToken: () => string | null;
  refreshAuthToken: () => Promise<string | null>;
  clearError: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && authState.accessToken && authState.refreshToken) {
      try {
        const userData = JSON.parse(storedUser);
        setAuthState((prev) => ({
          ...prev,
          user: userData,
        }));
      } catch (err) {
        console.error("Failed to parse stored auth data:", err);
        clearAuthData();
      }
    }
    setInitialLoading(false);
  }, []);

  // Token refresh interval
  useEffect(() => {
    if (!authState.refreshToken) return;

    const refreshInterval = 50 * 60 * 1000; // 50 minutes
    const interval = setInterval(async () => {
      try {
        if (typeof authState.refreshToken !== "string") {
          throw new Error("Invalid refresh token");
        }
        const newTokens = await refreshAccessToken(authState.refreshToken);
        if (newTokens.accessToken && newTokens.refreshToken) {
          setAuthState((prev) => ({
            ...prev,
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
          }));
          localStorage.setItem("accessToken", newTokens.accessToken);
          localStorage.setItem("refreshToken", newTokens.refreshToken);
        } else {
          throw new Error("Invalid token response");
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
        setError("Session expired. Please log in again.");
        clearAuthData();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [authState.refreshToken]);

  const clearAuthData = () => {
    setAuthState({ user: null, accessToken: null, refreshToken: null });
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const clearError = () => {
    setError(null);
  };

  const login = async (email: string, password: string) => {
    setActionLoading(true);
    setError(null);
    try {
      const data = await loginUser(email, password);
      if (!data.user || !data.accessToken || !data.refreshToken) {
        throw new Error("Invalid login response");
      }
      
      const userWithDefaults: User = {
        ...data.user,
        bio: data.user.bio || "",
        company: data.user.company || "",
        department: data.user.department || "",
        avatar: data.user.avatar || "",
        createdAt: data.user.createdAt || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      setAuthState({
        user: userWithDefaults,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      
      localStorage.setItem("user", JSON.stringify(userWithDefaults));
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    } catch (err: any) {
      const errorMessage = err.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: string = "user") => {
    setActionLoading(true);
    setError(null);
    try {
      const data = await signupUser(name, email, password, role);
      if (!data.user) {
        throw new Error("Invalid signup response");
      }

      const userWithDefaults: User = {
        ...data.user,
        bio: data.user.bio || "",
        company: data.user.company || "",
        department: data.user.department || "",
        avatar: data.user.avatar || "",
        createdAt: data.user.createdAt || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      setAuthState({
        user: userWithDefaults,
        accessToken: data.accessToken || null,
        refreshToken: data.refreshToken || null,
      });
      
      localStorage.setItem("user", JSON.stringify(userWithDefaults));
      if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
      if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
    } catch (err: any) {
      const errorMessage = err.message || "Signup failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await forgotPassword(email);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to send reset link.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const logout = async () => {
    setActionLoading(true);
    setError(null);
    try {
      if (authState.refreshToken) {
        await logoutUser(authState.refreshToken);
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      clearAuthData();
      setActionLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    setActionLoading(true);
    setError(null);
    try {
      if (!authState.user) {
        throw new Error("No user logged in");
      }

      // Call API to update user profile
      const updatedUser = await updateUserProfile(userData, authState.accessToken);
      
      const mergedUser: User = {
        ...authState.user,
        ...updatedUser,
        lastLogin: authState.user.lastLogin, // Preserve last login
      };

      setAuthState(prev => ({
        ...prev,
        user: mergedUser,
      }));
      
      localStorage.setItem("user", JSON.stringify(mergedUser));
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update profile";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const getToken = (): string | null => {
    return authState.accessToken || localStorage.getItem("accessToken");
  };

  const refreshAuthToken = async (): Promise<string | null> => {
    try {
      if (!authState.refreshToken) throw new Error("No refresh token available");
      if (typeof authState.refreshToken !== "string") {
        throw new Error("Invalid refresh token");
      }
      
      const newTokens = await refreshAccessToken(authState.refreshToken);
      if (newTokens.accessToken && newTokens.refreshToken) {
        setAuthState((prev) => ({
          ...prev,
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
        }));
        localStorage.setItem("accessToken", newTokens.accessToken);
        localStorage.setItem("refreshToken", newTokens.refreshToken);
        return newTokens.accessToken;
      }
      throw new Error("Invalid token response");
    } catch (err) {
      console.error("Refresh token failed:", err);
      setError("Session expired. Please log in again.");
      clearAuthData();
      return null;
    }
  };

  const contextValue = useMemo(
    () => ({
      user: authState.user,
      accessToken: authState.accessToken,
      initialLoading,
      actionLoading,
      error,
      login,
      signup,
      forgotPassword,
      logout,
      updateUser,
      getToken,
      refreshAuthToken,
      clearError,
    }),
    [
      authState.user, 
      authState.accessToken, 
      initialLoading, 
      actionLoading, 
      error
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthProvider;