// All available roles in the system
export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
  VIEWER: "viewer",
  GUEST: "guest",
} as const

// All available permissions in the system
export const PERMISSIONS = {
  // Playground permissions
  VIEW_PLAYGROUND: "view_playground",
  EDIT_PLAYGROUND: "edit_playground",
  DELETE_PLAYGROUND: "delete_playground",

  // Models permissions
  VIEW_MODELS: "view_models",
  EDIT_MODELS: "edit_models",
  DEPLOY_MODELS: "deploy_models",

  // Documentation permissions
  VIEW_DOCUMENTATION: "view_documentation",
  EDIT_DOCUMENTATION: "edit_documentation",

  // Settings permissions
  VIEW_SETTINGS: "view_settings",
  EDIT_SETTINGS: "edit_settings",

  // Projects permissions
  VIEW_PROJECTS: "view_projects",
  CREATE_PROJECTS: "create_projects",
  EDIT_PROJECTS: "edit_projects",
  DELETE_PROJECTS: "delete_projects",

  // Team permissions
  VIEW_TEAM: "view_team",
  MANAGE_TEAM: "manage_team",
  INVITE_TEAM: "invite_team",

  // Billing permissions
  VIEW_BILLING: "view_billing",
  MANAGE_BILLING: "manage_billing",
} as const

// Extract types from constants
export type Role = (typeof ROLES)[keyof typeof ROLES]
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

// Role to permissions mapping
export const ROLE_PERMISSIONS_MAP: Record<Role, Permission[]> = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_PLAYGROUND,
    PERMISSIONS.EDIT_PLAYGROUND,
    PERMISSIONS.DELETE_PLAYGROUND,
    PERMISSIONS.VIEW_MODELS,
    PERMISSIONS.EDIT_MODELS,
    PERMISSIONS.DEPLOY_MODELS,
    PERMISSIONS.VIEW_DOCUMENTATION,
    PERMISSIONS.EDIT_DOCUMENTATION,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.EDIT_SETTINGS,
    PERMISSIONS.VIEW_PROJECTS,
    PERMISSIONS.CREATE_PROJECTS,
    PERMISSIONS.EDIT_PROJECTS,
    PERMISSIONS.DELETE_PROJECTS,
    PERMISSIONS.VIEW_TEAM,
    PERMISSIONS.MANAGE_TEAM,
    PERMISSIONS.INVITE_TEAM,
    PERMISSIONS.VIEW_BILLING,
    PERMISSIONS.MANAGE_BILLING,
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_PLAYGROUND,
    PERMISSIONS.EDIT_PLAYGROUND,
    PERMISSIONS.VIEW_MODELS,
    PERMISSIONS.EDIT_MODELS,
    PERMISSIONS.VIEW_DOCUMENTATION,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.VIEW_PROJECTS,
    PERMISSIONS.CREATE_PROJECTS,
    PERMISSIONS.EDIT_PROJECTS,
    PERMISSIONS.VIEW_TEAM,
    PERMISSIONS.INVITE_TEAM,
    PERMISSIONS.VIEW_BILLING,
  ],
  [ROLES.USER]: [
    PERMISSIONS.VIEW_PLAYGROUND,
    PERMISSIONS.VIEW_MODELS,
    PERMISSIONS.VIEW_DOCUMENTATION,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.VIEW_PROJECTS,
    PERMISSIONS.VIEW_TEAM,
  ],
  [ROLES.VIEWER]: [PERMISSIONS.VIEW_DOCUMENTATION, PERMISSIONS.VIEW_PROJECTS],
  [ROLES.GUEST]: [PERMISSIONS.VIEW_DOCUMENTATION],
}
