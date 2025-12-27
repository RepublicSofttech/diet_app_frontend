// src/utils/sidebar/sidebar-config.ts

// --- IMPORTS ---
import {
  AudioWaveform, Briefcase, Command, GalleryVerticalEnd, Grid, HeartPulse, Palette, Plane, User, UserRoundCheck, UtensilsCrossed, type LucideIcon
} from "lucide-react";
import { PERMISSIONS, type Permission, type Role } from "@/shared/constant/authorization/rolesAndPermission";

// --- APPLICATION DATA TYPES ---
// Types for mock/application data are now defined here.

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface Team {
  name: string;
  logo: LucideIcon;
  plan: "Enterprise" | "Startup" | "Free";
}

// --- SIDEBAR STRUCTURE & RULE TYPES ---
// Types that define the shape of the configuration object itself.

export interface AccessControl {
  rolesInclude?: readonly Role[];
  rolesExclude?: readonly Role[];
  permissionsInclude?: readonly Permission[];
  permissionsExclude?: readonly Permission[];
}

export interface NavSubItemConfig {
  key: string;
  title: string;
  url: string;
  access?: AccessControl;
}

export interface NavMainItemConfig {
  key: string;
  title: string;
  url: string;
  icon: LucideIcon;
  access?: AccessControl;
  items?: readonly NavSubItemConfig[];
}

export interface ProjectItemConfig {
  key: string;
  name: string;
  url: string;
  icon: LucideIcon;
  access?: AccessControl;
}

// --- COMPLETE SIDEBAR CONFIGURATION OBJECT ---
// This is the single source of truth for the sidebar's content, navigation, and permissions.
export const SIDEBAR_CONFIG = {
  navMain: [
    
    {
      key: "Master Data", title: "Master Data", url: "/admin/master-data", icon: Grid,
       access: { permissionsInclude: [PERMISSIONS.VIEW_PROJECTS] },
       items: [
        { key: "Categories", title: "Categories", url: "/admin/master-data/categories"},
        {key: "Ingredients", title: "Ingredients", url: "/admin/master-data/ingredients"}
      ],
    },
    {
      key: "Meals & Recipes", title: "Meals & Recipes", url: "/admin/meals&recipes", icon:UtensilsCrossed,
      access: { permissionsInclude: [PERMISSIONS.VIEW_PROJECTS] },
      items: [
        { key: "Meals", title: "Meals", url: "admin/meals&recipes/meals" },
        // { key: "Recipe Ingredients", title: "Recipe Ingredients", url: "/meals&recipes/recipe-ingredients" },
        // { key: "Recipe Steps", title: "Recipe Steps", url: "/meals&recipes/recipe-steps" },
      ],
    },
    {
      key: "Health & Dietary Rules", title: "Health & Dietary Rules", url: "/admin/health&dietary-rules", icon: HeartPulse,
      access: { permissionsInclude: [PERMISSIONS.VIEW_PROJECTS] },
       items: [
        { key: "Health Issue", title: "Health Issue", url: "/admin/health&dietary-rules/health-issue" },
        { key: "Recipe Restriction", title: "Recipe Restriction", url: "/admin/health&dietary-rules/recipe-restriction" },
        { key: "Recipe Health Mapping", title: "Recipe Health Mapping", url: "/admin/health&dietary-rules/recipe-health-mapping" },
      ],
    },
    {
      key: "Access Control", title: "Access Control", url: "/admin/access-control", icon: UserRoundCheck,
      access: { permissionsInclude: [PERMISSIONS.VIEW_PROJECTS] },
      items: [
        { key: "Roles", title: "Roles", url: "/admin/access-control/roles" },
        { key: "Assign Role", title: "Assign Role", url: "/admin/access-control/assign-role" },
      ],
    },
  ] as const,

  projects: [
    {
      key: "Design Engineering", name: "Design Engineering", url: "/admin/projects/design", icon: Palette,
      access: { permissionsInclude: [PERMISSIONS.VIEW_PROJECTS] },
    },
    {
      key: "Sales & Marketing", name: "Sales & Marketing", url: "/admin/projects/sales", icon: Briefcase,
      access: { permissionsInclude: [PERMISSIONS.VIEW_PROJECTS] },
    },
    {
      key: "Travel", name: "Travel", url: "/admin/projects/travel", icon: Plane,
      access: { permissionsInclude: [PERMISSIONS.VIEW_PROJECTS, PERMISSIONS.EDIT_PROJECTS] },
    },
  ] as const,
};

// --- MOCK APPLICATION DATA ---
// Sample data now lives alongside its types in the config file.

export const TEAMS_DATA: Team[] = [
  { name: "Acme Inc", logo: GalleryVerticalEnd, plan: "Enterprise" },
  { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
  { name: "Evil Corp.", logo: Command, plan: "Free" },
];

export const SAMPLE_USER: User = {
  name: "Admin",
  email: "admin@gmail.com",
  avatar: "/avatars/shadcn.jpg",
};