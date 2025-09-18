-- =====================================================
-- Interactive Resume Database Seed Data
-- Optional seed script for quick UI verification
-- =====================================================

-- Insert sample categories (Frontend/Backend split)
INSERT INTO public.categories (id, name, sort_order) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Frontend Development', 1),
  ('550e8400-e29b-41d4-a716-446655440002', 'Backend Development', 2)
ON CONFLICT (name) DO NOTHING;

-- Insert sample subcategories
INSERT INTO public.subcategories (id, category_id, name, sort_order) VALUES
  ('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'Frameworks', 1),
  ('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', 'Languages', 2),
  ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440002', 'Languages', 1),
  ('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440002', 'Databases', 2)
ON CONFLICT (category_id, name) DO NOTHING;

-- Insert sample skills
INSERT INTO public.skills (subcategory_id, name, level, years, description, sort_order) VALUES
  ('550e8400-e29b-41d4-a716-446655440011', 'React', 'Expert', 5, 'Advanced React development with hooks, context, and modern patterns', 1),
  ('550e8400-e29b-41d4-a716-446655440011', 'Vue.js', 'Intermediate', 2, 'Component-based development with Vue 3 composition API', 2),
  ('550e8400-e29b-41d4-a716-446655440012', 'TypeScript', 'Expert', 4, 'Strong typing, generics, and advanced TypeScript patterns', 1),
  ('550e8400-e29b-41d4-a716-446655440012', 'JavaScript', 'Expert', 6, 'ES6+, async/await, functional programming patterns', 2),
  ('550e8400-e29b-41d4-a716-446655440021', 'Node.js', 'Advanced', 4, 'Server-side JavaScript with Express and modern APIs', 1),
  ('550e8400-e29b-41d4-a716-446655440021', 'Python', 'Intermediate', 3, 'Backend development with FastAPI and Django', 2),
  ('550e8400-e29b-41d4-a716-446655440022', 'PostgreSQL', 'Advanced', 4, 'Complex queries, performance optimization, and database design', 1),
  ('550e8400-e29b-41d4-a716-446655440022', 'MongoDB', 'Intermediate', 2, 'Document-based storage and aggregation pipelines', 2)
ON CONFLICT (subcategory_id, name) DO NOTHING;

SELECT 'Seed data inserted successfully!' AS status,
       'Verify with: SELECT * FROM categories;' AS verification;