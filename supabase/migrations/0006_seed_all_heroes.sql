-- Migration: seed multiple hero rows (idempotent)
-- Writes hero JSON into content_points.body for a set of primary pages.
-- Run this in Supabase SQL editor or via psql. Safe to re-run.

-- Home
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'hero-home',
  'home',
  'Welcome to Bus2Ride',
  jsonb_build_object(
    'page_slug','home',
    'title','Welcome to Bus2Ride',
    'subtitle','Quick quotes, vetted vehicles, and dependable drivers.',
    'primary_cta', jsonb_build_object('label','Get Your Instant Quote','href','/quote#instant'),
    'secondary_cta', jsonb_build_object('label','View Fleet','href','/fleet'),
    'gradient_from','from-emerald-500',
    'gradient_via','via-emerald-600',
    'gradient_to','to-emerald-700',
    'text_color','text-white',
    'wave_fill','#114e3a'
  ),
  jsonb_build_object('source','migration-0006','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
SET page_slug = EXCLUDED.page_slug, title = EXCLUDED.title, body = EXCLUDED.body, metadata = EXCLUDED.metadata, updated_at = now();

-- Pricing
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'hero-pricing',
  'pricing',
  'Transparent Pricing',
  jsonb_build_object(
    'page_slug','pricing',
    'title','Transparent Pricing',
    'subtitle','No hidden fees. Clear, all-inclusive rates for every trip.',
    'primary_cta', jsonb_build_object('label','Get Instant Quote','href','/quote'),
    'secondary_cta', jsonb_build_object('label','View Fleet','href','/fleet'),
    'gradient_from','from-sky-400',
    'gradient_via','via-blue-600',
    'gradient_to','to-indigo-900',
    'text_color','text-white',
    'wave_fill','#122a56'
  ),
  jsonb_build_object('source','migration-0006','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
SET page_slug = EXCLUDED.page_slug, title = EXCLUDED.title, body = EXCLUDED.body, metadata = EXCLUDED.metadata, updated_at = now();

-- Events
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'hero-events',
  'events',
  'Events & Occasions',
  jsonb_build_object(
    'page_slug','events',
    'title','Events & Occasions',
    'subtitle','Weddings, proms, concerts, game days & more—jump to the one you need.',
    'primary_cta', jsonb_build_object('label','Instant Quote','href','/quote#instant'),
    'secondary_cta', jsonb_build_object('label','View Fleet','href','/fleet'),
    'gradient_from','from-sky-400',
    'gradient_via','via-blue-600',
    'gradient_to','to-indigo-900',
    'text_color','text-white',
    'wave_fill','#122a56'
  ),
  jsonb_build_object('source','migration-0006','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
SET page_slug = EXCLUDED.page_slug, title = EXCLUDED.title, body = EXCLUDED.body, metadata = EXCLUDED.metadata, updated_at = now();

-- Party Buses
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'hero-party-buses',
  'party-buses',
  'Pick Your Party Bus',
  jsonb_build_object(
    'page_slug','party-buses',
    'title','Pick Your Party Bus',
    'subtitle','From minis to mega buses—clean, comfy, and ready for your group.',
    'primary_cta', jsonb_build_object('label','Instant Quote','href','/quote#instant'),
    'secondary_cta', jsonb_build_object('label','Explore Fleet','href','/fleet'),
    'gradient_from','from-[#122a56]',
    'gradient_via','via-[#0f2148]',
    'gradient_to','to-[#0b1736]',
    'text_color','text-white',
    'wave_fill','#0b1832'
  ),
  jsonb_build_object('source','migration-0006','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
SET page_slug = EXCLUDED.page_slug, title = EXCLUDED.title, body = EXCLUDED.body, metadata = EXCLUDED.metadata, updated_at = now();

-- Contact (ensure it matches the same shape)
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'hero-contact',
  'contact',
  'Contact Us',
  jsonb_build_object(
    'page_slug','contact',
    'title','Contact Us',
    'subtitle','Fast quotes, real humans, zero spam. Call, email, or use the form below.',
    'phone_display','(888) 535-2566',
    'phone_tel','8885352566',
    'email','info@bus2ride.com',
    'primary_cta', jsonb_build_object('label','Get Instant Quote','href','/quote#instant'),
    'secondary_cta', jsonb_build_object('label','View Fleet','href','/fleet'),
    'tertiary_cta', jsonb_build_object('label','Contact Us','href','mailto:info@bus2ride.com'),
    'gradient_from','from-sky-400',
    'gradient_via','via-blue-600',
    'gradient_to','to-indigo-900',
    'text_color','text-white',
    'wave_fill','#122a56'
  ),
  jsonb_build_object('source','migration-0006','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
SET page_slug = EXCLUDED.page_slug, title = EXCLUDED.title, body = EXCLUDED.body, metadata = EXCLUDED.metadata, updated_at = now();

-- Example vehicle detail (repeat pattern for each vehicle you want to seed)
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'hero-vehicle-20-passenger-party-bus',
  'vehicle:20-passenger-party-bus',
  '20 Passenger Party Bus',
  jsonb_build_object(
    'page_slug','vehicle:20-passenger-party-bus',
    'title','20 Passenger Party Bus',
    'subtitle','Best seller for medium groups—clean, comfortable, and well-equipped.',
    'primary_cta', jsonb_build_object('label','Get Quote for 20p','href','/quote?vehicle=20-passenger-party-bus'),
    'gradient_from','from-[#122a56]',
    'text_color','text-white'
  ),
  jsonb_build_object('source','migration-0006','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
SET page_slug = EXCLUDED.page_slug, title = EXCLUDED.title, body = EXCLUDED.body, metadata = EXCLUDED.metadata, updated_at = now();

-- Example location page
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'hero-location-anchorage-alaska',
  'location:anchorage-alaska',
  'Anchorage Charter Bus & Limo Overview',
  jsonb_build_object(
    'page_slug','location:anchorage-alaska',
    'title','Anchorage Charter Bus & Limo Overview',
    'subtitle','From Anchorage airport transfers to glacier tours—reliable local service.',
    'primary_cta', jsonb_build_object('label','Get Local Quote','href','/quote?city=anchorage-alaska'),
    'gradient_from','from-[#0f1f46]',
    'text_color','text-white'
  ),
  jsonb_build_object('source','migration-0006','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
SET page_slug = EXCLUDED.page_slug, title = EXCLUDED.title, body = EXCLUDED.body, metadata = EXCLUDED.metadata, updated_at = now();

-- Example blog post hero
INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'hero-blog-wedding-transportation-guide',
  'blog:wedding-transportation-guide-limo-vs-party-bus-vs-shuttle',
  'Wedding Transportation Guide',
  jsonb_build_object(
    'page_slug','blog:wedding-transportation-guide-limo-vs-party-bus-vs-shuttle',
    'title','Wedding Transportation Guide: Limo vs. Party Bus vs. Shuttle',
    'subtitle','Choose the right vehicle for photos, timelines, and guest comfort.',
    'gradient_from','from-indigo-800',
    'text_color','text-white'
  ),
  jsonb_build_object('source','migration-0006','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
SET page_slug = EXCLUDED.page_slug, title = EXCLUDED.title, body = EXCLUDED.body, metadata = EXCLUDED.metadata, updated_at = now();

-- Optional: quick verification select
-- SELECT "key", page_slug, body->>'title' as title FROM public.content_points WHERE "key" LIKE 'hero-%' ORDER BY "key";
