-- =====================================================
-- Admin Access Verification Script
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Check if your user profile exists
SELECT
  id,
  email,
  full_name,
  is_admin,
  created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 5;

-- Step 2: Grant admin access (REPLACE 'your-email@example.com' with YOUR email)
UPDATE public.profiles
SET is_admin = true
WHERE email = 'your-email@example.com';
-- Expected: UPDATE 1

-- Step 3: Verify admin flag is set
SELECT
  email,
  is_admin,
  CASE
    WHEN is_admin = true THEN '✅ Admin access granted'
    ELSE '❌ Not an admin'
  END as status
FROM public.profiles
WHERE email = 'your-email@example.com';

-- Step 4: Test is_admin() function
SELECT
  public.is_admin() as is_admin_result,
  auth.uid() as current_user_id;
-- Expected (when logged in as admin): is_admin_result = true

-- Step 5: Verify RLS policies exist
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('skills', 'categories', 'experiences', 'education', 'subcategories')
ORDER BY tablename, cmd;
-- Expected: Should see policies for INSERT, UPDATE, DELETE for each table

-- Step 6: Test data access (SELECT queries)
SELECT 'Categories count' as entity, COUNT(*) as count FROM public.categories
UNION ALL
SELECT 'Subcategories count', COUNT(*) FROM public.subcategories
UNION ALL
SELECT 'Skills count', COUNT(*) FROM public.skills
UNION ALL
SELECT 'Experiences count', COUNT(*) FROM public.experiences
UNION ALL
SELECT 'Education count', COUNT(*) FROM public.education;
-- Expected: Should show counts for all tables (works for everyone via public read policy)

-- =====================================================
-- Post-Verification Actions
-- =====================================================
-- After running this script:
-- 1. Logout from the app
-- 2. Login again to refresh JWT token with admin claims
-- 3. Navigate to /admin
-- 4. Try clicking on Skills, Categories, etc.
-- 5. Try creating/editing/deleting a record
-- =====================================================
