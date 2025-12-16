// src/features/auth/services/auth.service.ts
import { authApi } from "@/shared/api/auth.api";
import { tokenStore } from "../../shared/api/storage";
import { env } from "../../config/env";
import { decodeJwt, mapTokenToUser } from "@/shared/api/utils/jwt";

export const AuthService = {
  async login(creds: any) {
    const data = await authApi.login(creds);
    tokenStore.setAccessToken(data.accessToken);
    tokenStore.setRefreshToken(data.refreshToken || null);
    
    // If backend returns user on login, use it. 
    // Otherwise decode token.
    return data.user || mapTokenToUser(decodeJwt(data.accessToken));
  },

  async logout() {
    try { await authApi.logout(); } catch (e) {}
    tokenStore.clear();
  },

  async initSession() {
    let token = tokenStore.getAccessToken();
    console.log("Accesstoken " , token)

    // 1. REFRESH LOGIC
    // If Cookie strategy + Reload (token is null), we try to refresh.
    if (!token && env.AUTH_STRATEGY === "COOKIE") {
      try {
        const data = await authApi.refresh();
        token = data.accessToken;
        tokenStore.setAccessToken(token!);
            console.log("Accesstoken " , token)

      } catch (e) {
        return null; // Refresh failed, user is Guest
      }
    }

    // If LocalStorage strategy + No Token -> Guest
    if (!token && env.AUTH_STRATEGY === "LOCAL_STORAGE") {
       return null;
    }

    // 2. GET USER DATA (Optimized: No /me call)
    // We have a valid token now (either from storage or fresh from refresh).
    // We decode it directly.
    try {
      const payload = decodeJwt(token!);
      if (!payload) throw new Error("Invalid Token");
      
      return mapTokenToUser(payload);
    } catch (e) {
      // Token exists but is garbage/expired? Clear it.
      tokenStore.clear();
      return null;
    }
  }
};