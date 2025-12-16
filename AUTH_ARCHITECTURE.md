# Authentication Infrastructure & RBAC Documentation

## 1. Overview
This project implements a robust, security-first authentication system using the **Strategy Pattern**. It is designed to be agnostic of the underlying storage mechanism, allowing the application to switch between **HttpOnly Cookies** (Best for Web Security) and **LocalStorage** (Best for Mobile/Cross-Domain) via a simple environment configuration.

### Key Features
*   **Adaptive Storage:** Seamlessly switches between Memory/Cookie and LocalStorage.
*   **Token Rotation:** Automatic 401 interception, token refresh, and request retrying.
*   **Concurrency Handling:** A mutex queue ensures only *one* refresh request is sent even if multiple API calls fail simultaneously.
*   **RBAC (Role-Based Access Control):** Granular control over Routes and API requests using Roles and Permissions.
*   **Clean Architecture:** Strict separation between Infrastructure, Domain/Business Logic, and Application UI.

---

## 2. Architecture & Folder Structure

The authentication logic is sliced into three distinct layers to ensure scalability and maintainability.

```text
src/
├── domain/                  # PURE TYPES & LOGIC (No Framework code)
│   ├── types.ts             # User, LoginCredentials, AuthResponse interfaces
│   └── rbac.ts              # RBAC Logic (hasRole, hasPermission)
│
├── infrastructure/          # LOW-LEVEL IMPLEMENTATION
│   ├── config/env.ts        # Strategy Configuration
│   ├── storage/             # THE STRATEGY PATTERN
│   │   ├── strategies/
│   │   │   ├── cookieStrategy.ts      # Memory (AT) + Browser Cookie (RT)
│   │   │   └── localStorageStrategy.ts # LS (AT) + LS (RT)
│   │   └── index.ts         # Factory exporting the correct strategy
│   └── api/
│       ├── client.ts        # Axios Instance + Interceptors
│       └── endpoints/       # API Definitions (Auth, User, etc.)
│
├── features/                # BUSINESS LOGIC (The Glue)
│   └── auth/
│       └── authService.ts   # The Facade: Connects API <-> Storage <-> UI
│
└── app/                     # UI LAYER (React)
    ├── providers/
    │   └── AuthProvider.tsx # State Management
    └── routes/
        ├── router.tsx       # Route Definitions
        └── guards/          # ProtectedRoute, PublicRoute
```

---

## 3. Configuration & Strategies

The authentication behavior is controlled by the `VITE_AUTH_STRATEGY` environment variable.

### Strategy A: `COOKIE` (Recommended for Web)
*   **Security:** High.
*   **Access Token:** Stored in **Memory** (JavaScript variable). It is wiped on page reload.
*   **Refresh Token:** Stored in an **HttpOnly Cookie**. JavaScript cannot read this.
*   **Mechanism:**
    *   On API calls, the Access Token is attached as a `Bearer` header.
    *   On Refresh, the browser automatically sends the HttpOnly cookie.
    *   **Session Restore:** On page reload (F5), the app detects a missing Access Token and performs a "Silent Refresh" to restore the session.

### Strategy B: `LOCAL_STORAGE` (Mobile / Cross-Domain)
*   **Security:** Medium (Vulnerable to XSS).
*   **Access Token:** Stored in **LocalStorage**.
*   **Refresh Token:** Stored in **LocalStorage**.
*   **Mechanism:**
    *   Tokens persist across reloads.
    *   The refresh token is manually read from storage and sent in the body of the refresh request.

---

## 4. Authentication Flows

### 4.1. The Login Flow
1.  **UI:** User submits credentials to `AuthProvider`.
2.  **Service:** `authService.login(creds)` calls the API.
3.  **API:** Returns `{ accessToken, user }` (and `refreshToken` if using LS strategy).
4.  **Storage:** `tokenStore.setTokens(...)` saves tokens based on the active strategy.
    *   *Cookie Mode:* Access Token -> Memory.
    *   *LS Mode:* Access Token -> LS, Refresh Token -> LS.
5.  **State:** `AuthProvider` updates the `user` state, unlocking Protected Routes.

