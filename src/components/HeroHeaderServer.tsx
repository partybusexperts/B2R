// src/components/HeroHeaderServer.tsx
import React from "react";

export default async function HeroHeaderServer({
  pageSlug,
  fallback,
}: {
  pageSlug: string;
  fallback: any;
}) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const url =
    `${base}/rest/v1/heroes1?select=data` +
    `&page_slug=eq.${encodeURIComponent(pageSlug)}` +
    `&is_active=eq.true`;

  let initialData: any = null;
  try {
    const res = await fetch(url, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 60 }, // SSR + light caching
    });
    if (res.ok) {
      const rows = (await res.json()) as Array<{ data: any }>;
      initialData = rows?.[0]?.data ?? null;
    }
  } catch {}

  const HeroHeader = (await import("./HeroHeader")).default;
  return <HeroHeader pageSlug={pageSlug} fallback={fallback} initialData={initialData} />;
}
