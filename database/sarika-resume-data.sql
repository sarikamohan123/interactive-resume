-- =====================================================
-- IKA SRIVASTAVA - Production Resume Data
-- Power BI Developer - Cincinnati Metro Area
-- =====================================================
--
-- This script populates the Interactive Resume database with real resume data
-- using an idempotent pattern that's safe to run multiple times.
--
-- Features:
-- - No TRUNCATE operations (production-safe)
-- - No hardcoded UUIDs (maintainable)
-- - ON CONFLICT DO NOTHING for tables with unique constraints
-- - WHERE NOT EXISTS for tables without unique constraints
-- - Uses CTEs for clean foreign key relationships
-- - Normalized level values (lowercase for consistency)
--
-- Usage:
-- 1. Open Supabase SQL Editor
-- 2. Copy and paste this entire script
-- 3. Execute to populate with real resume data
-- 4. Safe to re-run without data loss or duplicates
--
-- =====================================================

BEGIN;

-- =====================================================
-- CATEGORIES
-- =====================================================
INSERT INTO public.categories (name, sort_order) VALUES
  ('Programming Languages', 1),
  ('Frameworks & Libraries', 2),
  ('Databases & Data', 3),
  ('Cloud & DevOps', 4),
  ('Tools & Platforms', 5),
  ('Certifications', 6)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- SUBCATEGORIES
-- =====================================================
WITH cats AS (
  SELECT id, name FROM public.categories
)
INSERT INTO public.subcategories (category_id, name, sort_order)
SELECT c.id, v.sub_name, v.sort_order
FROM cats c
JOIN (VALUES
  -- Programming Languages
  ('Programming Languages', 'Backend Languages', 1),
  ('Programming Languages', 'Frontend Languages', 2),
  ('Programming Languages', 'Database Languages', 3),
  ('Programming Languages', 'System Languages', 4),

  -- Frameworks & Libraries
  ('Frameworks & Libraries', 'Frontend Frameworks', 1),
  ('Frameworks & Libraries', 'Backend Frameworks', 2),
  ('Frameworks & Libraries', 'Mobile Frameworks', 3),

  -- Databases & Data
  ('Databases & Data', 'Relational Databases', 1),
  ('Databases & Data', 'Cloud Databases', 2),
  ('Databases & Data', 'Data Analytics', 3),

  -- Cloud & DevOps
  ('Cloud & DevOps', 'Cloud Platforms', 1),
  ('Cloud & DevOps', 'DevOps Tools', 2),

  -- Tools & Platforms
  ('Tools & Platforms', 'Development Tools', 1),
  ('Tools & Platforms', 'Project Management', 2),

  -- Certifications
  ('Certifications', 'AWS Certifications', 1),
  ('Certifications', 'Professional Certifications', 2)
) AS v(cat_name, sub_name, sort_order)
  ON v.cat_name = c.name
ON CONFLICT (category_id, name) DO NOTHING;

