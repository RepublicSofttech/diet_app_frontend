import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "./httpClient";
import { useAuth } from "@/app/providers/simpleAuthProvider";
export const AxiosInterceptor = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        // This will now catch 401s from Login, Signup, or any Public API
        if (error.response?.status === 401) {
          logout(); 
          navigate("/sign-in", { replace: true });
        }
        return Promise.reject(error);
      }
    );

    return () => apiClient.interceptors.response.eject(interceptor);
  }, [navigate, logout]);

  return null; // Renders nothing, just runs logic
};