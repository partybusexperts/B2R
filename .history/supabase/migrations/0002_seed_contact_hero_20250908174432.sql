-- Migration: seed contact hero content_point
-- Run this in Supabase SQL editor or via psql against your Supabase database.

INSERT INTO content_points (key, title, page_slug, body, metadata)
VALUES (
  'contact-hero',
  'Contact page hero',
  'contact',
  jsonb_build_object(
    'page_slug', 'contact',
    'title', 'Contact Us',
    'subtitle', 'Fast quotes, real humans, zero spam. Call, email, or use the form below.',
    'phone_display', '(888) 535-2566',
    'phone_tel', '8885352566',
    'email', 'info@bus2ride.com',
    'primary_cta', jsonb_build_object('label','Instant Live Quote','href','/quote#instant'),
    'secondary_cta', jsonb_build_object('label','Email Us','href','mailto:info@bus2ride.com'),
    'tertiary_cta', jsonb_build_object('label','Call (888) 535-2566','href','tel:8885352566'),
    'gradient_from', 'from-blue-950',
    'gradient_via', 'via-blue-900',
    'gradient_to', 'to-black',
    'text_color', 'text-white',
    'wave_fill', '#122a56'
  ),
  jsonb_build_object('source','seed')
)
ON CONFLICT (key) DO UPDATE
SET title = EXCLUDED.title,
    page_slug = EXCLUDED.page_slug,
    body = EXCLUDED.body,
    metadata = EXCLUDED.metadata,
    updated_at = now();