-- =====================================================
-- SKILLS (normalized level values: lowercase)
-- =====================================================
WITH subs AS (
  SELECT id, name FROM public.subcategories
)
INSERT INTO public.skills (subcategory_id, name, level, years, description, links, sort_order)
SELECT s.id, v.skill, v.level, v.years, v.description, v.links::jsonb, v.sort_order
FROM subs s
JOIN (VALUES
  -- Backend Languages
  ('Backend Languages', 'C#', 'advanced', 2, 'Backend development with .NET framework', '{}', 1),
  ('Backend Languages', 'Java', 'advanced', 3, 'Enterprise application development', '{}', 2),
  ('Backend Languages', 'C++', 'intermediate', 2, 'System programming and algorithms', '{}', 3),
  ('Backend Languages', 'C', 'intermediate', 2, 'Low-level programming and embedded systems', '{}', 4),

  -- Frontend Languages
  ('Frontend Languages', 'JavaScript', 'advanced', 2, 'Modern ES6+ development and DOM manipulation', '{}', 1),
  ('Frontend Languages', 'TypeScript', 'advanced', 1.5, 'Type-safe JavaScript development', '{}', 2),
  ('Frontend Languages', 'HTML', 'expert', 3, 'Semantic HTML5 markup', '{}', 3),
  ('Frontend Languages', 'CSS', 'advanced', 3, 'Modern CSS3, Flexbox, and Grid layouts', '{}', 4),

  -- Database Languages
  ('Database Languages', 'SQL', 'expert', 3, 'Complex queries, optimization, and database design', '{}', 1),

  -- Frontend Frameworks
  ('Frontend Frameworks', 'Angular', 'advanced', 1, 'Full-stack development with Angular framework', '{}', 1),
  ('Frontend Frameworks', 'Vue.js', 'advanced', 1, 'Component-based frontend development', '{}', 2),

  -- Backend Frameworks
  ('Backend Frameworks', 'Node.js', 'advanced', 2, 'Server-side JavaScript development', '{}', 1),
  ('Backend Frameworks', 'Spring Boot', 'intermediate', 1, 'Java microservices development', '{}', 2),
  ('Backend Frameworks', '.NET', 'advanced', 2, 'Microsoft .NET framework development', '{}', 3),

  -- Mobile Frameworks
  ('Mobile Frameworks', 'Ionic', 'intermediate', 1, 'Cross-platform hybrid mobile apps', '{}', 1),

  -- Relational Databases
  ('Relational Databases', 'MS SQL Server', 'expert', 3, 'Enterprise database management and T-SQL', '{}', 1),
  ('Relational Databases', 'PostgreSQL', 'advanced', 2, 'Advanced relational database with modern features', '{}', 2),
  ('Relational Databases', 'Oracle', 'advanced', 2, 'Enterprise Oracle database administration', '{}', 3),

  -- Cloud Databases
  ('Cloud Databases', 'Supabase', 'advanced', 1, 'Backend-as-a-Service with PostgreSQL', '{}', 1),

  -- Data Analytics
  ('Data Analytics', 'Power BI', 'expert', 1, 'Business intelligence dashboards, KPIs, and data visualization', '{}', 1),
  ('Data Analytics', 'Data Warehouse', 'advanced', 1, 'Enterprise data warehousing solutions', '{}', 2),
  ('Data Analytics', 'DAX', 'advanced', 1, 'Data Analysis Expressions for Power BI', '{}', 3),

  -- Cloud Platforms
  ('Cloud Platforms', 'AWS', 'advanced', 2, 'Amazon Web Services - Solutions Architect Associate', '{}', 1),

  -- DevOps Tools
  ('DevOps Tools', 'Azure DevOps', 'advanced', 1, 'CI/CD pipelines and project management', '{}', 1),
  ('DevOps Tools', 'Git', 'expert', 3, 'Version control and collaborative development', '{}', 2),
  ('DevOps Tools', 'Docker', 'intermediate', 1, 'Containerization and deployment', '{}', 3),

  -- Development Tools
  ('Development Tools', 'VS Code', 'expert', 3, 'Primary code editor with extensions', '{}', 1),
  ('Development Tools', 'Visual Studio', 'advanced', 2, 'Microsoft IDE for .NET development', '{}', 2),
  ('Development Tools', 'GitHub', 'advanced', 3, 'Code hosting and collaboration platform', '{}', 3),

  -- Project Management
  ('Project Management', 'Jira', 'advanced', 1, 'Agile project management and issue tracking', '{}', 1),
  ('Project Management', 'MS Project', 'intermediate', 1, 'Project planning and resource management', '{}', 2),

  -- AWS Certifications
  ('AWS Certifications', 'AWS Solutions Architect Associate', 'certified', 2, 'AWS Certified Solutions Architect – Associate (July 2023)', '{}', 1),
  ('AWS Certifications', 'AWS Cloud Practitioner', 'certified', 3, 'AWS Certified Cloud Practitioner Foundational (April 2022)', '{}', 2),

  -- Professional Certifications
  ('Professional Certifications', 'Professional Scrum Master I', 'certified', 1, 'Professional Scrum Master 1 (PSM I) – Scrum.org (2024)', '{}', 1)

) AS v(sub_name, skill, level, years, description, links, sort_order)
  ON v.sub_name = s.name
ON CONFLICT (subcategory_id, name) DO NOTHING;

-- =====================================================
-- WORK EXPERIENCE (using WHERE NOT EXISTS for deduplication)
-- =====================================================
INSERT INTO public.experiences (company, role, start_date, end_date, bullets)
SELECT
  'Red Hawk Technologies, LLC',
  'Associate Software Engineer',
  '2024-08-01'::date,
  '2025-07-31'::date,
  '["Created reports and visualizations in Power BI for construction industry client, providing insights through dashboards and KPI metrics", "Investigated and resolved anomalies in KPI data using DAX formulas, improving reporting accuracy", "Implemented CI/CD pipelines using Azure DevOps for streamlined deployments in development environment", "Contributed in discovery and data analysis sessions to support design of tailored data warehouse solution for client", "Contributed to frontend and full-stack development across multiple client projects using Angular, Ionic, Vue.js, .NET, and Power BI", "Actively participated in debugging, troubleshooting, and implementing UI/UX improvements", "Collaborated with cross-functional teams to meet agile sprint goals and deliver high-quality features", "Gained exposure to real-world codebases, version control, and client expectations in fast-paced consulting environment", "Promoted based on performance, commitment to learning, and consistent delivery", "Worked on backend development using Supabase and PostgreSQL to implement authentication, database management, and API integrations"]'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.experiences
  WHERE company = 'Red Hawk Technologies, LLC'
    AND role = 'Associate Software Engineer'
    AND start_date = '2024-08-01'::date
);

