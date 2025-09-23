import { createRootRoute, Outlet } from '@tanstack/react-router'

import { ErrorBoundary } from '@/components/error-boundary'
import { GlobalLoading } from '@/components/global-loading'

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ({ error, reset }) => <ErrorBoundary error={error} reset={reset} />,
  pendingComponent: GlobalLoading,
})

function RootComponent() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Outlet />
    </div>
  )
}
