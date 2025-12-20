// src/infrastructure/api/user.api.ts
import { env } from "@/config/env";
import { apiClient } from "./httpClient";
import { mockBackend } from "./mockAuth";

export const userApi = {


    register: async (body: any) => {
      // if (USE_MOCK) return mockBackend.login(creds)
      const { data } = await apiClient.post<any>(env.ENDPOINTS.SIGNUP,body);
      return data;
    },

  getById: async (id: string) => {
    // MOCK CALL
    return mockBackend.getUserDetails(id); 
    
    // REAL CALL would be:
    // const { data } = await apiClient.get(`/users/${id}`);
    // return data;
  }
};