import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

import { ProtectedRoute } from '@/components/ProtectedRoute'

export const Route = createFileRoute('/admin/__layout')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50">
        {/* Admin Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link
                  to="/admin"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
                  activeProps={{
                    className:
                      'inline-flex items-center px-1 pt-1 text-sm font-medium text-blue-600 border-b-2 border-blue-500',
                  }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/categories"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
                  activeProps={{
                    className:
                      'inline-flex items-center px-1 pt-1 text-sm font-medium text-blue-600 border-b-2 border-blue-500',
                  }}
                >
                  Categories
                </Link>
                <Link
                  to="/admin/subcategories"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
                  activeProps={{
                    className:
                      'inline-flex items-center px-1 pt-1 text-sm font-medium text-blue-600 border-b-2 border-blue-500',
                  }}
                >
                  Subcategories
                </Link>
                <Link
                  to="/admin/skills"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
                  activeProps={{
                    className:
                      'inline-flex items-center px-1 pt-1 text-sm font-medium text-blue-600 border-b-2 border-blue-500',
                  }}
                >
                  Skills
                </Link>
              </div>
              <div className="flex items-center">
                <Link to="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Back to Site
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
