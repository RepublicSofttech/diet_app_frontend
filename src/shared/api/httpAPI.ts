import axios from "axios";
import { env } from "@/config/env";
import { tokenStore } from "./storage";

export const http = axios.create({
  baseURL: env.API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Inject token only
http.interceptors.request.use(
  (config) => {
    const token = tokenStore.getAccessToken();

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `token ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);