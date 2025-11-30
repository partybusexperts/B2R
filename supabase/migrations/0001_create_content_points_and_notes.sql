-- Migration: create content_points and content_notes
-- Run this in Supabase SQL editor or via psql against your Supabase database.

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table to hold points/items you want to "point out" and reference later
CREATE TABLE IF NOT EXISTS content_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  title text,
  page_slug text,
  body jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table for ad-hoc notes about points (comments, tasks, follow-ups)
CREATE TABLE IF NOT EXISTS content_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  point_id uuid REFERENCES content_points(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_by text,
  created_at timestamptz DEFAULT now()
);

-- Example seed (optional)
INSERT INTO content_points (key, title, body, metadata)
VALUES
('homepage-hero', 'Homepage hero content', jsonb_build_object('heading', 'Welcome to Bus2Ride', 'sub', 'Party buses and more'), jsonb_build_object('source','seed'))
ON CONFLICT (key) DO NOTHING;

INSERT INTO content_notes (point_id, note, created_by)
SELECT id, 'Seed note: review hero copy', 'automated-seed' FROM content_points WHERE key = 'homepage-hero' LIMIT 1;
