// src/infrastructure/api/user.api.ts
import { mockBackend } from "./mockAuth";

export const userApi = {
  getById: async (id: string) => {
    // MOCK CALL
    return mockBackend.getUserDetails(id); 
    
    // REAL CALL would be:
    // const { data } = await apiClient.get(`/users/${id}`);
    // return data;
  }
};