import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RBAC } from "@/shared/constant/authorization/rbac";
import { FullPageLoader } from "@/shared/components/ui/FullPageLoader";
import { useAuth } from "@/app/providers/simpleAuthProvider";

interface ProtectedRouteProps {
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

export const ProtectedRoute = ({ requiredRoles, requiredPermissions }: ProtectedRouteProps) => {
  const { user, isInitialized } = useAuth();
  const location = useLocation();

  // 1. BLOCKING LOGIC: Only wait here!
  // Public pages won't hit this, so they render instantly.
  if (!isInitialized) {
    return <FullPageLoader />;
  }

  // 2. CHECK AUTH
  if (!user) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  // 3. CHECK ROLES
  if (requiredRoles && requiredRoles.length > 0) {
    // Assuming RBAC helper exists
    const hasRole = requiredRoles.some(role => RBAC.hasRole(user, role));
    if (!hasRole) return <Navigate to="/unauthorized" replace />;
  }

  // 4. CHECK PERMISSIONS
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasPerm = requiredPermissions.every(perm => RBAC.hasPermission(user, perm));
    if (!hasPerm) return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};