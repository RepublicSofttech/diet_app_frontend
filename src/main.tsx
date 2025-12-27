import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from 'sonner';

import '@/app/styles/index.css';
import { router } from './app/router/router';
import { FullPageLoader } from './shared/components/ui/FullPageLoader';
import { AuthProvider } from './app/providers/simpleAuthProvider';
import { ThemeProvider } from './shared/components/ui/theme-provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <Toaster position="top-right" richColors />
          <Suspense fallback={<FullPageLoader />}>
            <RouterProvider router={router} />
          </Suspense>
        </AuthProvider>
        </ThemeProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  </StrictMode>
);