import { notFound } from "next/navigation";
import { fetchBlogPosts } from "@/lib/blog/posts";
import { SmartImage } from "@/components/SmartImage";

const SUPABASE_URL_BASE = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const BLOG_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BLOG_BUCKET || "Blog";

const FALLBACK_IMAGES = [
  "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/22%20Passenger%20Party%20Bus/22%20Passenger%20Party%20Bus%20Interior%20Lux.png",
  "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/10%20Passenger%20White%20Chrysler%20300%20Limo/10%20Passenger%20White%20Chrysler%20300%20Limo%20Interior%20Lux.png",
  "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/26%20Passenger%20Shuttle%20Bus/26%20Passenger%20Shuttle%20Bus%20Interior%20Lux.png",
];

const buildStorageImageUrl = (source: string) => {
  const encoded = source
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  if (SUPABASE_URL_BASE) {
    return `${SUPABASE_URL_BASE}/storage/v1/object/public/${BLOG_BUCKET}/${encoded}`;
  }

  return `/images/blog/${encoded}`;
};

const resolveImage = (source: string | null | undefined) => {
  if (source) {
    if (/^https?:/i.test(source)) {
      return source;
    }
    return buildStorageImageUrl(source);
  }

  return FALLBACK_IMAGES[0];
};

const buildKeywordChips = (slug: string, keywords?: string[] | null) => {
  if (keywords && keywords.length) {
    return keywords;
  }

  return slug
    .split("-")
    .filter((segment) => segment.length > 2 && !["the", "and", "for", "with", "your", "you", "how"].includes(segment))
    .slice(0, 3)
    .map((segment) => segment.replace(/[^a-z0-9]/gi, ""))
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1));
};

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const posts = await fetchBlogPosts();
  const post = posts.find((entry) => entry.slug === slug);

  if (!post) {
    return notFound();
  }

  const heroImage = resolveImage(post.thumbnail_url);

  const paragraphs = post.content
    ? post.content
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean)
    : [];

  const wordCount = post.wordCount ?? paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(4, Math.round(wordCount / 200));
  const chips = buildKeywordChips(post.slug, post.keywords);

  const highlightCards = [
    { label: "Planning Focus", body: post.planningFocus },
    { label: "Logistics Anchor", body: post.logisticsFocus },
    { label: "Cabin Play", body: post.amenitiesFocus },
    { label: "Budget Cue", body: post.budgetFocus },
    { label: "Experience Beat", body: post.experienceFocus },
  ].filter((card) => Boolean(card.body));

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-slate-950/70 shadow-[0_45px_120px_rgba(2,6,23,0.6)]">
        <SmartImage src={heroImage} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-50" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-900/30" aria-hidden />
        <div className="relative z-10 space-y-6 px-6 py-10 md:px-10">
          <p className="text-xs uppercase tracking-[0.35em] text-sky-300">Bus2Ride Playbook</p>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">{post.title}</h1>
            {post.excerpt && <p className="text-lg text-slate-100 max-w-3xl">{post.excerpt}</p>}
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-200">
            {post.published_at && (
              <div className="rounded-full border border-white/20 px-4 py-1">{new Date(post.published_at).toLocaleDateString()}</div>
            )}
            <div className="rounded-full border border-white/20 px-4 py-1">{wordCount} words</div>
            <div className="rounded-full border border-white/20 px-4 py-1">~{readMinutes} min read</div>
            {chips.map((chip) => (
              <div key={`${post.slug}-${chip}`} className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                {chip}
              </div>
            ))}
          </div>
        </div>
      </section>

      {post.introHook && <p className="text-lg text-slate-200 leading-relaxed">{post.introHook}</p>}

      {highlightCards.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2">
          {highlightCards.map((card) => (
            <div key={card.label} className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-[0_25px_60px_rgba(2,8,23,0.35)]">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-300">{card.label}</p>
              <p className="mt-3 text-base text-slate-50 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </section>
      )}

      {paragraphs.length > 0 && (
        <section className="space-y-6 text-base leading-relaxed text-slate-200">
          {paragraphs.map((paragraph, index) => (
            <p key={`${post.slug}-paragraph-${index}`}>{paragraph}</p>
          ))}
        </section>
      )}

      <section className="rounded-[32px] border border-sky-500/30 bg-slate-950/70 p-8 text-center shadow-[0_35px_80px_rgba(4,11,35,0.5)]">
        <h2 className="text-2xl font-semibold text-white">Need this playbook in your city?</h2>
        <p className="mt-3 text-slate-200">
          Email <a href="mailto:info@bus2ride.com" className="text-sky-300">info@bus2ride.com</a> or call <a href="tel:8885352566" className="text-sky-300">(888) 535-2566</a> and we will customize the
          exact fleet mix, staffing model, and amenity stack for your date.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a href="mailto:info@bus2ride.com" className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900">
            Email the concierge →
          </a>
          <a href="tel:8885352566" className="rounded-full border border-white/30 px-6 py-2 text-sm font-semibold text-white">
            Call (888) 535-2566
          </a>
        </div>
      </section>
    </main>
  );
}
