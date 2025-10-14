-- =====================================================
-- Fix Profiles Table RLS - Allow Users to Read Their Own Profile
-- =====================================================
-- Issue: Authenticated users cannot read their own profile due to missing RLS policy
-- Solution: Add policy allowing users to SELECT their own profile row

-- Drop existing profile read policy if it exists (in case it's misconfigured)
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public read access" ON public.profiles;

-- Create policy: Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Admin policies (should already exist, but ensuring they're correct)
DROP POLICY IF EXISTS "Admin full access" ON public.profiles;

CREATE POLICY "Admin full access" ON public.profiles
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Verify policies
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;

SELECT 'Profiles RLS policies updated - authenticated users can now read their own profile' AS status;
