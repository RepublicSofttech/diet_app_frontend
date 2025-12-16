import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;          // Skip attaching token
    requireRole?: string[];      // RBAC: Roles
    requirePermission?: string[];// RBAC: Permissions
    _retry?: boolean;            // Internal: Prevent infinite loops
  }
}