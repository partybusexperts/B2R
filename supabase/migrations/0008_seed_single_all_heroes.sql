-- Single idempotent SQL to normalize hero sections
-- - Removes heroes for party-buses, limousines, coach-buses
-- - Upserts a Pricing-style hero for all other primary pages
-- Safe to run multiple times.

-- 0008_seed_single_all_heroes.sql
-- Single idempotent SQL to normalize hero sections
-- - Removes heroes for party-buses, limousines, coach-buses
-- - Upserts a Pricing-style hero for all other primary pages
-- Safe to run multiple times.

/* 1) Ensure table exists */
DO $$
BEGIN
  IF to_regclass('public.content_points') IS NULL THEN
    RAISE EXCEPTION 'Table public.content_points does not exist. Create it first or run migration that creates it.';
  END IF;
END$$;

/* 2) Ensure `body` and `metadata` columns exist. If `data` exists, copy to `body` for compatibility. */
ALTER TABLE public.content_points ADD COLUMN IF NOT EXISTS body jsonb;
ALTER TABLE public.content_points ADD COLUMN IF NOT EXISTS metadata jsonb;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'content_points' AND column_name = 'data'
  ) THEN
    -- Only run the update if the data column exists; avoid errors when it's absent.
    UPDATE public.content_points
    SET body = data
    WHERE data IS NOT NULL AND (body IS NULL);
    RAISE NOTICE 'Copied data -> body for existing rows.';
  ELSE
    RAISE NOTICE 'No data column found; body column ensured.';
  END IF;
END$$;

/* 3) Ensure unique index on "key" so ON CONFLICT works */
CREATE UNIQUE INDEX IF NOT EXISTS content_points_key_unique ON public.content_points("key");

/* 4) Remove explicit heroes for excluded vehicle pages */
DELETE FROM public.content_points
WHERE "key" IN ('hero-party-buses', 'hero-limousines', 'hero-coach-buses');

/* 5) Upsert standardized heroes (Pricing-style) */

