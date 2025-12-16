// src/domain/types.ts

// 1. The User Entity (What the UI needs)
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  roles: string[];       // e.g. ["ADMIN", "EDITOR"]
  permissions: string[]; // e.g. ["users.read", "billing.write"]
}

// 2. Credentials for Login
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 3. API Response for Auth
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string; // Optional (only for LocalStorage strategy)
  user: User;
}

// 4. Decoded JWT Structure (If you need to decode manually)
export interface DecodedToken {
  sub: string; // userId
  exp: number;
  iat: number;
  roles?: string[];
  permissions?: string[];
}