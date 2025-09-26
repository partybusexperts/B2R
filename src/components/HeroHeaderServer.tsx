// src/components/HeroHeaderServer.tsx
import { createClient } from "@supabase/supabase-js";

type HeroData = Record<string, any> | null;

export default async function HeroHeaderServer({
  pageSlug,
  fallback,
}: {
  pageSlug: string;
  fallback: Record<string, any>;
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;      // server-only (preferred)
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;     // safe fallback for reads

  // Always import the client component (it does the rendering/rotation)
  const HeroHeader = (await import("./HeroHeader")).default;

  // If envs are missing, bail to fallback (dev-friendly)
  if (!url || (!serviceKey && !anonKey)) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[HeroHeaderServer] Missing SUPABASE envs");
    }
    return <HeroHeader pageSlug={pageSlug} fallback={fallback} initialData={null} />;
  }

  const supabase = createClient(url, serviceKey ?? anonKey!);

  let initialData: HeroData = null;

  try {
    const { data, error } = await supabase
      .from("heroes1")
      .select("data")
      .eq("page_slug", pageSlug)
      .eq("is_active", true)
      .maybeSingle(); // safer than .single() when 0 rows

    if (error) {
      if (process.env.NODE_ENV !== "production") {
        console.debug("[HeroHeaderServer] Supabase error:", error.message);
      }
    } else {
      initialData = (data as any)?.data ?? null;
      if (process.env.NODE_ENV !== "production") {
        console.debug(
          "[HeroHeaderServer] fetched keys:",
          initialData ? Object.keys(initialData) : initialData
        );
      }
    }
  } catch (err: any) {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[HeroHeaderServer] fetch exception:", err?.message ?? err);
    }
  }

  // Ensure we always pass an images array (fallback if DB is empty)
  if (!initialData?.images?.length && fallback?.images?.length) {
    initialData = { ...(initialData ?? {}), images: fallback.images };
  }

  return <HeroHeader pageSlug={pageSlug} fallback={fallback} initialData={initialData} />;
}
