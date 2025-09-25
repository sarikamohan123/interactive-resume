import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/404')({
  component: NotFoundComponent,
})

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <div className="mb-4 text-8xl">404</div>
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Page Not Found</h1>
        <p className="mb-8 text-lg text-gray-600">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}