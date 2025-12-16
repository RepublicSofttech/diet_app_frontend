import type { User } from "@/domain/types";

export interface DecodedToken {
  exp: number; // Expiry
  iat: number; // Issued at
  sub: string; // User ID
  roles?: string[];
  permissions?: string[];
  email?:string
}

export function decodeJwt(token: string | null): DecodedToken | null {
  if (!token) return null;
  try {


    if (token.startsWith("mock_")) {
    // Return dummy data for our mock token
    return {
      exp: Date.now() / 1000 + 3600,
      roles: ["ADMIN"], 
      permissions: ["users.read"],
      sub: "u_123",
      email: "admin@example.com",
      iat:12312312
    };
  }

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}


export function mapTokenToUser(payload: any): User {
  return {
    id: payload.sub,
    email: payload.email,
    roles: payload.roles,
    permissions: payload.permissions
  };
}