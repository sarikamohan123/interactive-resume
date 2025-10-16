-- =====================================================
-- Fix RLS Policies - Allow Both Anonymous and Authenticated Read Access
-- =====================================================
-- Issue: Authenticated users cannot read data because policies only allow anonymous access
-- Solution: Update policies to allow both anonymous AND authenticated users

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Public read access" ON public.categories;
DROP POLICY IF EXISTS "Public read access" ON public.subcategories;
DROP POLICY IF EXISTS "Public read access" ON public.skills;
DROP POLICY IF EXISTS "Public read access" ON public.experiences;
DROP POLICY IF EXISTS "Public read access" ON public.education;

-- Create new policies that allow both anonymous and authenticated read access
CREATE POLICY "Public read access" ON public.categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access" ON public.subcategories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access" ON public.skills
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access" ON public.experiences
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access" ON public.education
  FOR SELECT
  TO public
  USING (true);

-- Verify policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

SELECT 'RLS policies updated successfully - both anonymous and authenticated users can now read data' AS status;
