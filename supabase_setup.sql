-- Enable RLS
ALTER TABLE IF EXISTS details ENABLE ROW LEVEL SECURITY;

-- 1. Users Table (for RLS simulation)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'architect')) NOT NULL
);

-- 2. Details Table
CREATE TABLE details (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT NOT NULL,
  description TEXT NOT NULL,
  source TEXT CHECK (source IN ('standard', 'user_project')) NOT NULL,
  user_id INTEGER REFERENCES users(id)
);

-- 3. Detail Usage Rules (Logic)
CREATE TABLE detail_usage_rules (
  id SERIAL PRIMARY KEY,
  detail_id INTEGER REFERENCES details(id),
  host_element TEXT NOT NULL,
  adjacent_element TEXT NOT NULL,
  exposure TEXT NOT NULL
);

-- enable RLS on details
ALTER TABLE details ENABLE ROW LEVEL SECURITY;

-- Create Simuated RLS Function (Transaction-based Session Variable)
-- We will set 'app.current_user_email' in the transaction before querying
CREATE OR REPLACE FUNCTION current_user_email() RETURNS TEXT AS $$
  SELECT current_setting('app.current_user_email', true);
$$ LANGUAGE sql STABLE;

-- RLS POLICY: Admin sees all
CREATE POLICY admin_all ON details
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = current_user_email() 
      AND role = 'admin'
    )
  );

-- RLS POLICY: Architect sees 'standard' OR their own 'user_project'
CREATE POLICY architect_access ON details
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.email = current_user_email() 
      AND u.role = 'architect'
      AND (
        details.source = 'standard' 
        OR 
        (details.source = 'user_project' AND details.user_id = u.id)
      )
    )
  );

-- ==========================================
-- SEED DATA (Exact contents from Assignment)
-- ==========================================

-- Users
INSERT INTO users (email, role) VALUES 
('admin@example.com', 'admin'),
('alice@example.com', 'architect'), -- Owner of user_project
('bob@example.com', 'architect');   -- Architect who shouldn't see Alice's private project

-- Details
INSERT INTO details (id, title, category, tags, description, source, user_id) VALUES
(1, 'External Wall – Slab Junction Waterproofing', 'Wall', 'wall,slab,waterproofing,external', 'Waterproof membrane continuity at external wall and slab junction', 'standard', NULL),
(2, 'Window Sill Detail with Drip', 'Window', 'window,sill,drip,external', 'External window sill detail with drip groove', 'standard', NULL),
(3, 'Internal Wall – Floor Junction', 'Wall', 'wall,floor,internal', 'Junction detail between internal wall and finished floor', 'user_project', 2); -- Owned by Alice (id 2)

-- Reset sequence to avoid next insert failing
SELECT setval('details_id_seq', (SELECT MAX(id) FROM details));

-- Detail Usage Rules
-- Rule 1 maps to Detail 1, etc.
INSERT INTO detail_usage_rules (detail_id, host_element, adjacent_element, exposure) VALUES
(1, 'External Wall', 'Slab', 'External'),
(2, 'Window', 'External Wall', 'External'),
(3, 'Internal Wall', 'Floor', 'Internal');