-- Home
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'hero-home', 'home', 'Welcome to Bus2Ride',
  jsonb_build_object(
    'page_slug','home',
    'title','Welcome to Bus2Ride',
    'subtitle','Quick quotes, vetted vehicles, and dependable drivers.',
    'primary_cta', jsonb_build_object('label','Get Your Instant Quote','href','/quote#instant'),
    'secondary_cta', jsonb_build_object('label','View Fleet','href','/fleet'),
    'gradient_from','from-sky-400', 'gradient_via','via-blue-600', 'gradient_to','to-indigo-900',
    'text_color','text-white', 'wave_fill','#122a56'
  ), jsonb_build_object('source','migration-0008','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
  SET page_slug = EXCLUDED.page_slug,
      title = EXCLUDED.title,
      body = EXCLUDED.body,
      metadata = EXCLUDED.metadata,
      updated_at = now();

-- Pricing
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'hero-pricing', 'pricing', 'Transparent Pricing',
  jsonb_build_object(
    'page_slug','pricing',
    'title','Transparent Pricing',
    'subtitle','No hidden fees. Clear, all-inclusive rates for every trip.',
    'primary_cta', jsonb_build_object('label','Get Instant Quote','href','/quote'),
    'secondary_cta', jsonb_build_object('label','View Fleet','href','/fleet'),
    'gradient_from','from-sky-400', 'gradient_via','via-blue-600', 'gradient_to','to-indigo-900',
    'text_color','text-white', 'wave_fill','#122a56'
  ), jsonb_build_object('source','migration-0008','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
  SET page_slug = EXCLUDED.page_slug,
      title = EXCLUDED.title,
      body = EXCLUDED.body,
      metadata = EXCLUDED.metadata,
      updated_at = now();

-- Events
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'hero-events', 'events', 'Events & Occasions',
  jsonb_build_object(
    'page_slug','events',
    'title','Events & Occasions',
    'subtitle','Weddings, proms, concerts, game days & more—jump to the one you need.',
    'primary_cta', jsonb_build_object('label','Instant Quote','href','/quote#instant'),
    'secondary_cta', jsonb_build_object('label','View Fleet','href','/fleet'),
    'gradient_from','from-sky-400', 'gradient_via','via-blue-600', 'gradient_to','to-indigo-900',
    'text_color','text-white', 'wave_fill','#122a56'
  ), jsonb_build_object('source','migration-0008','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
  SET page_slug = EXCLUDED.page_slug,
      title = EXCLUDED.title,
      body = EXCLUDED.body,
      metadata = EXCLUDED.metadata,
      updated_at = now();

-- Contact
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'hero-contact', 'contact', 'Contact Us',
  jsonb_build_object(
    'page_slug','contact',
    'title','Contact Us',
    -- make contact hero structure match pricing hero shape while keeping contact fields
    'subtitle','Fast quotes, real humans, zero spam. Call, email, or use the form below.',
    'phone_display','(888) 535-2566',
    'phone_tel','8885352566',
    'email','info@bus2ride.com',
    'primary_cta', jsonb_build_object('label','Get Instant Quote','href','/quote#instant'),
    'secondary_cta', jsonb_build_object('label','View Fleet','href','/fleet'),
    -- pricing-style gradients and colors
    'gradient_from','from-sky-400', 'gradient_via','via-blue-600', 'gradient_to','to-indigo-900',
    'text_color','text-white', 'wave_fill','#122a56'
  ), jsonb_build_object('source','migration-0008','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
  SET page_slug = EXCLUDED.page_slug,
      title = EXCLUDED.title,
      body = EXCLUDED.body,
      metadata = EXCLUDED.metadata,
      updated_at = now();

-- Blog list
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'hero-blog', 'blog', 'From the Bus2Ride Blog',
  jsonb_build_object(
    'page_slug','blog',
    'title','From the Bus2Ride Blog',
    'subtitle','Guides, tips, and real stories to help you plan the best group trips.',
    'primary_cta', jsonb_build_object('label','Browse Articles','href','/blog'),
    'secondary_cta', jsonb_build_object('label','Get Quote','href','/quote'),
    'gradient_from','from-sky-400', 'gradient_via','via-blue-600', 'gradient_to','to-indigo-900',
    'text_color','text-white', 'wave_fill','#122a56'
  ), jsonb_build_object('source','migration-0008','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
  SET page_slug = EXCLUDED.page_slug,
      title = EXCLUDED.title,
      body = EXCLUDED.body,
      metadata = EXCLUDED.metadata,
      updated_at = now();

-- Locations
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'hero-locations', 'locations', 'Find Services Near You',
  jsonb_build_object(
    'page_slug','locations',
    'title','Find Services Near You',
    'subtitle','State and city-level overviews, pricing patterns, and local tips.',
    'primary_cta', jsonb_build_object('label','Search Locations','href','/locations'),
    'secondary_cta', jsonb_build_object('label','Get Instant Quote','href','/quote'),
    'gradient_from','from-sky-400', 'gradient_via','via-blue-600', 'gradient_to','to-indigo-900',
    'text_color','text-white', 'wave_fill','#122a56'
  ), jsonb_build_object('source','migration-0008','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
  SET page_slug = EXCLUDED.page_slug,
      title = EXCLUDED.title,
      body = EXCLUDED.body,
      metadata = EXCLUDED.metadata,
      updated_at = now();

-- Tools
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'hero-tools', 'tools', 'Planner Tools',
  jsonb_build_object(
    'page_slug','tools',
    'title','Planner Tools',
    'subtitle','Calculators and helpers to choose the right vehicle and plan your trip.',
    'primary_cta', jsonb_build_object('label','Open Tools','href','/tools'),
    'secondary_cta', jsonb_build_object('label','Get Quote','href','/quote'),
    'gradient_from','from-sky-400', 'gradient_via','via-blue-600', 'gradient_to','to-indigo-900',
    'text_color','text-white', 'wave_fill','#122a56'
  ), jsonb_build_object('source','migration-0008','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
  SET page_slug = EXCLUDED.page_slug,
      title = EXCLUDED.title,
      body = EXCLUDED.body,
      metadata = EXCLUDED.metadata,
      updated_at = now();

-- Reviews
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'hero-reviews', 'reviews', 'Customer Reviews',
  jsonb_build_object(
    'page_slug','reviews',
    'title','Customer Reviews',
    'subtitle','Real feedback from groups who rode with us.',
    'primary_cta', jsonb_build_object('label','Read Reviews','href','/reviews'),
    'secondary_cta', jsonb_build_object('label','Leave a Review','href','/reviews#leave'),
    'gradient_from','from-sky-400', 'gradient_via','via-blue-600', 'gradient_to','to-indigo-900',
    'text_color','text-white', 'wave_fill','#122a56'
  ), jsonb_build_object('source','migration-0008','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
  SET page_slug = EXCLUDED.page_slug,
      title = EXCLUDED.title,
      body = EXCLUDED.body,
      metadata = EXCLUDED.metadata,
      updated_at = now();

-- Polls
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'hero-polls', 'polls', 'Community Polls',
  jsonb_build_object(
    'page_slug','polls',
    'title','Community Polls',
    'subtitle','See what the community prefers and weigh in.',
    'primary_cta', jsonb_build_object('label','View Polls','href','/polls'),
    'secondary_cta', jsonb_build_object('label','Get Quote','href','/quote'),
    'gradient_from','from-sky-400', 'gradient_via','via-blue-600', 'gradient_to','to-indigo-900',
    'text_color','text-white', 'wave_fill','#122a56'
  ), jsonb_build_object('source','migration-0008','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
  SET page_slug = EXCLUDED.page_slug,
      title = EXCLUDED.title,
      body = EXCLUDED.body,
      metadata = EXCLUDED.metadata,
      updated_at = now();

-- Industry secrets
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'hero-industry-secrets', 'industry-secrets', 'Insider Tips & Pricing',
  jsonb_build_object(
    'page_slug','industry-secrets',
    'title','Insider Tips & Pricing',
    'subtitle','Expert tips to save on group transport and avoid common pitfalls.',
    'primary_cta', jsonb_build_object('label','Read Tips','href','/industry-secrets'),
    'secondary_cta', jsonb_build_object('label','Get Quote','href','/quote'),
    'gradient_from','from-sky-400', 'gradient_via','via-blue-600', 'gradient_to','to-indigo-900',
    'text_color','text-white', 'wave_fill','#122a56'
  ), jsonb_build_object('source','migration-0008','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
  SET page_slug = EXCLUDED.page_slug,
      title = EXCLUDED.title,
      body = EXCLUDED.body,
      metadata = EXCLUDED.metadata,
      updated_at = now();

/* 6) Verification: list hero rows */
SELECT "key", page_slug, body->>'title' as title
FROM public.content_points
WHERE "key" LIKE 'hero-%'
ORDER BY "key";
