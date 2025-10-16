// E2E test for Supabase connectivity
// Run with: npm run test -- supabase.spec.ts
import { createClient } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'

// Skip by default - enable when running against real Supabase project
describe.skip('Supabase E2E Connection Tests', () => {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  )

  it('should connect to Supabase and query categories table', async () => {
    const { data, error } = await supabase.from('categories').select('*').limit(1)

    expect(error).toBeNull()
    expect(data).toBeDefined()
    expect(Array.isArray(data)).toBe(true)
  })

  it('should handle auth state', async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    expect(error).toBeNull()
    // Session should be null initially (no logged in user)
    expect(session).toBeNull()
  })

  it('should be able to read from profiles table (RLS test)', async () => {
    const { data, error } = await supabase.from('profiles').select('*').limit(1)

    // Should not error even if no data (RLS allows reads)
    expect(error).toBeNull()
    expect(data).toBeDefined()
    expect(Array.isArray(data)).toBe(true)
  })
})
