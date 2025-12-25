// src/utils/sidebar/sidebar-filtering.ts

// --- IMPORTS ---
// UI elements for data mapping
import { Briefcase, Grid, HeartPulse, Palette, Plane, UserRoundCheck, UtensilsCrossed, type LucideIcon } from "lucide-react";
// Authorization constants and types (adjust paths as needed)
import { ROLE_PERMISSIONS_MAP, type Permission, type Role } from "@/shared/constant/authorization/rolesAndPermission";
// The sidebar structure and rules blueprint
import { SIDEBAR_CONFIG, type AccessControl, type NavSubItemConfig } from "./sidebar-config";

// --- TYPE DEFINITIONS for the FINAL, RENDERABLE DATA ---
// These interfaces describe the shape of the data that this file outputs.
export interface NavSubItem {
  key: string;
  title: string;
  url: string;
}
export interface NavMainItem extends NavSubItem {
  icon: LucideIcon;
  items?: NavSubItem[]; // Sub-items are optional
}
export interface ProjectItem {
  key: string;
  name: string;
  url: string;
  icon: LucideIcon;
}

// --- MASTER DATA SOURCE ---
// This is the single source of truth for the details (icon, URL) of EVERY possible sidebar item.
// The filtering logic uses the `key` from `SIDEBAR_CONFIG` to look up the corresponding data here.
// Using Maps provides performant O(1) lookups.
const navDataMap = new Map<string, any>([
  // ===== Master Data =====
  [
    "Master Data",
    { key: "Master Data", title: "Master Data", url: "/admin/master-data", icon: Grid },
  ],
  [
    "Categories",
    { key: "Categories", title: "Categories", url: "/admin/master-data/categories" },
  ],
  [
    "Ingredients",
    { key: "Ingredients", title: "Ingredients", url: "/admin/master-data/ingredients" },
  ],

  // ===== Meals & Recipes =====
  [
    "Meals & Recipes",
    { key: "Meals & Recipes", title: "Meals & Recipes", url: "/admin/meals&recipes", icon: UtensilsCrossed },
  ],
  [
    "Meals",
    { key: "Meals", title: "Meals", url: "/admin/meals&recipes/meals" },
  ],
  [
    "Recipe Ingredients",
    {
      key: "Recipe Ingredients",
      title: "Recipe Ingredients",
      url: "/admin/meals&recipes/recipe-ingredients",
    },
  ],
  [
    "Recipe Steps",
    {
      key: "Recipe Steps",
      title: "Recipe Steps",
      url: "/admin/meals&recipes/recipe-steps",
    },
  ],

  // ===== Health & Dietary Rules =====
  [
    "Health & Dietary Rules",
    {
      key: "Health & Dietary Rules",
      title: "Health & Dietary Rules",
      url: "/admin/health&dietary-rules",
      icon: HeartPulse,
    },
  ],
  [
    "Health Issue",
    { key: "Health Issue", title: "Health Issue", url: "/admin/health&dietary-rules/health-issue" },
  ],
   [
    "Recipe Restriction",
    { key: "Recipe Restriction", title: "Recipe Restriction", url: "/admin/health&dietary-rules/recipe-restriction" },
  ],
   [
    "Recipe Health Mapping",
    { key: "Recipe Health Mapping", title: "Recipe Health Mapping", url: "/admin/health&dietary-rules/recipe-health-mapping" },
  ],

  // ===== Access Control =====
  [
    "Access Control",
    {
      key: "Access Control",
      title: "Access Control",
      url: "/admin/access-control",
      icon: UserRoundCheck,
    },
  ],
  [
    "Roles",
    { key: "Roles", title: "Roles", url: "/admin/access-control/roles" },
  ],
  [
    "Assign Role",
    {
      key: "Assign Role",
      title: "Assign Role",
      url: "/admin/access-control/assign-role",
    },
  ],
]);

