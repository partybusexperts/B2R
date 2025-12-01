import "server-only";

import { createClient } from "@/lib/supabase/server";
import fallbackPosts from "@/data/blogPosts.generated.json";

const supabase = createClient();

const PARTY_BUS_SLUG = "party-bus-pricing-101";
const PARTY_BUS_FIELDS: (keyof BlogPost)[] = [
  "title",
  "excerpt",
  "content",
  "thumbnail_url",
  "published_at",
  "created_at",
  "updated_at",
  "keywords",
  "introHook",
  "planningFocus",
  "logisticsFocus",
  "amenitiesFocus",
  "budgetFocus",
  "experienceFocus",
  "wordCount",
];

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  thumbnail_url?: string | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  keywords?: string[] | null;
  introHook?: string | null;
  planningFocus?: string | null;
  logisticsFocus?: string | null;
  amenitiesFocus?: string | null;
  budgetFocus?: string | null;
  experienceFocus?: string | null;
  wordCount?: number | null;
};

export type BlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
  heroImage: string | null;
  date: string;
};

const clonePartyBusTemplate = (post: BlogPost, template: BlogPost): BlogPost => {
  const clone: BlogPost = { ...post };
  for (const field of PARTY_BUS_FIELDS) {
    const value = template[field];
    const normalized = Array.isArray(value) ? [...value] : value ?? null;
    (clone as Record<string, unknown>)[field as string] = normalized;
  }
  return clone;
};

const applyPartyBusTemplate = (posts: BlogPost[]): BlogPost[] => {
  const template = posts.find((entry) => entry.slug === PARTY_BUS_SLUG);
  if (!template) {
    return posts;
  }

  return posts.map((post) => (post.slug === PARTY_BUS_SLUG ? post : clonePartyBusTemplate(post, template)));
};

const FALLBACK_POSTS: BlogPost[] = applyPartyBusTemplate(
  (fallbackPosts as BlogPost[]).sort((a, b) => {
    const aDate = a.published_at ?? a.created_at ?? "";
    const bDate = b.published_at ?? b.created_at ?? "";
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  })
);

export const toSummary = (post: BlogPost): BlogPostSummary => {
  const image = post.thumbnail_url ?? null;
  const date = post.published_at ?? post.created_at ?? new Date().toISOString();

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    image,
    heroImage: image,
    date,
  };
};

export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[blog] Failed to load blog_posts from Supabase", {
      code: (error as any).code,
      message: (error as any).message,
      details: (error as any).details,
      hint: (error as any).hint,
    });
    return FALLBACK_POSTS;
  }

  if (!data || data.length === 0) {
    return FALLBACK_POSTS;
  }

  return applyPartyBusTemplate(data as BlogPost[]);
};
