// src/components/HeroHeaderServer.tsx
import React from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type HeroData = Record<string, unknown> | null;
type GenericSupabaseClient = SupabaseClient<any, any, any>;

const logDebug = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[HeroHeaderServer]", ...args);
  }
};

export default async function HeroHeaderServer({
  pageSlug,
  fallback,
}: {
  pageSlug: string;
  fallback: Record<string, unknown>;
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const HeroHeader = (await import("./HeroHeader")).default;

  if (!url || (!serviceKey && !anonKey)) {
    logDebug("Missing Supabase envs; rendering fallback hero for", pageSlug);
    return <HeroHeader pageSlug={pageSlug} fallback={fallback} initialData={null} />;
  }

  const supabase = createClient(url, serviceKey ?? anonKey!, {
    auth: { persistSession: false },
  });

  const data =
    (await fetchHomepageHero(supabase, pageSlug)) ??
    (await fetchLegacyHero(supabase, pageSlug));

  const mergedData = ensureImages(data, fallback);

  return <HeroHeader pageSlug={pageSlug} fallback={fallback} initialData={mergedData} />;
}

async function fetchHomepageHero(supabase: GenericSupabaseClient, pageSlug: string): Promise<HeroData> {
  try {
    const { data, error } = await supabase
      .from("homepage_hero")
      .select("*")
      .eq("slug", pageSlug)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      logDebug("homepage_hero error", error.message);
      return null;
    }

    return normalizeHeroRow(data, pageSlug);
  } catch (err: unknown) {
    logDebug("homepage_hero fetch failed", err);
    return null;
  }
}

async function fetchLegacyHero(supabase: GenericSupabaseClient, pageSlug: string): Promise<HeroData> {
  try {
    const { data, error } = await supabase
      .from("heroes1")
      .select("data")
      .eq("page_slug", pageSlug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      logDebug("heroes1 error", error.message);
      return null;
    }

    const payload = (data as { data?: unknown } | null)?.data;
    return toObject(payload) ?? null;
  } catch (err: unknown) {
    logDebug("heroes1 fetch failed", err);
    return null;
  }
}

function ensureImages(initialData: HeroData, fallback: Record<string, unknown>): HeroData {
  const initialImages = Array.isArray((initialData as any)?.images) ? (initialData as any).images : [];
  const fallbackImages = Array.isArray((fallback as any)?.images) ? (fallback as any).images : [];
  if (!initialImages.length && fallbackImages.length) {
    return { ...(initialData ?? {}), images: fallbackImages };
  }
  return initialData;
}

function normalizeHeroRow(row: Record<string, unknown> | null, pageSlug: string): HeroData {
  if (!row) return null;

  const candidate =
    toObject(row.data) ??
    toObject(row.body) ??
    toObject(row.hero) ??
    toObject(row.payload) ??
    toObject(row.value) ??
    (typeof row === "object" ? (row as Record<string, unknown>) : null);

  if (!candidate) return null;

  const normalized: Record<string, unknown> = { ...candidate };
  normalized.page_slug = normalized.page_slug ?? row.slug ?? row.page_slug ?? pageSlug;

  const bucket = pickString(normalized.bucket) ?? pickString(row.storage_bucket) ?? pickString(row.bucket);
  if (bucket) normalized.bucket = bucket;

  const imageUrls = pickStringArray(normalized.images) || pickStringArray(row.image_urls);
  if (imageUrls.length) normalized.images = imageUrls;

  const imageKeys = pickStringArray(normalized.image_keys) || pickStringArray(row.image_keys);
  if (imageKeys.length) normalized.image_keys = imageKeys;

  const ctas = normalizeCtas(normalized.ctas ?? row.ctas);
  if (ctas.length) normalized.ctas = ctas;

  normalized.primary_cta = toObject(normalized.primary_cta ?? row.primary_cta) ?? normalized.primary_cta;
  normalized.secondary_cta = toObject(normalized.secondary_cta ?? row.secondary_cta) ?? normalized.secondary_cta;
  normalized.tertiary_cta = toObject(normalized.tertiary_cta ?? row.tertiary_cta) ?? normalized.tertiary_cta;

  if (normalized.autoplay_ms == null && typeof row.autoplay_ms === "number") {
    normalized.autoplay_ms = row.autoplay_ms;
  }
  if (normalized.darken == null && typeof row.darken === "number") {
    normalized.darken = row.darken;
  }

  return normalized;
}

function toObject(value: unknown): Record<string, unknown> | null {
  if (!value) return null;
  if (typeof value === "object") return value as Record<string, unknown>;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }
  return null;
}

function pickString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function pickStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string" && v.length > 0);
  }
  if (typeof value === "string" && value.length) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((v): v is string => typeof v === "string" && v.length > 0);
      }
    } catch {
      const trimmed = value.trim().replace(/^\{|\}$/g, "");
      if (trimmed.includes(",")) {
        return trimmed
          .split(",")
          .map((s) => s.replace(/(^"|"$)/g, "").trim())
          .filter(Boolean);
      }
    }
    return [value];
  }
  return [];
}

function normalizeCtas(value: unknown): Array<{ label: string; href: string; style?: string }> {
  const maybeObject = Array.isArray(value) ? value : toObject(value);
  const payload = Array.isArray(maybeObject)
    ? maybeObject
    : Array.isArray((maybeObject as { items?: unknown })?.items)
    ? ((maybeObject as { items?: unknown[] }).items as unknown[])
    : [];
  if (!payload.length) return [];
  return payload
    .map((entry) => {
      const obj = toObject(entry);
      if (!obj || typeof obj.label !== "string" || typeof obj.href !== "string") return null;
      const style = typeof obj.style === "string" ? obj.style : undefined;
      return style ? { label: obj.label, href: obj.href, style } : { label: obj.label, href: obj.href };
    })
    .filter(Boolean) as Array<{ label: string; href: string; style?: string }>;
}
