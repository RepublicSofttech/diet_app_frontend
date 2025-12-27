import { SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar"
import { AppSidebar } from "@/shared/components/ui/app-sidebar"
import { Outlet } from "react-router-dom"
import { ROLES, type Role } from "@/shared/constant/authorization/rolesAndPermission"
import { SAMPLE_USER, TEAMS_DATA } from "@/shared/components/ui/sidebar/sidebar-config"
import { filterSidebarData } from "@/shared/components/ui/sidebar/sidebar-filtering"
import { ModeToggle } from "@/shared/components/ui/mode-toggle"

export default function AdminLayout() {
  const userRoles: Role[] = [ROLES.USER]
  const filteredData = filterSidebarData(userRoles)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <AppSidebar
          navMain={filteredData.navMain}
          projects={filteredData.projects}
          teams={TEAMS_DATA}
          user={SAMPLE_USER}
        />

        {/* Content column */}
        <div className="relative flex flex-1 flex-col">
          {/* Navbar */}
          <header className="sticky top-0 z-40 flex h-14 items-center border-b bg-background px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <span className="text-sm font-semibold">
                Admin Dashboard
              </span>
            </div>

            <div className="ml-auto flex items-center">
              <ModeToggle />
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1">
            <div className="container mx-auto p-4">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
