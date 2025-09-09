-- Migration: add page_slug column to content_points and backfill from body->>page_slug when present

ALTER TABLE content_points
  ADD COLUMN IF NOT EXISTS page_slug text;

-- Backfill existing rows where body contains page_slug
UPDATE content_points
SET page_slug = (body->> 'page_slug')
WHERE page_slug IS NULL AND (body->> 'page_slug') IS NOT NULL;

-- Optional: create an index for faster lookup
CREATE INDEX IF NOT EXISTS idx_content_points_page_slug ON content_points (page_slug);