-- =====================================================
-- EDUCATION (using WHERE NOT EXISTS for deduplication)
-- =====================================================
INSERT INTO public.education (school, degree, start_date, end_date, details)
SELECT * FROM (VALUES
  (
    'MAX Technical Training & Career Programs',
    'Full-Stack Developer Boot Camp Certificate',
    '2024-08-01'::date,
    '2024-11-30'::date,
    '{"location": "Blue Ash, OH", "program_type": "Intensive Boot Camp", "skills_covered": ["Full-Stack Development", "Modern Web Technologies", "Database Design", "Version Control"], "focus": "Practical hands-on experience with modern development stack"}'::jsonb
  ),
  (
    'Sikkim Manipal University',
    'Master of Science in Ecology and Environmental Science',
    '2010-08-01'::date,
    '2012-07-31'::date,
    '{"location": "India", "degree_type": "Masters", "field": "Environmental Science", "specialization": "Ecology and Environmental Science", "background": "Scientific research and analytical thinking foundation"}'::jsonb
  ),
  (
    'DOEACC (Department of Electronics and Accreditation of Computer Courses)',
    'Advanced Diploma in Computer Applications',
    '2008-08-01'::date,
    '2010-07-31'::date,
    '{"location": "India", "credential_type": "Advanced Diploma", "field": "Computer Applications", "skills_covered": ["Programming Fundamentals", "Database Management", "System Analysis", "Software Development"], "foundation": "Core computer science and programming concepts"}'::jsonb
  ),
  (
    'Vedic Kanya PG College',
    'Bachelor of Science',
    '2005-08-01'::date,
    '2008-07-31'::date,
    '{"location": "Jaipur, India", "degree_type": "Bachelors", "subjects": ["Biology", "Chemistry", "Botany"], "foundation": "Scientific methodology and analytical problem-solving skills"}'::jsonb
  )
) AS v(school, degree, start_date, end_date, details)
WHERE NOT EXISTS (
  SELECT 1 FROM public.education e
  WHERE e.school = v.school
    AND e.degree = v.degree
    AND e.start_date = v.start_date
);

-- =====================================================
-- VERIFICATION & SUMMARY
-- =====================================================
DO $$
DECLARE
    cat_count INT;
    subcat_count INT;
    skill_count INT;
    exp_count INT;
    edu_count INT;
BEGIN
    SELECT COUNT(*) INTO cat_count FROM public.categories;
    SELECT COUNT(*) INTO subcat_count FROM public.subcategories;
    SELECT COUNT(*) INTO skill_count FROM public.skills;
    SELECT COUNT(*) INTO exp_count FROM public.experiences;
    SELECT COUNT(*) INTO edu_count FROM public.education;

    RAISE NOTICE '=== IKA SRIVASTAVA RESUME DATA - POPULATION COMPLETE ===';
    RAISE NOTICE 'Categories: %', cat_count;
    RAISE NOTICE 'Subcategories: %', subcat_count;
    RAISE NOTICE 'Skills: %', skill_count;
    RAISE NOTICE 'Experiences: %', exp_count;
    RAISE NOTICE 'Education: %', edu_count;
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Next: Verify data appears in Resume Module UI';
    RAISE NOTICE '=====================================================';
END $$;

COMMIT;

-- =====================================================
-- POST-EXECUTION NOTES
-- =====================================================
--
-- This script has populated the database with:
-- • 6 skill categories (Programming, Frameworks, Databases, Cloud, Tools, Certifications)
-- • 16 subcategories for organized skill grouping
-- • 31 technical skills with normalized level values (lowercase)
-- • 1 current work experience at Red Hawk Technologies
-- • 4 education entries (boot camp, masters, diploma, bachelors)
--
-- All data is production-ready and reflects real resume information.
-- The Resume Module should now display real data instead of sample data.
--
-- To verify: Navigate to the Resume Module in the application and confirm
-- all sections (Skills, Experience, Education) display the correct information.
--