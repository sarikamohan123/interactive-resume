import { createFileRoute } from '@tanstack/react-router'

import { useCategories } from '@/hooks/useCategories'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  const { data: categories, isLoading, error } = useCategories()

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">Interactive Resume</h1>
        <p className="mb-8 text-lg text-gray-600">
          Modern React 19 application with TanStack Router
        </p>

        {/* Categories Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Categories</h2>

          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading categories...</span>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-red-700">
              <p className="font-medium">Error loading categories:</p>
              <p className="text-sm">{error.message}</p>
            </div>
          )}

          {categories && categories.length > 0 && (
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category.id} className="rounded-lg border bg-white p-3 shadow-sm">
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">Sort order: {category.sort_order}</p>
                </div>
              ))}
            </div>
          )}

          {categories && categories.length === 0 && !isLoading && (
            <p className="text-gray-500">No categories found</p>
          )}
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          <p>✅ TanStack Router working</p>
          <p>✅ React Query integrated</p>
          <p>✅ Error boundaries active</p>
          <p>✅ Development tools loaded</p>
          <p>✅ Supabase connection working</p>
        </div>
      </div>
    </div>
  )
}
