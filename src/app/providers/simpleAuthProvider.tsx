import { createContext, useContext } from "react";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import type { User, LoginCredentials } from "@/shared/types/user.interface";
import { AuthService } from "@/services/auth/simple-auth-service";

interface AuthContextType {
  user: User | null;
  isInitialized: boolean;
  login: (creds: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};



export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const logout = useCallback(async () => {
    await AuthService.logout();
    setUser(null);
  }, []);

  const login = useCallback(async (creds: LoginCredentials) => {
    const userData = await AuthService.login(creds);
    setUser(userData);
  }, []);

  useEffect(() => {
    const init = async () => {
      const restoredUser = await AuthService.initSession();
      setUser(restoredUser);
      setIsInitialized(true);
    };
    init();
  }, []);

  const value = useMemo(() => ({ 
    user, isInitialized, login, logout 
  }), [user, isInitialized, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};