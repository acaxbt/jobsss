-- Seed perusahaan
insert into companies (id, name, description, location, gallery) values
  ('11111111-1111-1111-1111-111111111111', 'PT Maju Jaya', 'Perusahaan teknologi terdepan.', 'A1', ARRAY['https://picsum.photos/200/300?1']),
  ('22222222-2222-2222-2222-222222222222', 'CV Sukses Selalu', 'Konsultan bisnis dan keuangan.', 'B2', ARRAY['https://picsum.photos/200/300?2']),
  ('33333333-3333-3333-3333-333333333333', 'PT Kreatif Mandiri', 'Agensi kreatif digital.', 'C3', ARRAY['https://picsum.photos/200/300?3']);

-- Seed superadmin (bisa akses semua perusahaan)
insert into users (id, email, password, role) values
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'superadmin@jobfair.com', '$2a$10$wH6QwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 'ADMIN');
-- password: superadmin123

-- Seed admin perusahaan (hanya akses 1 perusahaan)
insert into users (id, email, password, role, company_id) values
  ('bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'admin1@ptmajujaya.com', '$2a$10$wH6QwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 'ADMIN', '11111111-1111-1111-1111-111111111111');
-- password: superadmin123

-- Seed lowongan
insert into jobs (id, company_id, title, description) values
  ('j1aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Frontend Developer', 'React, Next.js, Tailwind'),
  ('j2bbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Backend Developer', 'Node.js, Supabase, PostgreSQL'),
  ('j3cccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Business Analyst', 'Analisa data dan proses bisnis'),
  ('j4dddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'Account Executive', 'Sales, komunikasi, presentasi'),
  ('j5eeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'UI/UX Designer', 'Figma, Prototyping, User Research'),
  ('j6ffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333', 'Creative Strategist', 'Strategi konten, branding, digital campaign');
