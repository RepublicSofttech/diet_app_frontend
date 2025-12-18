import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "@/services/auth/authService";
import type { User, LoginCredentials } from "@/shared/types/user.interface";

interface AuthContextType {
  user: User | null;
  // We expose this so ProtectedRoute knows when to wait
  isInitialized: boolean; 
  login: (creds: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // isInitialized = false means "We haven't finished checking cookies/storage yet"
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const restoredUser = await AuthService.initSession();
        setUser(restoredUser);
      } catch (err) {
        setUser(null);
      } finally {
        // Whether we found a user or not, initialization is done.
        setIsInitialized(true);
      }
    };
    init();
  }, []);

  const login = async (creds: LoginCredentials) => {
    const data = await AuthService.login(creds);
    setUser(data);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    window.location.href = "/sign-in";
  };

  // REMOVED: The generic "if (loading) return <Loader />" block.
  // Now we always render children immediately.
  
  return (
    <AuthContext.Provider value={{ user, isInitialized, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside provider");
  return ctx;
};