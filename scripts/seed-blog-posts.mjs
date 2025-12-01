#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(__dirname, "../src/data/blogPosts.generated.json");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PARTY_BUS_SLUG = "party-bus-pricing-101";
const PARTY_BUS_FIELDS = [
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

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.");
  process.exit(1);
}

async function loadPosts() {
  try {
    const raw = await fs.readFile(dataPath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to read generated blog posts JSON.", error);
    process.exit(1);
  }
}

function chunk(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

async function main() {
  const posts = await loadPosts();
  const template = posts.find((post) => post.slug === PARTY_BUS_SLUG);

  if (!template) {
    console.error(`Missing template post with slug "${PARTY_BUS_SLUG}" in blogPosts.generated.json.`);
    process.exit(1);
  }

  const normalizePost = (post) => {
    if (post.slug === PARTY_BUS_SLUG) {
      return post;
    }
    const clone = { ...post };
    for (const field of PARTY_BUS_FIELDS) {
      const value = template[field];
      clone[field] = Array.isArray(value) ? [...value] : value ?? null;
    }
    return clone;
  };

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  const nowIso = new Date().toISOString();

  const payload = posts.map((post) => {
    const source = normalizePost(post);
    return {
      slug: source.slug,
      title: source.title,
      excerpt: source.excerpt,
      thumbnail_url: source.thumbnail_url,
      published_at: source.published_at || nowIso,
      content: source.content,
      created_at: source.created_at || source.published_at || nowIso,
      updated_at: nowIso,
    };
  });

  const batches = chunk(payload, 10);
  let total = 0;

  for (const batch of batches) {
    const { error } = await supabase.from("blog_posts").upsert(batch, { onConflict: "slug" });
    if (error) {
      console.error("Failed to upsert blog posts batch", error);
      process.exit(1);
    }
    total += batch.length;
  }

  console.log(`Upserted ${total} blog posts into Supabase.`);
}

main();
