import { SidebarProvider, SidebarTrigger } from "@/shared/ui/sidebar"
import { AppSidebar } from "@/shared/ui/app-sidebar"
import { Outlet } from "react-router-dom"
// import { filterSidebarData } from "@/shared/utils/sidebar/filter-sidebar"
import { ROLES, type Role } from "@/shared/constant/authorization/rolesAndPermission"
import { SAMPLE_USER, TEAMS_DATA } from "@/shared/utils/sidebar/sidebar-config"
import { filterSidebarData } from "@/shared/utils/sidebar/sidebar-filtering"

export default function AdminLayout() {
          const userRoles: Role[] = [ROLES.USER]
    
      // Filter sidebar data based on user roles and permissions
      const filteredData = filterSidebarData(userRoles);
  return (
    <SidebarProvider>
      <AppSidebar 
             navMain={filteredData.navMain}
              projects={filteredData.projects}
              teams={TEAMS_DATA}
              user={SAMPLE_USER}
            />
      <main>
        <SidebarTrigger />
         <Outlet />
      </main>
    </SidebarProvider>
  )
}

