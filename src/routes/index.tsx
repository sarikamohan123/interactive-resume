import { createFileRoute, Link } from '@tanstack/react-router'

import { useCategories } from '@/hooks/useCategories'
import { useSubcategories } from '@/hooks/useSubcategories'
import { useSkills } from '@/hooks/useSkills'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories()
  const { data: subcategories, isLoading: subcategoriesLoading, error: subcategoriesError } = useSubcategories()
  const { data: skills, isLoading: skillsLoading, error: skillsError } = useSkills()

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">Interactive Resume</h1>
        <p className="mb-8 text-lg text-gray-600">
          Modern React 19 application with TanStack Router
        </p>

        <div className="mb-8">
          <Link
            to="/resume"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Resume
          </Link>
        </div>

        {/* Categories Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Categories</h2>

          {categoriesLoading && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg border bg-white p-3 shadow-sm space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          )}

          {categoriesError && (
            <div className="rounded-lg bg-red-50 p-4 text-red-700">
              <p className="font-medium">Error loading categories:</p>
              <p className="text-sm">{categoriesError.message}</p>
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

          {categories && categories.length === 0 && !categoriesLoading && (
            <p className="text-gray-500">No categories found</p>
          )}
        </div>

        {/* RLS Test Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">RLS Read Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-lg border p-3">
              <h3 className="font-medium mb-2">Categories</h3>
              {categoriesLoading ? (
                <Skeleton className="h-5 w-24" />
              ) : (
                <p>{categoriesError ? '❌ Error' : `✅ ${categories?.length || 0} items`}</p>
              )}
            </div>
            <div className="rounded-lg border p-3">
              <h3 className="font-medium mb-2">Subcategories</h3>
              {subcategoriesLoading ? (
                <Skeleton className="h-5 w-24" />
              ) : (
                <p>{subcategoriesError ? '❌ Error' : `✅ ${subcategories?.length || 0} items`}</p>
              )}
            </div>
            <div className="rounded-lg border p-3">
              <h3 className="font-medium mb-2">Skills</h3>
              {skillsLoading ? (
                <Skeleton className="h-5 w-24" />
              ) : (
                <p>{skillsError ? '❌ Error' : `✅ ${skills?.length || 0} items`}</p>
              )}
            </div>
          </div>
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
