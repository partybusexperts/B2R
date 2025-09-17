-- Migration: add priority/weight columns and create get_events_slot RPC
BEGIN;

-- 1) Add columns to support priority/weight
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS priority integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS weight integer DEFAULT 1;

-- 2) Indexes to help queries
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events (slug);
CREATE INDEX IF NOT EXISTS idx_events_priority ON public.events (priority DESC);

-- 3) Create RPC that returns a slot of events: guarantees listed slugs first, then random fill
CREATE OR REPLACE FUNCTION public.get_events_slot(p_limit integer DEFAULT 6, p_guarantee text[] DEFAULT ARRAY[]::text[])
RETURNS TABLE(
  id uuid,
  name text,
  slug text,
  description text,
  href text,
  priority integer,
  weight integer,
  created_at timestamp with time zone
) AS $$
DECLARE
  guaranteed_ids uuid[];
  needed integer;
BEGIN
  -- select guaranteed rows (in priority order) up to the limit
  IF array_length(p_guarantee, 1) IS NOT NULL AND array_length(p_guarantee,1) > 0 THEN
    RETURN QUERY
      SELECT e.id, e.name, e.slug, e.description, e.href, e.priority, e.weight, e.created_at
      FROM public.events e
      WHERE e.slug = ANY(p_guarantee)
      ORDER BY e.priority DESC
      LIMIT p_limit;
  -- qualify the id column (avoid ambiguous reference with the function OUT variable named "id")
  guaranteed_ids := ARRAY(SELECT e2.id FROM public.events e2 WHERE e2.slug = ANY(p_guarantee) ORDER BY e2.priority DESC LIMIT p_limit);
  ELSE
    guaranteed_ids := ARRAY[]::uuid[];
  END IF;

  needed := p_limit - COALESCE(array_length(guaranteed_ids,1), 0);
  IF needed <= 0 THEN
    RETURN;
  END IF;

  -- fill remaining slots with random selection excluding guaranteed ids
  RETURN QUERY
    SELECT e.id, e.name, e.slug, e.description, e.href, e.priority, e.weight, e.created_at
    FROM public.events e
    WHERE (COALESCE(array_length(guaranteed_ids,1),0) = 0 OR e.id <> ALL(guaranteed_ids))
    ORDER BY random()
    LIMIT needed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4) Optional: set higher priority/weight for commonly-important events
UPDATE public.events SET priority = 10, weight = 5 WHERE slug IN ('weddings','proms','bachelor-bachelorette','bachelorette','birthday-parties') AND (priority IS DISTINCT FROM 10 OR weight IS DISTINCT FROM 5);

COMMIT;
