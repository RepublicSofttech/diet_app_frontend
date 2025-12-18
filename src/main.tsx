import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { NuqsAdapter } from 'nuqs/adapters/react'

// Global Styles
import '@/app/styles/index.css';

// Infrastructure
import { AuthProvider } from '@/app/providers/AuthProvider';
import { router } from './app/router/router';
import { FullPageLoader } from './shared/components/ui/FullPageLoader';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 1. AuthProvider initializes the session (Cookie/LS check) */}
    <AuthProvider>
      <Toaster position="top-right" richColors />
      {/* 2. Suspense handles lazy-loaded pages */}
      <Suspense fallback={<FullPageLoader />}>
        {/* 3. RouterProvider is the new "App" */}
        <NuqsAdapter>
        <RouterProvider router={router} />
        </NuqsAdapter>
      </Suspense>
    </AuthProvider>
  </StrictMode>,
);