const projectDataMap = new Map<string, ProjectItem>([
  ["Design Engineering", { key: "Design Engineering", name: "Design Engineering", url: "/admin/projects/design", icon: Palette }],
  ["Sales & Marketing", { key: "Sales & Marketing", name: "Sales & Marketing", url: "/admin/projects/sales", icon: Briefcase }],
  ["Travel", { key: "Travel", name: "Travel", url: "/admin/projects/travel", icon: Plane }],
]);

// --- CORE FILTERING LOGIC ---

const permissionCache = new Map<string, Set<Permission>>();

/**
 * Gets a flat Set of permissions from a user's roles, with caching for performance.
 */
function getPermissionsFromRoles(roles: Role[]): Set<Permission> {
  const cacheKey = roles.sort().join(",");
  if (permissionCache.has(cacheKey)) return permissionCache.get(cacheKey)!;

  const permissions = new Set<Permission>();
  roles.forEach(role => {
    ROLE_PERMISSIONS_MAP[role]?.forEach(perm => permissions.add(perm));
  });

  permissionCache.set(cacheKey, permissions);
  return permissions;
}

/**
 * The heart of the access control. Checks if a user meets the requirements of an AccessControl object.
 * Deny rules (`exclude`) are checked first and take precedence.
 */
function hasAccess(userRoles: Set<Role>, userPermissions: Set<Permission>, access?: AccessControl): boolean {
  if (!access) return true; // No rules means access is granted.

  // Deny checks (if any of these match, access is denied immediately)
  if (access.rolesExclude?.some(role => userRoles.has(role))) return false;
  if (access.permissionsExclude?.some(perm => userPermissions.has(perm))) return false;

  // Grant checks (if these are defined, the user MUST meet the criteria)
  if (access.rolesInclude && !access.rolesInclude.some(role => userRoles.has(role))) return false;
  if (access.permissionsInclude && !access.permissionsInclude.every(perm => userPermissions.has(perm))) return false;

  // If no deny rules matched and all grant rules passed, access is granted.
  return true;
}

/**
 * A helper function to recursively build the array of permitted sub-items for a given parent.
 */
function buildFilteredSubItems(configs: readonly NavSubItemConfig[] | undefined, userRoles: Set<Role>, userPermissions: Set<Permission>): NavSubItem[] {
  if (!configs) return [];

  return configs
    .filter(config => hasAccess(userRoles, userPermissions, config.access))
    .map(config => navDataMap.get(config.key))
    .filter((item): item is NavSubItem => item !== null); // Filter out any items not found in the data map
}

/**
 * The main exported function. It orchestrates the entire filtering process.
 * @param userRoles - The roles of the current user (e.g., ['ADMIN']).
 * @returns The filtered and fully formed sidebar navigation structure ready for rendering.
 */
export function filterSidebarData(userRoles: Role[]): { navMain: NavMainItem[]; projects: ProjectItem[] } {
  const rolesSet = new Set(userRoles);
  const permissionsSet = getPermissionsFromRoles(userRoles);

  // Filter and build the main navigation section
  const navMain = SIDEBAR_CONFIG.navMain
    .filter(config => hasAccess(rolesSet, permissionsSet, config.access))
    .map(config => {
      const navItemData = navDataMap.get(config.key);
      if (!navItemData) return null; // Safety check

      let filteredSubItems: NavSubItem[] | undefined = undefined;

      // Safely check for and filter sub-items if they are defined in the config
      if ("items" in config && config.items) {
        filteredSubItems = buildFilteredSubItems(config.items, rolesSet, permissionsSet);
        
        // CRITICAL LOGIC: If a parent is configured to have children,
        // but the user has no access to any of them, hide the parent entirely.
        if (filteredSubItems.length === 0) {
          return null;
        }
      }

      return { ...navItemData, items: filteredSubItems };
    })
    .filter((item): item is NavMainItem => item !== null); // Clean up any nulls

  // Filter and build the projects section
  const projects = SIDEBAR_CONFIG.projects
    .filter(config => hasAccess(rolesSet, permissionsSet, config.access))
    .map(config => projectDataMap.get(config.key))
    .filter((item): item is ProjectItem => item !== null); // Clean up any nulls

  return { navMain, projects };
}