import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'

import { ErrorBoundary } from '@/components/error-boundary'
import { GlobalLoading } from '@/components/global-loading'
import { Header } from '@/components/layout/Header'

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ({ error, reset }) => <ErrorBoundary error={error} reset={reset} />,
  pendingComponent: GlobalLoading,
})

function RootComponent() {
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

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
