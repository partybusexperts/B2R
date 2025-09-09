-- supabase/migrations/0004_create_content_points_and_seed_contact_hero.sql
-- Idempotent migration: create content_points table if missing and upsert a contact-hero row

-- Ensure pgcrypto is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create the table in public schema if it doesn't exist
CREATE TABLE IF NOT EXISTS public.content_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" text UNIQUE,
  page_slug text,
  title text,
  body jsonb,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Optional: ensure an index on page_slug for lookup performance
CREATE INDEX IF NOT EXISTS idx_content_points_page_slug ON public.content_points (page_slug);

-- Upsert a sensible contact-hero default row. Safe to re-run.
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'contact-hero',
  'contact',
  'Contact Us',
  jsonb_build_object(
    'subtitle', 'Fast quotes, real humans, zero spam. Call, email, or use the form below.',
    'phone_display', '(888) 535-2566',
    'phone_tel', '8885352566',
    'email', 'info@bus2ride.com',
    'primary_cta', jsonb_build_object('label','Instant Live Quote','href','/quote#instant'),
    'secondary_cta', jsonb_build_object('label','Email Us','href','mailto:info@bus2ride.com'),
    'tertiary_cta', jsonb_build_object('label','Call (888) 535-2566','href','tel:8885352566')
  ),
  jsonb_build_object(
    'gradient_from','from-blue-950',
    'gradient_via','via-blue-900',
    'gradient_to','to-black',
    'text_color','text-white',
    'wave_fill','#122a56'
  )
)
ON CONFLICT ("key") DO UPDATE SET
  page_slug = EXCLUDED.page_slug,
  title = EXCLUDED.title,
  body = EXCLUDED.body,
  metadata = EXCLUDED.metadata,
  updated_at = now();

-- Final check (optional when running interactively): select the row
-- SELECT * FROM public.content_points WHERE "key" = 'contact-hero' LIMIT 1;
