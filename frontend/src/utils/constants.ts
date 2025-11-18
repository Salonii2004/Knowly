// API Endpoints
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Common values
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_RESULTS = 100;

// Themes
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
} as const;
