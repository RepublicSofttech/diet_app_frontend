// import { apiClient } from "./httpClient";
// import { env } from "../config/env";

// export const authApi = {
//   login: async (creds: any) => {
//     const { data } = await apiClient.post<any>(env.ENDPOINTS.LOGIN, creds, { skipAuth: true });
//     return data;
//   },
//   logout: async () => {
//     await apiClient.post(env.ENDPOINTS.LOGOUT, {}, { skipAuth: true });
//   },
//   getMe: async () => {
//     const { data } = await apiClient.get<{ user: any }>(env.ENDPOINTS.ME);
//     return data.user;
//   },
//  refresh: async (token?: string) => {
//     const payload = token ? { refreshToken: token } : {};
//     const { data } = await apiClient.post<any>(
//       env.ENDPOINTS.REFRESH, 
//       payload, 
//       { skipAuth: true }
//     );
//     return data;
//   }
// };









// src/infrastructure/api/auth.api.ts
import { apiClient } from "./httpClient";
import { env } from "@/config/env";
import { mockBackend } from "./mockAuth"; // Import the mock
// import { decodeJwt } from "./utils/jwt";

const USE_MOCK = false; // <--- TOGGLE THIS TO FALSE FOR REAL API

export const authApi = {
  login: async (creds: any) => {
    if (USE_MOCK) return mockBackend.login(creds);

    const { data } = await apiClient.post<any>(env.ENDPOINTS.LOGIN, creds, { skipAuth: true });
    // console.log("sdasdasbdas " , data)
    return data.data;
  },

  logout: async () => {
    if (USE_MOCK) return mockBackend.logout();

    await apiClient.post(env.ENDPOINTS.LOGOUT, {}, { skipAuth: true });
  },
  
  getMe: async () => {
    if (USE_MOCK) return mockBackend.getMe();
    
    const { data } = await apiClient.get<{ user: any }>(env.ENDPOINTS.ME);
    return data.user;
  },

  refresh: async (token?: string) => {
    if (USE_MOCK) return mockBackend.refresh();

    const payload = token ? { refreshToken: token } : {};
    const { data } = await apiClient.post<any>(
      env.ENDPOINTS.REFRESH, 
      payload, 
      { skipAuth: true }
    );
    return data;
  },
  signupUser: async (body: any) => {
    const { data } = await apiClient.post<any>(env.ENDPOINTS.SIGNUP, body, { skipAuth: true });
    return data;
  },
};

