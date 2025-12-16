// src/infrastructure/api/mockAuth.ts
import type { User } from "../types/user.interface";
// --- DUMMY DATA ---
const MOCK_USER: User = {
  id: "u_123",
  email: "admin@example.com",
  name: "Admin User",
  roles: ["ADMIN"], // Try changing this to ["USER"] to test redirects
  permissions: ["users.read", "users.write"],
};

// --- SIMULATED DELAY ---
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const mockBackend = {
  login: async (creds: any) => {
    await delay(800); // Fake network lag
    
    if (creds.email === "fail@test.com") {
      throw { response: { status: 401, data: { message: "Invalid credentials" } } };
    }

    // Simulate returning a JWT (just a string for this mock)
    // In real life, this string contains the encoded data
    return {
      accessToken: "mock_access_token_" + Date.now(),
      refreshToken: "mock_refresh_token_" + Date.now(),
      user: MOCK_USER, // Some backends return user here too
    };
  },

  logout: async () => {
    await delay(500);
    return true; // Cookie cleared on "server"
  },

  refresh: async () => {
    await delay(500);
    // Simulate server checking the HttpOnly cookie
    // Randomly fail sometimes if you want to test auth failure:
    // if (Math.random() > 0.9) throw { response: { status: 401 } };

    return {
      accessToken: "mock_refreshed_token_" + Date.now(),
      // We don't necessarily get the User object on refresh usually, 
      // but if we are skipping /me, we need to decode the token.
      // For this mock, let's assume the token payload IS the user data.
    };
  },

  getUserDetails: async (id: string) => {
  await delay(300);
  return { id, name: "Test User Data", secret: "This is protected data" };
},
  
  // We might not need this if we decode token
  getMe: async () => {
    await delay(500);
    return { user: MOCK_USER };
  }
};


