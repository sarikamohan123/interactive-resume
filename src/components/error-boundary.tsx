interface ErrorBoundaryProps {
  error: Error
  reset: () => void
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="mb-4 text-6xl">⚠️</div>
        <h1 className="mb-4 text-2xl font-bold text-red-600">
          Oops! Something went wrong
        </h1>
        <p className="mb-6 text-gray-600">
          We encountered an unexpected error. Please try refreshing the page.
        </p>

        {/* Show stack trace only in development */}
        {import.meta.env.DEV && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              Error Details (Dev Only)
            </summary>
            <pre className="mt-2 overflow-auto rounded-lg bg-gray-100 p-3 text-xs text-gray-700">
              {error.message}
              {error.stack && (
                <>
                  {'\n\n'}
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}

        <div className="space-x-4">
          <button
            onClick={reset}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  )
}