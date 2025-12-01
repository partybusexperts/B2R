import Link from "next/link";
import { fetchBlogPosts } from "@/lib/blog/posts";
import { SmartImage } from "@/components/SmartImage";

const SUPABASE_URL_BASE = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const BLOG_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BLOG_BUCKET || "Blog";

const FALLBACK_IMAGES = [
  "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/22%20Passenger%20Party%20Bus/22%20Passenger%20Party%20Bus%20Interior%20Lux.png",
  "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/10%20Passenger%20White%20Chrysler%20300%20Limo/10%20Passenger%20White%20Chrysler%20300%20Limo%20Interior%20Lux.png",
  "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/26%20Passenger%20Shuttle%20Bus/26%20Passenger%20Shuttle%20Bus%20Interior%20Lux.png",
];

const fallbackAt = (index: number) => FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

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

const resolveImage = (source: string | null | undefined, fallbackIndex: number) => {
  if (source) {
    if (/^https?:/i.test(source)) {
      return source;
    }
    return buildStorageImageUrl(source);
  }

  return fallbackAt(fallbackIndex);
};

const buildTopicTags = (slug: string) => {
  return slug
    .split("-")
    .filter((segment) => segment.length > 2 && !["the", "and", "for", "with", "your", "you", "how"].includes(segment))
    .slice(0, 3)
    .map((segment) => segment.replace(/[^a-z0-9]/gi, ""))
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1));
};

export default async function BlogPage() {
  const posts = await fetchBlogPosts();

  if (!posts.length) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog</h1>
        <p className="text-slate-300">
          Blog coming soon. We’re lining up insider tips, pricing hacks, and party-planning guides for every city we serve.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-16 space-y-12">
      <header className="space-y-3 text-center md:text-left">
        <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-sky-400">Bus2Ride Insider</p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">Playbooks for Every Ride</h1>
        <p className="text-slate-300 max-w-3xl text-base md:text-lg">
          Deep dives, checklists, and operations war stories from the crews who keep party buses, limos, and shuttles running. Every article ships with
          750+ words of tactics so your next run feels cinematic, not chaotic.
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post, index) => {
          const imageSrc = resolveImage(post.thumbnail_url, index);
          const tags = buildTopicTags(post.slug);

          return (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
              <article className="relative flex h-full flex-col overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-slate-950/80 to-slate-900/80 shadow-[0_25px_80px_rgba(2,8,23,0.55)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-sky-400/60">
                <div className="relative aspect-[4/2.1] w-full overflow-hidden bg-slate-900">
                  <SmartImage
                    src={imageSrc}
                    alt={post.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" aria-hidden />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/80">
                    <span>Playbook</span>
                    <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : "New"}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                  <h2 className="text-2xl font-semibold text-white/95 group-hover:text-sky-100">{post.title}</h2>
                  {post.excerpt && <p className="mt-3 text-sm md:text-base text-slate-200 leading-relaxed">{post.excerpt}</p>}
                  {tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={`${post.slug}-${tag}`} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-slate-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto pt-6 flex items-center gap-2 text-sm font-semibold text-sky-300 group-hover:text-white">
                    <span>Read the guide</span>
                    <span aria-hidden>→</span>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
