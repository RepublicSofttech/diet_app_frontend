import type { User } from "@/shared/types/user.interface";
import type { ITokenStorage } from "./types";

const ACCESS_KEY = "auth_at";
const REFRESH_KEY = "auth_rt";
const USER_KEY = "auth_user";


export const localStorageStrategy: ITokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_KEY),
  setAccessToken: (token) => localStorage.setItem(ACCESS_KEY, token),

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

  
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
  setRefreshToken: (token) => {
    if (token) localStorage.setItem(REFRESH_KEY, token);
  },
  
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
};