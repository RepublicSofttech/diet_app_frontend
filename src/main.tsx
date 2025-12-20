import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { NuqsAdapter } from 'nuqs/adapters/react'

// Global Styles
import '@/app/styles/index.css';

// Infrastructure
import { AuthProvider } from '@/app/providers/AuthProvider';
// import { QueryProvider } from '@/app/providers/QueryProvider';
import { router } from './app/router/router';
import { FullPageLoader } from './shared/components/ui/FullPageLoader';


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      refetchOnWindowFocus: false,
    },
  },
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 1. QueryProvider for data fetching */}
    {/* <QueryProvider> */}
      {/* 2. AuthProvider initializes the session (Cookie/LS check) */}
         <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* 3. Suspense handles lazy-loaded pages */}
        <Suspense fallback={<FullPageLoader />}>
          {/* 4. RouterProvider is the new "App" */}
          <NuqsAdapter>
          <RouterProvider router={router} />
          </NuqsAdapter>
        </Suspense>
      </AuthProvider>
      </QueryClientProvider>
    {/* </QueryProvider> */}
  </StrictMode>,
);