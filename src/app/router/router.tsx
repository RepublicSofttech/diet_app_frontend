import { createBrowserRouter, Link, Outlet } from "react-router-dom";
import { ProtectedRoute } from "./guard/ProtectedRoute";
import { PublicRoute } from "./guard/PublicRoute";
import AdminLayout from "@/pages/admin/layout";
import CategoriesPage from "@/pages/admin/categories/page";
// import CategoriesPage from "@/pages/admin/category/page";
import { LoginForm } from "@/pages/public/auth/sign-in-form";
import { SignupForm } from "@/pages/public/auth/sign-up-form";
import { ResetPassword } from "@/pages/public/auth/reset-password";
import { ForgetPassword } from "@/pages/public/auth/forgot-password";
import HealthIssuePage from "@/pages/admin/health-issue/page";
import RecipePage from "@/pages/admin/recipe/page";
import IngredientsPage from "@/pages/admin/ingredients/page";
import RolePage from "@/pages/admin/roles/page";
import RecipeDetailPage from "@/pages/admin/recipe-detail/page";
import RecipeRestrictionPage from "@/pages/admin/recipe-restrictions/page";
// Lazy Imports

export const router = createBrowserRouter([
  // Group 1: Public Routes (No layout, for unauthenticated users)
  {
    path: "/",
    element: (
      <div>
        <h1>Public Landing Page</h1>
        <nav>
          <Link to="/sign-in">Login</Link> | <Link to="/app">Go to App (if logged in)</Link>
        </nav>
      </div>
    ),
  },
  {
    element: <PublicRoute />,
    children: [
      { path: "sign-in", element: <LoginForm/> },
      { path: "sign-up", element: <SignupForm/> },
       { path: "reset-password", element: <ResetPassword/> },
        { path: "forget-password", element: <ForgetPassword/> },
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

  // ===============================
  // Master Data
  // ===============================
  {
    path: "master-data/categories",
    element: (
      <div className="w-100vw">
        <CategoriesPage />
      </div>
    ),
  },
  {
    path: "master-data/ingredients",
    element: <IngredientsPage/>,
  },

  // ===============================
  // Meals & Recipes
  // ===============================
  {
    path: "meals&recipes/meals",
    element: <div><RecipePage/></div>,
  },
  {
    path: "meals&recipes/recipe-ingredients",
    element: <div>Recipe Ingredients Page</div>,
  },
  {
    path: "meals&recipes/recipe-steps",
    element: <div>Recipe Steps Page</div>,
  },

  // ===============================
  // Health & Dietary Rules
  // ===============================
  {
    path: "health&dietary-rules/health-issue",
    element: <HealthIssuePage />,
  },
  {
    path: "health&dietary-rules/recipe-restriction",
    element: <RecipeRestrictionPage/>,
  },
  {
    path: "health&dietary-rules/recipe-health-mapping",
    element: <div>Recipe Health Mapping</div>,
  },

  // ===============================
  // Access Control
  // ===============================
  {
    path: "access-control/roles",
    element: <RolePage/>,
  },
   {
    path: "meals&recipes/meals/:id",
    element: <RecipeDetailPage/>,
  },
  {
    path: "access-control/assign-role",
    element: <div>Assign Role</div>,
  },

  // ===============================
  // Projects
  // ===============================
  {
    path: "projects/design",
    element: <div>Design Engineering Project</div>,
  },
  {
    path: "projects/sales",
    element: <div>Sales & Marketing Project</div>,
  },
  {
    path: "projects/travel",
    element: <div>Travel Project</div>,
  },

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