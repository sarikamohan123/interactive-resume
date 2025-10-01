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
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, is_admin, created_at, updated_at')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Profile fetch error:', error.message)
        return null
      }

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

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted.current) return

      setSession(session)
      setUser(session?.user ?? null)

      // Fetch profile if user exists
      if (session?.user) {
        fetchProfile(session.user.id).then((data) => {
          if (mounted.current) {
            setProfile(data)
            setLoading(false)
          }
        })
      } else {
        setLoading(false)
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
        const data = await fetchProfile(session.user.id)
        if (mounted.current) {
          setProfile(data)
          setLoading(false)
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
