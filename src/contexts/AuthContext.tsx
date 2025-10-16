import type { Session, User } from '@supabase/supabase-js'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { supabase } from '@/lib/supabase'

// Profile type matching the database schema
interface Profile {
  id: string
  email: string
  full_name: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

// Context value type
interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  authReady: boolean // True when session restoration is complete
  isAdmin: boolean
  refreshProfile: () => Promise<void>
}

// Create context
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Provider props
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [authReady, setAuthReady] = useState(false) // New flag for session restoration

  // Track mounted state to avoid memory leaks
  const mounted = useRef(true)

  // Fetch profile function (reusable)
  const fetchProfile = async (userId: string) => {
    try {
      // Create timeout promise to prevent hanging queries
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Profile fetch timeout'))
        }, 3000)
      })

      // Race the query against timeout
      const queryPromise = supabase
        .from('profiles')
        .select('id, email, full_name, is_admin, created_at, updated_at')
        .eq('id', userId)
        .maybeSingle()

      const result = await Promise.race([queryPromise, timeoutPromise])
      const { data, error } = result

      if (error) {
        return null
      }

      if (!data) {
        return null
      }

      return data
    } catch {
      // Profile fetch timeout - continue without profile
      return null
    }
  }

  // Manual refresh function for consumers
  const refreshProfile = useCallback(async () => {
    if (!user?.id) return

    const data = await fetchProfile(user.id)
    if (mounted.current && data) {
      setProfile(data)
    }
  }, [user?.id])

  // Initialize auth state
  useEffect(() => {
    mounted.current = true

    // Safety timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (mounted.current) {
        setLoading(false)
        setAuthReady(true)
      }
    }, 5000) // 5 second timeout

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!mounted.current) {
          return
        }

        setSession(session)
        setUser(session?.user ?? null)

        // Fetch profile if user exists
        if (session?.user) {
          fetchProfile(session.user.id)
            .then(data => {
              if (mounted.current) {
                setProfile(data)
                setLoading(false)
                setAuthReady(true)
                clearTimeout(loadingTimeout)
              }
            })
            .catch(() => {
              if (mounted.current) {
                setLoading(false)
                setAuthReady(true)
                clearTimeout(loadingTimeout)
              }
            })
        } else {
          // No session - auth is ready (logged out state)
          setLoading(false)
          setAuthReady(true)
          clearTimeout(loadingTimeout)
        }
      })
      .catch(() => {
        if (mounted.current) {
          setLoading(false)
          setAuthReady(true)
          clearTimeout(loadingTimeout)
        }
      })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted.current) {
        return
      }

      setSession(session)
      setUser(session?.user ?? null)

      // Handle different auth events
      if (event === 'SIGNED_OUT') {
        if (mounted.current) {
          setProfile(null)
          setLoading(false)
          setAuthReady(true)
        }
        return
      }

      // Fetch profile on sign in
      if (session?.user) {
        try {
          const data = await fetchProfile(session.user.id)
          if (mounted.current) {
            setProfile(data)
            setLoading(false)
            setAuthReady(true)
          }
        } catch {
          if (mounted.current) {
            setLoading(false)
            setAuthReady(true)
          }
        }
      } else {
        if (mounted.current) {
          setProfile(null)
          setLoading(false)
          setAuthReady(true)
        }
      }
    })

    // Cleanup on unmount
    return () => {
      mounted.current = false
      clearTimeout(loadingTimeout)
      subscription.unsubscribe()
    }
  }, [])

  // Derived isAdmin boolean for clean API
  const isAdmin = useMemo(() => profile?.is_admin ?? false, [profile])

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      loading,
      authReady,
      isAdmin,
      refreshProfile,
    }),
    [user, session, profile, loading, authReady, isAdmin, refreshProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook with error handling
// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
