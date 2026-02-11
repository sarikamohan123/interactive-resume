-- =====================================================
-- Interactive Resume - Showcase Module Migration
-- =====================================================
-- This migration replaces the basic showcase_items table
-- with a richer projects system including tags and metrics.

-- =====================================================
-- SECTION 0: Drop Old showcase_items Table
-- =====================================================

DROP POLICY IF EXISTS "Public read access" ON public.showcase_items;
DROP POLICY IF EXISTS "Admin can insert showcase_items" ON public.showcase_items;
DROP POLICY IF EXISTS "Admin can update showcase_items" ON public.showcase_items;
DROP POLICY IF EXISTS "Admin can delete showcase_items" ON public.showcase_items;
DROP INDEX IF EXISTS public.idx_showcase_created;
DROP TABLE IF EXISTS public.showcase_items;

SELECT 'Section 0 complete: old showcase_items table dropped' AS status;

-- =====================================================
-- SECTION 1: Create Projects Table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  description TEXT,
  role TEXT,
  hero_image_url TEXT,
  additional_image_urls JSONB DEFAULT '[]'::jsonb,
  live_url TEXT,
  repo_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

SELECT 'Section 1 complete: projects table created' AS status;

-- ROLLBACK 1 (if needed):
-- DROP TABLE IF EXISTS public.projects;

-- =====================================================
-- SECTION 2: Create Project Tags Table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.project_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(project_id, tag)
);

SELECT 'Section 2 complete: project_tags table created' AS status;

-- ROLLBACK 2 (if needed):
-- DROP TABLE IF EXISTS public.project_tags;

-- =====================================================
-- SECTION 3: Create Project Metrics Table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.project_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

SELECT 'Section 3 complete: project_metrics table created' AS status;

-- ROLLBACK 3 (if needed):
-- DROP TABLE IF EXISTS public.project_metrics;

-- =====================================================
-- SECTION 4: Enable RLS on All Tables
-- =====================================================

-- Projects RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Admin can insert projects" ON public.projects
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update projects" ON public.projects
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin can delete projects" ON public.projects
  FOR DELETE USING (public.is_admin());

-- Project Tags RLS
ALTER TABLE public.project_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON public.project_tags
  FOR SELECT USING (true);

CREATE POLICY "Admin can insert project_tags" ON public.project_tags
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update project_tags" ON public.project_tags
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin can delete project_tags" ON public.project_tags
  FOR DELETE USING (public.is_admin());

-- Project Metrics RLS
ALTER TABLE public.project_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON public.project_metrics
  FOR SELECT USING (true);

CREATE POLICY "Admin can insert project_metrics" ON public.project_metrics
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update project_metrics" ON public.project_metrics
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin can delete project_metrics" ON public.project_metrics
  FOR DELETE USING (public.is_admin());

SELECT 'Section 4 complete: RLS policies created for all tables' AS status;

-- ROLLBACK 4 (if needed):
-- DROP POLICY "Admin can delete project_metrics" ON public.project_metrics;
-- DROP POLICY "Admin can update project_metrics" ON public.project_metrics;
-- DROP POLICY "Admin can insert project_metrics" ON public.project_metrics;
-- DROP POLICY "Public read access" ON public.project_metrics;
-- DROP POLICY "Admin can delete project_tags" ON public.project_tags;
-- DROP POLICY "Admin can update project_tags" ON public.project_tags;
-- DROP POLICY "Admin can insert project_tags" ON public.project_tags;
-- DROP POLICY "Public read access" ON public.project_tags;
-- DROP POLICY "Admin can delete projects" ON public.projects;
-- DROP POLICY "Admin can update projects" ON public.projects;
-- DROP POLICY "Admin can insert projects" ON public.projects;
-- DROP POLICY "Public read access" ON public.projects;

-- =====================================================
-- SECTION 5: Create Performance Indexes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON public.projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(is_featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_project_tags_project ON public.project_tags(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tags_tag ON public.project_tags(tag);
CREATE INDEX IF NOT EXISTS idx_project_metrics_project ON public.project_metrics(project_id);

SELECT 'Section 5 complete: indexes created' AS status;
SELECT 'Migration complete: Showcase module tables ready' AS status;
