-- 0009_create_fetch_header_rpc.sql
-- Create a stable RPC to fetch a single header row for a page slug.
-- Returns the best matching content_points row: prefers hero-<slug>, then <slug>-hero, then page_slug match, ordered by updated_at desc.

CREATE OR REPLACE FUNCTION public.fetch_header(p_page_slug text)
RETURNS TABLE(key text, page_slug text, title text, body jsonb, metadata jsonb, updated_at timestamptz)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT cp."key", cp.page_slug, cp.title, cp.body, cp.metadata, cp.updated_at
  FROM public.content_points cp
  WHERE cp."key" = format('hero-%s', p_page_slug)
     OR cp."key" = format('%s-hero', p_page_slug)
     OR cp.page_slug = p_page_slug
  ORDER BY (cp."key" = format('hero-%s', p_page_slug)) DESC,
           (cp."key" = format('%s-hero', p_page_slug)) DESC,
           cp.updated_at DESC
  LIMIT 1;
END;
$$;

COMMENT ON FUNCTION public.fetch_header(text) IS 'Returns the canonical header row for a page slug from content_points';
