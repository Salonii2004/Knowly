// service/auth.ts

import { User } from "../contexts/AuthContext";

// Helper to handle responses consistently
async function handleResponse(response: Response) {
  if (!response.ok) {
    const text = await response.text();
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {
      // not JSON, keep raw text
    }
    throw new Error(
      data.message || `HTTP ${response.status}: ${response.statusText} - ${text}`
    );
  }
  return await response.json();
}

export const loginUser = async (email: string, password: string) => {
  try {
    console.log("auth.ts: Sending login request", { email, password });

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await handleResponse(response);
    console.log("auth.ts: Login response:", result);
    return result;
  } catch (error) {
    console.error("auth.ts: loginUser full error:", error);
    throw error;
  }
};

export const signupUser = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  try {
    console.log("auth.ts: Sending signup request", { name, email, password, role });

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("auth.ts: signupUser error:", error);
    throw error;
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    console.log("auth.ts: Sending refresh token request", { refreshToken });

    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("auth.ts: refreshAccessToken error:", error);
    throw error;
  }
};

export const logoutUser = async (refreshToken: string) => {
  try {
    console.log("auth.ts: Sending logout request", { refreshToken });

    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    await handleResponse(response);
  } catch (error) {
    console.error("auth.ts: logoutUser error:", error);
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    console.log("auth.ts: Sending forgot password request", { email });

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("auth.ts: forgotPassword error:", error);
    throw error;
  }
};
// frontend/services/auth.ts
export const updateUserProfile = async (userData: Partial<User>, token: string | null) => {
  const response = await fetch('/api/user/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  return await response.json();
};
