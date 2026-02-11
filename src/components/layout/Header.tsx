import { Link } from '@tanstack/react-router'
import { LogOut, Shield } from 'lucide-react'
import { useState } from 'react'

import { useAuthContext } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'

export function Header() {
  const { user, profile, isAdmin } = useAuthContext()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)

    try {
      // Try proper signOut with a timeout (3 seconds)
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Logout timeout')), 3000)
      )

      await Promise.race([supabase.auth.signOut(), timeoutPromise])

      // Success - proper signout worked
      window.location.href = '/'
    } catch (error) {
      // Fallback: If signOut fails or times out, manually clear storage
      console.warn('SignOut failed or timed out, using fallback method:', error)

      // Manually clear all Supabase auth data from localStorage
      Object.keys(localStorage)
        .filter(key => key.startsWith('sb-'))
        .forEach(key => localStorage.removeItem(key))

      // Reload the page to clear all state
      window.location.href = '/'
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">SS</span>
              <span className="hidden sm:block text-xl font-semibold text-gray-900">
                Sarika Srivastava
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              activeProps={{
                className: 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
              }}
            >
              Home
            </Link>
            <Link
              to="/resume"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              activeProps={{
                className: 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
              }}
            >
              Resume
            </Link>
            <Link
              to="/showcase"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              activeProps={{
                className: 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
              }}
            >
              Showcase
            </Link>

            {/* Admin Link - Only visible to admins */}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                activeProps={{
                  className: 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                }}
              >
                Admin
              </Link>
            )}

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* User Info - Modern card-like design */}
                <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 hover:border-purple-200 transition-all duration-200">
                  <div className="text-right space-y-1.5">
                    {isAdmin && (
                      <Badge className="bg-purple-100 hover:bg-purple-150 text-purple-700 border border-purple-200 text-xs font-semibold px-2 py-0.5 flex items-center gap-1 w-fit ml-auto shadow-sm">
                        <Shield className="w-3 h-3" />
                        Administrator
                      </Badge>
                    )}
                    <p className="text-xs text-gray-600 font-medium">
                      {user.email}
                    </p>
                  </div>
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {(profile?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
