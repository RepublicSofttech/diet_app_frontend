import type { ITokenStorage } from "./types";

const ACCESS_KEY = "auth_at";
const REFRESH_KEY = "auth_rt";

export const localStorageStrategy: ITokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_KEY),
  setAccessToken: (token) => localStorage.setItem(ACCESS_KEY, token),
  
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
  setRefreshToken: (token) => {
    if (token) localStorage.setItem(REFRESH_KEY, token);
  },
  
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
};