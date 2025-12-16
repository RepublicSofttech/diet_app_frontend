import type {ITokenStorage } from "./types";

// In Cookie Strategy:
// Access Token -> Kept in Memory (Secure against XSS)
// Refresh Token -> Kept in HttpOnly Cookie (We cannot touch it in JS)

let memoryAccessToken: string | null = null;

export const cookieStrategy: ITokenStorage = {
  getAccessToken: () => memoryAccessToken,
  setAccessToken: (token) => { memoryAccessToken = token; },
  
  // We cannot read the refresh token from JS, it's HttpOnly
  getRefreshToken: () => null, 
  
  // Browser handles the cookie, we don't save it manually
  setRefreshToken: () => { /* no-op */ }, 
  
  clear: () => { memoryAccessToken = null; }
};