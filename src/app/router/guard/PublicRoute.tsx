import { Navigate, Outlet } from "react-router-dom";
import { FullPageLoader } from "@/shared/components/ui/FullPageLoader";
import { useAuth } from "@/app/providers/simpleAuthProvider";

export const PublicRoute = () => {
  const { user, isInitialized } = useAuth();

  // Optional: Wait for auth check to finish before showing login form?
  // If you don't wait, the Login form might flicker before redirecting to Dashboard.
  console.log("user :" , user , isInitialized)
  if (!isInitialized) {
    return <FullPageLoader />; 
  }

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};