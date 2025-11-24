-- =====================================================
-- Interactive Resume - Certifications Table Migration
-- =====================================================
-- This migration adds support for a dedicated certifications section
-- separate from the skills table, with metadata for verification.

-- =====================================================
-- SECTION 1: Create Certifications Table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issued_at DATE NOT NULL,
  credential_id TEXT,
  credential_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

SELECT 'Section 1 complete: certifications table created' AS status;

-- ROLLBACK 1 (if needed):
-- DROP TABLE IF EXISTS public.certifications;

-- =====================================================
-- SECTION 2: Enable RLS on Certifications Table
-- =====================================================

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Public read access for certifications
CREATE POLICY "Public read access" ON public.certifications
  FOR SELECT USING (true);

-- Admin policies for certifications
CREATE POLICY "Admin can insert certifications" ON public.certifications
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update certifications" ON public.certifications
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin can delete certifications" ON public.certifications
  FOR DELETE USING (public.is_admin());

SELECT 'Section 2 complete: RLS policies for certifications created' AS status;

-- ROLLBACK 2 (if needed):
-- DROP POLICY "Admin can delete certifications" ON public.certifications;
-- DROP POLICY "Admin can update certifications" ON public.certifications;
-- DROP POLICY "Admin can insert certifications" ON public.certifications;
-- DROP POLICY "Public read access" ON public.certifications;

-- =====================================================
-- SECTION 3: Insert Existing Certifications Data
-- =====================================================
-- These are migrated from the skills table with correct issued dates

INSERT INTO public.certifications (name, issuing_organization, issued_at, sort_order)
VALUES
  ('AWS Certified Cloud Practitioner Foundational', 'Amazon Web Services', '2022-04-01'::DATE, 1),
  ('AWS Certified Solutions Architect – Associate', 'Amazon Web Services', '2023-07-01'::DATE, 2),
  ('Professional Scrum Master I (PSM I)', 'Scrum Alliance', '2024-11-01'::DATE, 3)
ON CONFLICT DO NOTHING;

SELECT 'Section 3 complete: existing certifications migrated' AS status;

-- ROLLBACK 3 (if needed):
-- DELETE FROM public.certifications WHERE name IN (
--   'AWS Certified Cloud Practitioner Foundational',
--   'AWS Certified Solutions Architect – Associate',
--   'Professional Scrum Master I (PSM I)'
-- );

-- =====================================================
-- SECTION 4: Remove Certifications from Skills (Optional)
-- =====================================================
-- Uncomment the following if you want to remove the old skill entries
-- Note: This assumes you identified the certifications subcategory_id

-- DELETE FROM public.skills
-- WHERE subcategory_id IN (
--   SELECT id FROM public.subcategories WHERE name = 'Certifications'
-- );

-- If you want to delete the entire "Certifications" subcategory:
-- DELETE FROM public.subcategories WHERE name = 'Certifications';

-- SELECT 'Section 4 complete: certifications removed from skills table' AS status;
