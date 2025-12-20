import { createBrowserRouter, Link, Outlet } from "react-router-dom";
import { ProtectedRoute } from "./guard/ProtectedRoute";
import { PublicRoute } from "./guard/PublicRoute";
import { LoginForm } from "@/pages/public/auth/login-form";
import AdminLayout from "@/pages/admin/layout";
import CategoriesPage from "@/pages/admin/categories/page";
import IngredientsPage from "@/pages/admin/ingredients/page";
// import CategoriesPage from "@/pages/admin/category/page";
// Lazy Imports

export const router = createBrowserRouter([
  // Group 1: Public Routes (No layout, for unauthenticated users)
  {
    path: "/",
    element: (
      <div>
        <h1>Public Landing Page</h1>
        <nav>
          <Link to="/login">Login</Link> | <Link to="/app">Go to App (if logged in)</Link>
        </nav>
      </div>
    ),
  },
  {
    element: <PublicRoute />,
    children: [
      { path: "login", element: <LoginForm /> },
    ],
  },

  // Group 2: Standard Protected Routes (NO SIDEBAR)
  // For regular authenticated users.
  {
    path: "/app",
    element: <ProtectedRoute />, // Ensures user is logged in
    children: [
      {
        // No specific layout, or a very simple one
        element: (
            <div style={{padding: "2rem"}}>
                <h1>User Dashboard</h1>
                <nav>
                    <Link to="/app/profile">Profile</Link> | <Link to="/">Home</Link>
                </nav>
                <hr />
                <Outlet />
            </div>
        ),
        children: [
          { index: true, element: <div>Welcome to your dashboard!</div> },
          { path: "profile", element: <div>Your Profile Page (No Sidebar)</div> },
        ],
      },
    ],
  },

  // Group 3: Admin-Only Section (WITH SIDEBAR)
  {
    path: "/admin",
    element: <ProtectedRoute requiredRoles={["ADMIN"]} />, // Guard for ADMIN role
    children: [
      {
        element: <AdminLayout />, // Use the layout WITH the sidebar here
        children: [
          // All pages that should appear in the sidebar are now nested here.
          { index: true, element: <div>Admin Dashboard</div> },
          { path: "playground/Categories", element: <div className="w-100vw"><CategoriesPage/></div>},
          { path: "playground/starred", element: <div><IngredientsPage/></div> },
          { path: "models/genesis", element: <div>Genesis Model</div> },
          { path: "models/explorer", element: <div>Model Explorer</div> },
          { path: "docs/intro", element: <div>Documentation Intro</div> },
          { path: "docs/start", element: <div>Getting Started Guide</div> },
          { path: "settings/general", element: <div>General Settings</div> },
          { path: "settings/team", element: <div>Team Settings</div> },
          { path: "settings/billing", element: <div>Billing Information</div> },
          { path: "projects/design", element: <div>Design Engineering Project</div> },
          { path: "projects/sales", element: <div>Sales & Marketing Project</div> },
          { path: "projects/travel", element: <div>Travel Project</div> },
           // You can add more admin-only pages
          { path: "users", element: <div>Manage Users</div> },
        ],
      },
    ],
  },

  // Group 4: Catch-all 404 Route
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);