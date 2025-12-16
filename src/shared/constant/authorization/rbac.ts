import type { User } from "@/shared/types/user.interface";

export const RBAC = {
  hasRole: (user: User | null, role: string) => 
    user?.roles.includes(role) ?? false,

  hasPermission: (user: User | null, permission: string) => 
    user?.permissions.includes(permission) ?? false,
};