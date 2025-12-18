// src/shared/ui/AppSidebar.tsx

// --- COMPONENT IMPORTS ---
// These remain the same as they point to other UI components.
import { NavMain } from "@/shared/components/ui/nav-main";
import { NavProjects } from "@/shared/components/ui/nav-projects";
import { NavUser } from "@/shared/components/ui/nav-user";
import { TeamSwitcher } from "@/shared/components/ui/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/shared/components/ui/sidebar";

// --- TYPE IMPORTS (CORRECTED) ---
// The types for the final, renderable navigation data now come from the filtering file.
import type{ NavMainItem, ProjectItem } from "./sidebar/sidebar-filtering";

// The general application data types (Team, User) now come from the config file.
import type{ Team, User } from "./sidebar/sidebar-config";

// --- COMPONENT PROPS INTERFACE ---
// This interface is now valid because its types are correctly imported.
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navMain: NavMainItem[];
  projects: ProjectItem[];
  teams: Team[];
  user: User;
}

// --- THE COMPONENT ---
// The component's logic and JSX do not need to change.
export function AppSidebar({
  navMain,
  projects,
  teams,
  user,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}