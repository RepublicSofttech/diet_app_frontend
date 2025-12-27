import { authApi } from "@/shared/api/auth.api";
import { tokenStore as storage } from "@/shared/api/storage";
import type { User } from "@/shared/types/user.interface";

export const AuthService = {
  async login(creds: any): Promise<User> {
    const data = await authApi.login(creds);
    const user: User = { id: data.id, email: data.email, roles: ['ADMIN'], permissions: [] };
    storage.setAccessToken(data.token);
    storage.setUser(user);
    return user;
  },

  async logout() {
    try { await authApi.logout(); } catch (e) {}
    storage.clear();
  },

  async initSession(): Promise<User | null|any> {
    const token = storage.getAccessToken();
    const user = storage.getUser();
    if (token && user) 
        return user;
    storage.clear();
    return null;
  }
};