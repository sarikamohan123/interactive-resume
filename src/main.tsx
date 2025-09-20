import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRouter, RouterProvider } from '@tanstack/react-router'
//import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'

import { queryClient } from '@/lib/queryClient'

import { routeTree } from './routeTree.gen'

import './index.css'

// Create router with modern configuration
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

// Register router for TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Get root element with proper error handling
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

// Modern React 19 rendering with Concurrent Features
createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}
      >
        <RouterProvider router={router} />
      </Suspense>
      {import.meta.env.DEV && (
        <>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
          <TanStackRouterDevtools router={router} position="bottom-left" />
        </>
      )}
    </QueryClientProvider>
  </StrictMode>
)
