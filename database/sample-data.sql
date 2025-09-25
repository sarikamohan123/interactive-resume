-- ⚠️ DEV SEED ONLY: DO NOT RUN IN PRODUCTION
-- =====================================================
-- Sample Data for Development Testing
-- Interactive Resume Application
--
-- This script is idempotent and safe to re-run
-- =====================================================

BEGIN;

-- Clean slate: Remove all existing data and reset sequences
TRUNCATE TABLE public.skills,
               public.subcategories,
               public.categories,
               public.experiences,
               public.education
RESTART IDENTITY CASCADE;

-- =====================================================
-- Categories & Skills Hierarchy
-- =====================================================

-- Insert categories
INSERT INTO public.categories (id, name, sort_order) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Frontend Development', 1),
  ('550e8400-e29b-41d4-a716-446655440002', 'Backend Development', 2),
  ('550e8400-e29b-41d4-a716-446655440003', 'Tools & DevOps', 3);

-- Insert subcategories
INSERT INTO public.subcategories (id, category_id, name, sort_order) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'JavaScript Frameworks', 1),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'UI Libraries', 2),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Languages', 1),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Databases', 2),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'Version Control', 1);

-- Insert skills with realistic levels and years
INSERT INTO public.skills (id, subcategory_id, name, level, years, description, links, sort_order) VALUES
  -- Frontend - JavaScript Frameworks
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'React', 'Expert', 5, 'Advanced React development with hooks, context, and modern patterns', '{"documentation": "https://react.dev", "github": "https://github.com/facebook/react"}', 1),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'TypeScript', 'Advanced', 4, 'Strong typing for JavaScript applications', '{"documentation": "https://www.typescriptlang.org"}', 2),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Next.js', 'Intermediate', 2, 'Full-stack React framework with SSR/SSG', '{"documentation": "https://nextjs.org"}', 3),

  -- Frontend - UI Libraries
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'Tailwind CSS', 'Advanced', 3, 'Utility-first CSS framework', '{"documentation": "https://tailwindcss.com"}', 1),
  ('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'Material-UI', 'Intermediate', 2, 'React component library', '{"documentation": "https://mui.com"}', 2),

  -- Backend - Languages
  ('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440003', 'Node.js', 'Advanced', 4, 'Server-side JavaScript runtime', '{"documentation": "https://nodejs.org"}', 1),
  ('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440003', 'Python', 'Intermediate', 3, 'Backend development and automation', '{"documentation": "https://python.org"}', 2),

  -- Backend - Databases
  ('770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440004', 'PostgreSQL', 'Advanced', 3, 'Relational database with advanced features', '{"documentation": "https://postgresql.org"}', 1),
  ('770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440004', 'Supabase', 'Intermediate', 1, 'Backend-as-a-service platform', '{"documentation": "https://supabase.com"}', 2),

  -- Tools - Version Control
  ('770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440005', 'Git', 'Expert', 6, 'Distributed version control system', '{"documentation": "https://git-scm.com"}', 1);

-- =====================================================
-- Work Experience Sample Data
-- =====================================================

INSERT INTO public.experiences (id, company, role, start_date, end_date, bullets) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', 'TechCorp Solutions', 'Senior Frontend Developer', '2022-01-15', null,
   '["Led development of React-based dashboard serving 10k+ daily users", "Implemented TypeScript migration reducing bugs by 40%", "Mentored junior developers and conducted code reviews", "Optimized application performance resulting in 50% faster load times"]'),

  ('880e8400-e29b-41d4-a716-446655440002', 'StartupXYZ', 'Full Stack Developer', '2020-03-10', '2021-12-30',
   '["Built MVP from scratch using React and Node.js", "Designed and implemented REST API serving mobile and web clients", "Set up CI/CD pipeline with automated testing and deployment", "Collaborated with design team to create responsive user interfaces"]'),

  ('880e8400-e29b-41d4-a716-446655440003', 'Digital Agency Inc', 'Frontend Developer', '2018-08-01', '2020-02-28',
   '["Developed custom WordPress themes and React components", "Worked with clients to translate designs into functional websites", "Maintained legacy codebases and implemented modern tooling", "Participated in agile development process with daily standups"]');

-- =====================================================
-- Education Sample Data
-- =====================================================

INSERT INTO public.education (id, school, degree, start_date, end_date, details) VALUES
  ('990e8400-e29b-41d4-a716-446655440001', 'State University', 'Bachelor of Science in Computer Science', '2014-08-25', '2018-05-15',
   '{"gpa": "3.7", "honors": ["Dean''s List", "Magna Cum Laude"], "relevant_coursework": ["Data Structures", "Algorithms", "Database Systems", "Web Development"], "activities": ["Computer Science Club", "Hackathon Organizer"]}'),

  ('990e8400-e29b-41d4-a716-446655440002', 'Online Learning Platform', 'React Developer Certification', '2019-06-01', '2019-08-30',
   '{"provider": "Meta", "credential_id": "ABC123", "skills_covered": ["React Hooks", "State Management", "Testing"], "project": "Built e-commerce application as capstone project"}');

-- =====================================================
-- Verification Queries
-- =====================================================

-- Verify data insertion
SELECT 'Categories inserted:' as check_type, count(*) as count FROM public.categories
UNION ALL
SELECT 'Subcategories inserted:', count(*) FROM public.subcategories
UNION ALL
SELECT 'Skills inserted:', count(*) FROM public.skills
UNION ALL
SELECT 'Experiences inserted:', count(*) FROM public.experiences
UNION ALL
SELECT 'Education records inserted:', count(*) FROM public.education;

-- Sample query to verify relationships
SELECT
  c.name as category,
  sc.name as subcategory,
  s.name as skill,
  s.level,
  s.years
FROM public.skills s
JOIN public.subcategories sc ON s.subcategory_id = sc.id
JOIN public.categories c ON sc.category_id = c.id
ORDER BY c.sort_order, sc.sort_order, s.sort_order
LIMIT 5;

COMMIT;