-- ============================================================================
-- Enable Row Level Security (RLS) on all tables
-- ============================================================================
-- Run this in Supabase SQL Editor to lock down your tables.
--
-- What this does:
-- - Enables RLS on each table so that, by default, the "anon" and "authenticated"
--   roles (e.g. if someone uses your anon key from the client) cannot read/write
--   any rows unless you add policies that allow it.
--
-- Your app will keep working because:
-- - All database access in this project goes through API routes using the
--   SERVICE ROLE key (getSupabaseAdmin()). The service role BYPASSES RLS,
--   so your backend still has full access.
--
-- After running this, the tables will no longer show as "UNRESTRICTED" and
-- direct access with the anon key will be blocked.
-- ============================================================================

-- Analytics
ALTER TABLE IF EXISTS analytics_events ENABLE ROW LEVEL SECURITY;

-- Blog
ALTER TABLE IF EXISTS blog_posts ENABLE ROW LEVEL SECURITY;

-- Experience
ALTER TABLE IF EXISTS experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS experience_files ENABLE ROW LEVEL SECURITY;

-- Newsletter
ALTER TABLE IF EXISTS newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Projects
ALTER TABLE IF EXISTS project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS projects ENABLE ROW LEVEL SECURITY;

-- Auth
ALTER TABLE IF EXISTS sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;

-- Testimonials
ALTER TABLE IF EXISTS testimonials ENABLE ROW LEVEL SECURITY;

-- Visitors / analytics
ALTER TABLE IF EXISTS unique_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS visitors ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Optional: Add a policy to allow public INSERT on testimonials only
-- (if you ever call Supabase from the browser with anon key for submissions)
-- Right now you use the API with service role, so you don't need this.
-- ============================================================================
-- CREATE POLICY "Allow public to insert testimonial (pending approval)"
--   ON testimonials FOR INSERT TO anon
--   WITH CHECK (true);
-- ============================================================================
