import axios from "axios";
import { env } from "@/config/env";
import { tokenStore } from "./storage";

export const http = axios.create({
  baseURL: env.API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    const token = tokenStore.getAccessToken();
    if (token && !config.skipAuth) {
      config.headers.Authorization = `token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// We leave the response interceptor empty or basic here; 
// the React component below will handle the 401 redirect.
http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);