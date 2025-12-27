import type { User } from "@/shared/types/user.interface";
import type {ITokenStorage } from "./types";

// In Cookie Strategy:
// Access Token -> Kept in Memory (Secure against XSS)
// Refresh Token -> Kept in HttpOnly Cookie (We cannot touch it in JS)
const USER_KEY = "auth_user";

let memoryAccessToken: string | null = null;

export const cookieStrategy: ITokenStorage = {
  getAccessToken: () => memoryAccessToken,
  setAccessToken: (token) => { memoryAccessToken = token; },
   setUser: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
   getUser: (): User | null => {
      const data = localStorage.getItem(USER_KEY);
      if (!data) return null;
  
      try {
        const parsed = JSON.parse(data);
        
        // Strict check: Ensure the parsed object has the required User properties
        if (parsed && typeof parsed === 'object' && 'id' in parsed && 'email' in parsed) {
          return parsed as User;
        }
        return null;
      } catch (error) {
        return null;
      }
    },
  
  // We cannot read the refresh token from JS, it's HttpOnly
  getRefreshToken: () => null, 
  
  // Browser handles the cookie, we don't save it manually
  setRefreshToken: () => { /* no-op */ }, 
  
  clear: () => { memoryAccessToken = null; }
};