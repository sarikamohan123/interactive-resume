import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import { useAuthContext } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export function Header() {
  const { user, profile, isAdmin, loading } = useAuthContext()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await supabase.auth.signOut()
      // Navigation will happen automatically via AuthContext
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">IR</span>
              <span className="hidden sm:block text-xl font-semibold text-gray-900">
                Interactive Resume
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              activeProps={{ className: 'text-blue-600' }}
            >
              Home
            </Link>
            <Link
              to="/resume"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              activeProps={{ className: 'text-blue-600' }}
            >
              Resume
            </Link>

            {/* Admin Link - Only visible to admins */}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1"
                activeProps={{ className: 'text-blue-600' }}
              >
                <span>Admin</span>
                <span className="px-2 py-0.5 text-xs font-semibold text-white bg-purple-600 rounded">
                  Admin
                </span>
              </Link>
            )}

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="hidden md:flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {profile?.full_name || user.email}
                    </p>
                    {isAdmin && (
                      <p className="text-xs text-purple-600 font-semibold">Administrator</p>
                    )}
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {(profile?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
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
