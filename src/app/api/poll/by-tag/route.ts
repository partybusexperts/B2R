import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log("[env-check]", {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20),
  serverUrl: process.env.SUPABASE_URL,
  service: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20),
});

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

const TAG_SYNONYMS: Record<string, string> = {
  weddings: "wedding",
  wedding: "wedding",
  "bachelor-parties": "bachelorette",
  "bachelorette-parties": "bachelorette",
  bachelor: "bachelorette",
  bachelorette: "bachelorette",
  parties: "party-bus",
  "party-bus": "party-bus",
};

const FALLBACK_LIMIT = 25;

type RegistryPoll = {
  id: string;
  question: string;
  options: string[];
  tags?: string[];
  active?: boolean;
  option_slugs?: string[];
  tag_name?: string;
  slug?: string;
};

let registryCache: RegistryPoll[] | null = null;

const getPollRegistry = (): RegistryPoll[] => {
  if (registryCache) return registryCache;
  try {
    const registryPath = path.join(process.cwd(), "data", "pollsRegistry.json");
    const raw = readFileSync(registryPath, "utf8");
    registryCache = JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load pollsRegistry.json fallback:", err);
    registryCache = [];
  }
  return registryCache;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "option";

const normalizeTag = (tag: string) => {
  const key = tag.toLowerCase();
  return TAG_SYNONYMS[key] ?? key;
};

const buildFallbackPolls = (tag: string) => {
  const normalized = normalizeTag(tag);
  const pool = getPollRegistry().filter((poll) => {
    if (poll?.active === false) return false;
    if (!poll?.tags || poll.tags.length === 0) return false;
    if (normalized === "all") return true;
    return poll.tags.some((t: string) => t && t.toLowerCase() === normalized);
  });

  return pool.slice(0, FALLBACK_LIMIT).map((poll) => {
    const entry = poll as RegistryPoll;

    return {
      id: entry.id,
      slug: entry.slug ?? entry.id,
      question: entry.question,
      tag_slug: normalized,
      tag_name: entry.tag_name ?? normalized,
      options: (entry.options ?? []).map((label: string, idx: number) => ({
        id: `${entry.id}__${idx}`,
        poll_id: entry.id,
        label,
        slug: entry.option_slugs?.[idx] ?? slugify(label),
        sort_order: idx,
      })),
    };
  });
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tagInput = searchParams.get("tag") ?? searchParams.get("slug");

    if (!tagInput) {
      return NextResponse.json(
        { error: "Missing 'tag' query param" },
        { status: 400 }
      );
    }

    const normalizedTag = normalizeTag(tagInput);

    const { data: pollsRaw, error: pollsError } = await supabase
      .from("v_polls_with_tags")
      .select(
        "id, slug, question, tag_slug, tag_name, show_on_polls, created_at"
      )
      .eq("tag_slug", normalizedTag)
      .eq("show_on_polls", true)
      // 🚫 hide auto-generated junk by slug and question
      .not("slug", "ilike", "%-auto-%")
      .not("slug", "ilike", "%autogen%")
      .not("question", "ilike", "auto-generated%")
      .order("created_at", { ascending: true });

    if (pollsError) {
      console.error("Error fetching polls by tag:", pollsError);
      return NextResponse.json(
        { error: "Failed to load polls" },
        { status: 500 }
      );
    }

    const curatedPolls = (pollsRaw ?? []).filter((poll) => {
      const slug = poll.slug ?? "";
      const question = poll.question ?? "";
      const hasAutogenSlug = /autogen/i.test(slug);
      const hasAutogenQuestion = /^auto-generated/i.test(question);
      return !hasAutogenSlug && !hasAutogenQuestion;
    });

    if (!curatedPolls || curatedPolls.length === 0) {
      const fallbackPolls = buildFallbackPolls(normalizedTag);
      return NextResponse.json({ polls: fallbackPolls }, { status: 200 });
    }

    const pollIds = curatedPolls.map((p) => p.id);

    const { data: optionsRaw, error: optionsError } = await supabase
      .from("v_poll_options_label")
      .select("id, poll_id, label, slug, sort_order")
      .in("poll_id", pollIds)
      .order("sort_order", { ascending: true });

    if (optionsError) {
      console.error("Error fetching poll options:", optionsError);
      return NextResponse.json(
        { error: "Failed to load poll options" },
        { status: 500 }
      );
    }

    const optionsByPollId: Record<string, any[]> = {};
    (optionsRaw ?? []).forEach((opt) => {
      if (!optionsByPollId[opt.poll_id]) {
        optionsByPollId[opt.poll_id] = [];
      }
      optionsByPollId[opt.poll_id].push(opt);
    });

    const polls = curatedPolls.map((p) => ({
      id: p.id,
      slug: p.slug,
      question: p.question,
      tag_slug: p.tag_slug,
      tag_name: p.tag_name,
      options: optionsByPollId[p.id] ?? [],
    }));

    return NextResponse.json({ polls }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error in /api/poll/by-tag:", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}
