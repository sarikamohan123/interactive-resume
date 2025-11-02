import { createRootRoute, Outlet, useRouter } from '@tanstack/react-router'
import { useEffect, useLayoutEffect } from 'react'
import { Toaster } from 'sonner'

import { ErrorBoundary } from '@/components/error-boundary'
import { GlobalLoading } from '@/components/global-loading'
import { Header } from '@/components/layout/Header'

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ({ error, reset }) => <ErrorBoundary error={error} reset={reset} />,
  pendingComponent: GlobalLoading,
})

function RootComponent() {
  const router = useRouter()

  // Handle password recovery redirects
  useEffect(() => {
    const hash = window.location.hash
    const currentPath = window.location.pathname

    // Only redirect if we're on the home page and have a recovery/invite token
    if (currentPath === '/' && (hash.includes('type=recovery') || hash.includes('type=invite'))) {
      // Use window.location.replace to preserve the hash
      window.location.replace(`/reset-password${hash}`)
    }
  }, [])

  // Scroll to top on route change to ensure content is visible
  // Using useLayoutEffect to ensure scroll happens before child components check viewport
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [router.state.location.pathname])

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Header />
      <main className="overflow-hidden">
        <Outlet />
      </main>
      <Toaster position="top-right" richColors />
    </div>
  )
}
