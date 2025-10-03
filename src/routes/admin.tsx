import { createFileRoute } from '@tanstack/react-router'

import { ProtectedRoute } from '@/components/ProtectedRoute'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
            <p className="text-gray-600 mb-8">
              Welcome to the admin panel. This area is only accessible to administrators.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-900 mb-2">Skills</h2>
                <p className="text-blue-700 text-sm">Manage skills and categories</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h2 className="text-xl font-semibold text-green-900 mb-2">Experience</h2>
                <p className="text-green-700 text-sm">Manage work experience</p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h2 className="text-xl font-semibold text-purple-900 mb-2">Education</h2>
                <p className="text-purple-700 text-sm">Manage education records</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Admin functionality will be implemented in the next phase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
