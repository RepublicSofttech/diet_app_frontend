// src/utils/sidebar/sidebar-config.ts

// --- IMPORTS ---
import {
  AudioWaveform, BookOpen, Briefcase, Command, GalleryVerticalEnd, Palette, Plane, Rocket, Settings, Shapes, type LucideIcon
} from "lucide-react";
import { PERMISSIONS,ROLES, type Permission, type Role } from "@/shared/constant/authorization/rolesAndPermission";

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
      key: "Playground", title: "Playground", url: "/admin/playground", icon: Rocket,
      access: { permissionsInclude: [PERMISSIONS.VIEW_PLAYGROUND] },
      items: [
        { key: "History", title: "History", url: "/admin/playground/history" },
        { key: "Starred", title: "Starred", url: "/admin/playground/starred" },
        {
          key: "Settings", title: "Settings", url: "/admin/playground/settings",
          access: { permissionsInclude: [PERMISSIONS.VIEW_SETTINGS] },
        },
      ],
    },
    {
      key: "Models", title: "Models", url: "/admin/models", icon: Shapes,
      access: { permissionsInclude: [PERMISSIONS.VIEW_MODELS] },
      items: [
        { key: "Genesis", title: "Genesis", url: "/admin/models/genesis" },
        { key: "Explorer", title: "Explorer", url: "/admin/models/explorer" },
        {
          key: "Quantum", title: "Quantum", url: "/admin/models/quantum",
          access: { permissionsInclude: [PERMISSIONS.DEPLOY_MODELS] },
        },
      ],
    },
    {
      key: "Documentation", title: "Documentation", url: "/admin/docs", icon: BookOpen,
      access: { permissionsInclude: [PERMISSIONS.VIEW_DOCUMENTATION] },
    },
    {
      key: "Settings", title: "Settings", url: "/admin/settings", icon: Settings,
      access: { permissionsInclude: [PERMISSIONS.VIEW_SETTINGS] },
      items: [
        { key: "General", title: "General", url: "/admin/settings/general" },
        { key: "Team", title: "Team", url: "/admin/settings/team", access: { permissionsInclude: [PERMISSIONS.VIEW_TEAM] } },
        { key: "Billing", title: "Billing", url: "/admin/settings/billing", access: { rolesInclude: [ROLES.ADMIN, ROLES.MANAGER] } },
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
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};