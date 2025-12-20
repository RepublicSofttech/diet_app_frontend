import axios, { AxiosError } from "axios";
import { env } from "@/config/env";
import { tokenStore } from "./storage";
import { decodeJwt } from "./utils/jwt";
// --- 1. Concurrency Queue (Mutex) ---
let isRefreshing = false;
let failedQueue: Array<{ resolve: (t: string) => void; reject: (e: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

// --- 2. Axios Instance ---
export const apiClient = axios.create({
  baseURL: env.API_BASE,
  // withCredentials: true, // CRITICAL: Allows Cookie Strategy to work
  headers: { "Content-Type": "application/json" },
});

// --- 3. Request Interceptor (RBAC + Token Injection) ---
apiClient.interceptors.request.use(
  (config) => {
    if (config.skipAuth) return config;

    const token = tokenStore.getAccessToken();
    if (token) {
      // config.headers.Authorization = `Bearer ${token}`;
      //  config.headers.Authorization = `Bearer ${token}`;


      // Client-Side RBAC Guard
      if (config.requireRole || config.requirePermission) {
        const decoded = decodeJwt(token);
        const userRoles = decoded?.roles || [];
        const userPerms = decoded?.permissions || [];

        if (config.requireRole && !config.requireRole.some(r => userRoles.includes(r))) {
          throw new axios.Cancel("RBAC_DENIED: Missing required role");
        }
         if (config.requirePermission && !config.requirePermission.some(r => userPerms.includes(r))) {
          throw new axios.Cancel("RBAC_DENIED: Missing required permissions");
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 4. Response Interceptor (Adaptive Refresh) ---
apiClient.interceptors.response.use(
  (response) => (response)
,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // 401 Unauthorized Handling
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // === ADAPTIVE STRATEGY LOGIC ===
        let payload = {};
        
        // If LocalStorage, we MUST send the refresh token in body
        if (env.AUTH_STRATEGY === "LOCAL_STORAGE") {
          const rt = tokenStore.getRefreshToken();
          console.log("refresh token " , rt)
          if (!rt) throw new Error("No refresh token in storage");
          payload = { refreshToken: rt };
        }
        // If Cookie, payload is empty. Browser sends HttpOnly cookie automatically.

        // Perform Refresh
        const { data } = await apiClient.post(env.ENDPOINTS.REFRESH, payload, {
          skipAuth: true,
          _retry: true, 
        });

        // Save new tokens
        tokenStore.setAccessToken(data.accessToken);
        if (data.refreshToken) tokenStore.setRefreshToken(data.refreshToken);

        // Resume requests
        processQueue(null, data.accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);

      } catch (err) {
        processQueue(err, null);
        tokenStore.clear();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);