### 4.2. Token Rotation (The Interceptor)
When an Access Token expires, the `client.ts` interceptor handles the renewal transparently.

1.  **Request Fails:** API returns `401 Unauthorized`.
2.  **Queue:** The request is paused and added to a `failedQueue`.
3.  **Refresh Trigger:**
    *   If `isRefreshing` is false, the interceptor initiates a refresh call.
    *   *Cookie Mode:* Calls `/refresh` (Browser sends cookie).
    *   *LS Mode:* Calls `/refresh` with `{ refreshToken: ... }` body.
4.  **Success:**
    *   New Access Token is saved via `tokenStore`.
    *   `processQueue` runs, retrying all failed requests with the new token.
5.  **Failure:**
    *   If refresh fails, `tokenStore` is cleared, and the user is redirected to Login.

### 4.3. Session Restoration (Page Reload)
Since Memory is wiped on reload in Cookie Mode, `authService.initSession()` runs on app startup:

1.  **Check 1:** Is there an Access Token in the store?
    *   *LS Mode:* Yes (persisted).
    *   *Cookie Mode:* No (memory wiped).
2.  **Check 2:** (Cookie Mode Only) Call `/refresh` endpoint immediately.
    *   If server accepts the HttpOnly cookie, it returns a fresh Access Token.
    *   Session is restored without user intervention.
3.  **Finalize:** Fetch User details (via Token Decode or `/me` endpoint).

---

## 5. RBAC (Role-Based Access Control)

We enforce permissions at two levels: **Routing (UI)** and **HTTP (Client Guard)**.

### 5.1. Route Protection
We use a wrapper component `<ProtectedRoute />` in `react-router-dom`.

```tsx
// Usage in Router
{
  element: <ProtectedRoute requiredRoles={["ADMIN"]} requiredPermissions={["users.delete"]} />,
  children: [ ... ]
}
```

*   **Logic:**
    1.  Is User Logged In? -> No? Redirect to Login.
    2.  Does User have `ADMIN` role? -> No? Redirect to Unauthorized.
    3.  Does User have `users.delete` permission? -> No? Redirect to Unauthorized.

### 5.2. HTTP Client Guard
We can attach requirements directly to API calls. If the user lacks permission, the request **never leaves the browser**, saving bandwidth and server load.

```typescript
// Usage in Service
apiClient.delete(`/users/${id}`, {
  requireRole: ["ADMIN"],
  requirePermission: ["users.delete"]
});
```

---

## 6. Public vs. Protected Routing

To prevent visual flickering (showing Login page for 0.1s before redirecting to Dashboard), we handle initialization states carefully.

*   **`isInitialized` Flag:** The `AuthProvider` exposes this boolean. It is `false` while the app checks for cookies/storage on load.
*   **Protected Routes:** Block rendering and show a `<FullPageLoader />` until `isInitialized` is `true`.
*   **Public Routes:** (e.g., Landing Page) Render **instantly**. They do not wait for the auth check.
*   **PublicRoute Guard:** (e.g., Login Page) Waits for initialization. If the user is found to be logged in, it redirects them to the Dashboard immediately.

---

## 7. Adding New APIs

When adding new features, follow this flow:

1.  **Define Types:** Add request/response interfaces in `domain/types.ts`.
2.  **Create Endpoint:** Create `infrastructure/api/endpoints/entity.api.ts`.
    *   Use `apiClient`.
    *   Keep it stateless (just URLs and methods).
3.  **Create Service:** Create `features/entity/services/entity.service.ts`.
    *   Call the API.
    *   Handle business logic/transformations.
4.  **Consume:** Use the Service in your React Components.

---

## 8. Summary of Components

| Component | Responsibility |
| :--- | :--- |
| `tokenStore` | **Facade.** Hides the complexity of Cookie vs. LocalStorage from the app. |
| `apiClient` | **Engine.** Handles Axios, Headers, RBAC checks, and Token Rotation. |
| `authService` | **Manager.** Orchestrates Login, Logout, and Session Restoration. |
<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

| `AuthProvider` | **State.** Provides `user` object and `login/logout` methods to React tree. |
| `ProtectedRoute` | **Guard.** Protects URL routes based on Auth/Roles. |