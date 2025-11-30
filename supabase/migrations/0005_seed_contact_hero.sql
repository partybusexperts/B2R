-- Migration: upsert contact hero (idempotent)
-- This migration writes the contact hero into content_points.body (jsonb) and metadata (jsonb).
-- Paste or run in Supabase SQL editor, or apply via your deployment tooling.

INSERT INTO public.content_points ("key", page_slug, title, body, metadata)
VALUES (
  'contact-hero',
  'contact',
  'Contact Us',
  jsonb_build_object(
    'page_slug', 'contact',
    'title', 'Contact Us',
    'subtitle', 'Fast quotes, real humans, zero spam. Call, email, or use the form below.',
    'phone_display', '(888) 535-2566',
    'phone_tel', '8885352566',
    'email', 'info@bus2ride.com',
    'primary_cta', jsonb_build_object('label','Get Instant Quote','href','/quote#instant'),
    'secondary_cta', jsonb_build_object('label','View Fleet','href','/fleet'),
    'tertiary_cta', jsonb_build_object('label','Contact Us','href','mailto:info@bus2ride.com'),
    'gradient_from', 'from-sky-400',
    'gradient_via', 'via-blue-600',
    'gradient_to', 'to-indigo-900',
    'text_color', 'text-white',
    'wave_fill', '#122a56'
  ),
  jsonb_build_object('source','migration-0005','seeded_at', now())
)
ON CONFLICT ("key") DO UPDATE
SET
  page_slug = EXCLUDED.page_slug,
  title = EXCLUDED.title,
  body = EXCLUDED.body,
  metadata = EXCLUDED.metadata,
  updated_at = now();

-- Optional verification
-- SELECT "key", page_slug, title, body->>'title' as hero_title FROM public.content_points WHERE "key" = 'contact-hero';
