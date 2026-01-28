-- ============================================================================
-- Additional Tables for Enhanced Features
-- Run this AFTER the main schema
-- ============================================================================

-- ============================================================================
-- 1. NEWSLETTER SUBSCRIBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  source TEXT, -- 'website', 'admin', 'api'
  metadata JSONB -- Additional data like IP, user agent, etc.
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active) WHERE is_active = true;

-- ============================================================================
-- 2. TESTIMONIALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  approved BOOLEAN DEFAULT false, -- Admin approval
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials(order_index);

-- ============================================================================
-- 3. PROJECT FILES TABLE (for attachments/posters)
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'image', 'document', 'video', 'other'
  file_size INTEGER, -- bytes
  is_poster BOOLEAN DEFAULT false, -- Main poster image
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_files_project ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_project_files_poster ON project_files(project_id, is_poster) WHERE is_poster = true;

-- ============================================================================
-- 4. EXPERIENCE FILES TABLE (for logos/certificates)
-- ============================================================================
CREATE TABLE IF NOT EXISTS experience_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experience_id UUID REFERENCES experience(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'logo', 'certificate', 'document', 'other'
  file_size INTEGER, -- bytes
  is_logo BOOLEAN DEFAULT false, -- Company logo
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experience_files_exp ON experience_files(experience_id);
CREATE INDEX IF NOT EXISTS idx_experience_files_logo ON experience_files(experience_id, is_logo) WHERE is_logo = true;

-- ============================================================================
-- 5. UPDATE PROJECTS TABLE - Add poster_url column
-- ============================================================================
ALTER TABLE projects ADD COLUMN IF NOT EXISTS poster_url TEXT;

-- ============================================================================
-- 6. UPDATE EXPERIENCE TABLE - Add logo_url column
-- ============================================================================
ALTER TABLE experience ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- ============================================================================
-- 7. ANALYTICS EVENTS TABLE (for advanced analytics)
-- ============================================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL, -- 'page_view', 'click', 'download', 'form_submit', etc.
  event_name TEXT NOT NULL,
  page_path TEXT,
  element_id TEXT,
  metadata JSONB, -- Additional event data
  visitor_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_path ON analytics_events(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);

-- ============================================================================
-- 8. UPDATE TRIGGERS
-- ============================================================================
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DONE!
-- ============================================================================
