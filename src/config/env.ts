export type AuthStrategy = "COOKIE" | "LOCAL_STORAGE";
export const env = {
  // Base API URL
  API_BASE: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  
  // THE SWITCH: "COOKIE" (Recommended) or "LOCAL_STORAGE"
  AUTH_STRATEGY: (import.meta.env.VITE_AUTH_STRATEGY as AuthStrategy) || "LOCAL_STORAGE",

  // Endpoints
  ENDPOINTS: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
  },
};