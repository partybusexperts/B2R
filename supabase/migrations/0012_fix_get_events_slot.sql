-- Fix: replace get_events_slot to avoid ambiguous column reference (qualify id)
BEGIN;

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
    -- qualify the id column to avoid ambiguity with the RETURN TABLE variable named "id"
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

COMMIT;
