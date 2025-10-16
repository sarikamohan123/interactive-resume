-- =====================================================
-- Interactive Resume Database Migration - Phase 4
-- Incremental Migration with Auth Testing & Fallbacks
-- =====================================================

-- INITIAL AUTH PROBE TESTS
-- Run these first to verify auth schema access
-- =====================================================

-- Test 1: Basic auth schema access
SELECT 'Auth schema test' AS test, 1 FROM auth.users LIMIT 1;

-- If Test 1 fails, stop here and report the error.
-- Expected: Should return one row with test='Auth schema test' and 1

-- =====================================================
-- SECTION A: Enable pgcrypto Extension
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

SELECT 'Section A complete: pgcrypto enabled' AS status;
-- optional probe: will confirm if we can reference auth.users directly
SELECT 1 FROM auth.users LIMIT 1;

-- ROLLBACK A (if needed):
-- DROP EXTENSION IF EXISTS "pgcrypto";

-- =====================================================
-- SECTION B: Create Profiles Table + Signup Trigger
-- =====================================================

-- Test 2: Attempt FK creation to auth.users (this tests FK capability)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- If the above CREATE TABLE fails with FK error, use this fallback:
-- FALLBACK B1: profiles without FK constraint
-- CREATE TABLE IF NOT EXISTS public.profiles (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   email TEXT NOT NULL,
--   full_name TEXT,
--   is_admin BOOLEAN DEFAULT FALSE,
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   updated_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- Enable RLS on profiles immediately after table creation
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin checking function (requires SECURITY DEFINER for auth.uid())
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  SET search_path = public;
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Hardened profile creation trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name','')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END
$$;

-- Rebind the trigger idempotently
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- If trigger creation fails, use this fallback:
-- FALLBACK B2: Handle profile creation in app code after signup
-- (Remove the trigger and handle profile creation on first login)

-- Updated_at trigger for profiles
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

SELECT 'Section B complete: profiles table and auth functions created' AS status;

-- ROLLBACK B (if needed):
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
-- DROP FUNCTION IF EXISTS public.handle_new_user();
-- DROP FUNCTION IF EXISTS public.handle_updated_at();
-- DROP FUNCTION IF EXISTS public.is_admin();
-- DROP TABLE IF EXISTS public.profiles;

-- =====================================================
-- SECTION C: Create Domain Tables (from DBML schema)
-- =====================================================

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subcategories table
CREATE TABLE IF NOT EXISTS public.subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: same subcategory name allowed in different categories
  UNIQUE(category_id, name)
);

-- Skills table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcategory_id UUID NOT NULL REFERENCES public.subcategories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level TEXT,
  years NUMERIC,
  description TEXT,
  links JSONB,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: prevent duplicates within a subcategory
  UNIQUE(subcategory_id, name)
);

-- Experiences table
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  bullets JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education table
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school TEXT NOT NULL,
  degree TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Showcase items table
CREATE TABLE IF NOT EXISTS public.showcase_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT,
  details JSONB,
  repo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

SELECT 'Section C complete: all domain tables created' AS status;

-- ROLLBACK C (if needed):
-- DROP TABLE IF EXISTS public.showcase_items;
-- DROP TABLE IF EXISTS public.education;
-- DROP TABLE IF EXISTS public.experiences;
-- DROP TABLE IF EXISTS public.skills;
-- DROP TABLE IF EXISTS public.subcategories;
-- DROP TABLE IF EXISTS public.categories;

-- =====================================================
-- SECTION D: Enable RLS and Create Policies
-- =====================================================

-- Enable RLS on all tables (profiles already enabled in Section B)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showcase_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies (already created in Section B)

-- Public read access for all resume tables
CREATE POLICY "Public read access" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.subcategories
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.skills
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.experiences
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.education
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.showcase_items
  FOR SELECT USING (true);

-- Admin policies: specific INSERT/UPDATE/DELETE (using public.is_admin() function)

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

SELECT 'Section D complete: RLS enabled and policies created' AS status;

-- ROLLBACK D (if needed):
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.subcategories DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.skills DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.experiences DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.education DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.showcase_items DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- SECTION E: Create Performance Indexes
-- =====================================================

-- Categories sorting index
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(sort_order);

-- Subcategories sorting and filtering indexes
CREATE INDEX IF NOT EXISTS idx_subcategories_category_sort ON public.subcategories(category_id, sort_order);

-- Skills sorting and filtering indexes
CREATE INDEX IF NOT EXISTS idx_skills_subcategory_sort ON public.skills(subcategory_id, sort_order);

-- Experiences chronological sorting
CREATE INDEX IF NOT EXISTS idx_experiences_dates ON public.experiences(start_date DESC, end_date DESC);

-- Education chronological sorting
CREATE INDEX IF NOT EXISTS idx_education_dates ON public.education(start_date DESC, end_date DESC);

-- Showcase items chronological sorting
CREATE INDEX IF NOT EXISTS idx_showcase_created ON public.showcase_items(created_at DESC);

SELECT 'Section E complete: performance indexes created' AS status;

-- ROLLBACK E (if needed):
-- DROP INDEX IF EXISTS public.idx_categories_sort_order;
-- DROP INDEX IF EXISTS public.idx_subcategories_category_sort;
-- DROP INDEX IF EXISTS public.idx_skills_subcategory_sort;
-- DROP INDEX IF EXISTS public.idx_experiences_dates;
-- DROP INDEX IF EXISTS public.idx_education_dates;
-- DROP INDEX IF EXISTS public.idx_showcase_created;

-- =====================================================
-- CONNECTIVITY TEST QUERY
-- Run this after completing sections A-E to verify app connectivity
-- =====================================================

-- Test query for app-side connectivity verification
-- Run this in your app: supabase.from('categories').select('*').limit(1)
SELECT 'Migration completed successfully!' AS status,
       'Run connectivity test: supabase.from(''categories'').select(''*'').limit(1)' AS next_step;

-- =====================================================
-- ADMIN SETUP INSTRUCTIONS
-- =====================================================

-- After your first signup in the app, run this to grant admin access:
-- UPDATE public.profiles
-- SET is_admin = true
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL_HERE');

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================