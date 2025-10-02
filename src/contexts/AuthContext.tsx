import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
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

  // Track mounted state to avoid memory leaks
  const mounted = useRef(true)

  // Fetch profile function (reusable)
  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)

      const startTime = Date.now()
      const result = await supabase
        .from('profiles')
        .select('id, email, full_name, is_admin, created_at, updated_at')
        .eq('id', userId)
        .maybeSingle()

      const endTime = Date.now()
      console.log(`Profile query took ${endTime - startTime}ms`)

      const { data, error } = result

      if (error) {
        console.error('Profile fetch error:', error.message, error)
        return null
      }

      if (!data) {
        console.warn('No profile found for user:', userId)
        return null
      }

      console.log('Profile fetched successfully:', data)
      return data
    } catch (err) {
      console.error('Unexpected profile fetch error:', err)
      return null
    }
  }

  // Manual refresh function for consumers
  const refreshProfile = async () => {
    if (!user?.id) {
      console.warn('Cannot refresh profile: no user logged in')
      return
    }

    const data = await fetchProfile(user.id)
    if (mounted.current && data) {
      setProfile(data)
    }
  }

  // Initialize auth state
  useEffect(() => {
    mounted.current = true

    // Safety timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.warn('Auth loading timeout - forcing loading to false')
      if (mounted.current) {
        setLoading(false)
      }
    }, 5000) // 5 second timeout

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted.current) return

      console.log('Session retrieved:', session ? 'Yes' : 'No')
      setSession(session)
      setUser(session?.user ?? null)

      // Fetch profile if user exists
      if (session?.user) {
        fetchProfile(session.user.id)
          .then((data) => {
            if (mounted.current) {
              setProfile(data)
              setLoading(false)
              clearTimeout(loadingTimeout)
            }
          })
          .catch((err) => {
            console.error('Profile fetch failed:', err)
            if (mounted.current) {
              setLoading(false) // Set loading false even on error
              clearTimeout(loadingTimeout)
            }
          })
      } else {
        setLoading(false)
        clearTimeout(loadingTimeout)
      }
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted.current) return

      setSession(session)
      setUser(session?.user ?? null)

      // Fetch profile on sign in, clear on sign out
      if (session?.user) {
        try {
          const data = await fetchProfile(session.user.id)
          if (mounted.current) {
            setProfile(data)
            setLoading(false)
          }
        } catch (err) {
          console.error('Profile fetch failed in auth listener:', err)
          if (mounted.current) {
            setLoading(false)
          }
        }
      } else {
        if (mounted.current) {
          setProfile(null)
          setLoading(false)
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
      isAdmin,
      refreshProfile,
    }),
    [user, session, profile, loading, isAdmin]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook with error handling
export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
