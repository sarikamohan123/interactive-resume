-- =====================================================
-- Fix is_admin() Function - Remove SET Statement
-- =====================================================
-- Issue: Function marked as STABLE cannot use SET commands
-- Error: "SET is not allowed in a non-volatile function"
-- Solution: Move SET search_path to function attributes
-- Note: Using CASCADE to drop dependent policies, then recreate them

-- Drop the existing function and all dependent policies
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- Recreate with search_path as an attribute instead of in the function body
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$;

-- Recreate all admin policies that were dropped

-- Categories admin policies
CREATE POLICY "Admin can insert categories" ON public.categories
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin can update categories" ON public.categories
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin can delete categories" ON public.categories
  FOR DELETE USING (public.is_admin());

-- Subcategories admin policies
CREATE POLICY "Admin can insert subcategories" ON public.subcategories
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin can update subcategories" ON public.subcategories
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin can delete subcategories" ON public.subcategories
  FOR DELETE USING (public.is_admin());

-- Skills admin policies
CREATE POLICY "Admin can insert skills" ON public.skills
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin can update skills" ON public.skills
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin can delete skills" ON public.skills
  FOR DELETE USING (public.is_admin());

-- Experiences admin policies
CREATE POLICY "Admin can insert experiences" ON public.experiences
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin can update experiences" ON public.experiences
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin can delete experiences" ON public.experiences
  FOR DELETE USING (public.is_admin());

-- Education admin policies
CREATE POLICY "Admin can insert education" ON public.education
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin can update education" ON public.education
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin can delete education" ON public.education
  FOR DELETE USING (public.is_admin());

-- Showcase items admin policies
CREATE POLICY "Admin can insert showcase_items" ON public.showcase_items
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin can update showcase_items" ON public.showcase_items
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin can delete showcase_items" ON public.showcase_items
  FOR DELETE USING (public.is_admin());

-- Verify the function was created successfully
SELECT 'is_admin() function fixed and all policies recreated successfully' AS status;

-- Test the function (should return false if not logged in as admin)
SELECT public.is_admin() AS is_current_user_admin;
