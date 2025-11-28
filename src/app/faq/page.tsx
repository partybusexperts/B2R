import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getFaqsForPage } from "@/lib/server/faqs";
import FaqSearchClient from "@/components/faqs/FaqSearchClient";
import FaqSectionList from "@/components/faqs/FaqSectionList";
import { getFeaturedReviews } from "@/lib/server/reviews";
import Stars from "@/components/reviews/Stars";

const FAQ_GROUPS = [
  { slug: "home", title: "Homepage" },
  { slug: "party-buses", title: "Party Bus Fleet" },
  { slug: "limousines", title: "Limousine Fleet" },
  { slug: "coach-buses", title: "Coach Bus Fleet" },
  { slug: "events", title: "Events" },
  { slug: "pricing", title: "Pricing" },
  { slug: "locations", title: "Locations" },
  { slug: "polls", title: "Polls" },
  { slug: "blog", title: "Blog" },
  { slug: "tools", title: "Tools" },
  { slug: "industry-secrets", title: "Industry Secrets" },
  { slug: "poll-results", title: "Poll Results" },
  { slug: "reviews", title: "Reviews" },
  { slug: "contact", title: "Contact" },
];

export const metadata: Metadata = {
  title: "Bus2Ride FAQs",
  description: "All of the most common Bus2Ride questions in one place—spanning booking, pricing, locations, polls, reviews, and more.",
};

const GRADIENTS = [
  "from-[#141f39] via-[#0c1425] to-[#050910]",
  "from-[#1d1c3f] via-[#11132e] to-[#060812]",
  "from-[#142436] via-[#0d1829] to-[#050b14]",
  "from-[#17142f] via-[#0e1023] to-[#050713]",
];

const SECTION_INITIAL = 4;
const SECTION_STEP = 4;

export default async function FaqPage() {
  const sectionsPromise = Promise.all(
    FAQ_GROUPS.map(async (group) => ({
      ...group,
      faqs: await getFaqsForPage(group.slug, 200),
    }))
  );

  const [sections, featuredReviews] = await Promise.all([
    sectionsPromise,
    getFeaturedReviews(6).catch(() => []),
  ]);

  const hasFaqs = sections.some((section) => section.faqs.length);
  const totalFaqs = sections.reduce((sum, section) => sum + section.faqs.length, 0);
  const activeSections = sections.filter((section) => section.faqs.length > 0);
  const topSection = activeSections.reduce((prev, curr) => (curr.faqs.length > (prev?.faqs.length ?? 0) ? curr : prev), activeSections[0]);
  const searchableFaqs = sections.flatMap((section) =>
    section.faqs.map((faq) => ({
      ...faq,
      question: faq.question,
      answer: faq.answer,
      page_slug: faq.page_slug,
      sort_order: faq.sort_order,
      categoryTitle: section.title,
    }))
  );

  const metrics = [
    { label: "Total answers", value: totalFaqs.toLocaleString() },
    { label: "Categories", value: FAQ_GROUPS.length.toString() },
    { label: "Live sections", value: activeSections.length.toString() },
    { label: "Deepest topic", value: topSection?.title ?? "Pending" },
  ];

  const spotlightFaqs = searchableFaqs.slice(0, 8);
  const visibleReviews = featuredReviews.slice(0, 6);
  const reviewAverage =
    visibleReviews.length > 0
      ? Math.round(
          (visibleReviews.reduce((sum, review) => sum + (Number(review.rating) || 5), 0) / visibleReviews.length) * 10,
        ) / 10
      : null;
  const reviewCount = featuredReviews.length;
  const shouldShowSource = (source?: string | null) => !!source && !/^(?:import|unknown|n\/a)\s*$/i.test(source);

  return (
    <main className="min-h-screen bg-[#030819] text-white">
      <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-10">
        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#111b3c] via-[#0a1227] to-[#050912] px-8 py-12 shadow-[0_45px_120px_rgba(0,0,0,0.45)]">
          <div className="absolute -top-10 right-10 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" aria-hidden />
          <div className="absolute -bottom-16 left-16 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl" aria-hidden />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.6em] text-white/60">Faq library</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-serif font-extrabold leading-tight">Ask smarter. Ride calmer.</h1>
            <p className="mt-4 text-base md:text-lg text-white/70 max-w-3xl">
              Pricing, polls, reviews, safety policies, city-specific rules—every answer we’ve published is indexed here. Bookmark it as your dispatcher’s manual or use it as an onboarding primer for new planners.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-5 text-center">
                  <p className="text-3xl font-semibold text-white">{metric.value}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60 mt-2">{metric.label}</p>
                </div>
              ))}
            </div>
            {hasFaqs && (
              <div className="mt-8 flex flex-wrap gap-3">
                {sections.map((section) => (
                  <a
                    key={`jump-${section.slug}`}
                    href={`#${section.slug}`}
                    className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 hover:text-white"
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {hasFaqs ? (
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0a132a] via-[#070d1b] to-[#04070f] px-6 py-10 shadow-lg">
            <FaqSearchClient
              faqs={searchableFaqs}
              searchInputId="library-search"
              searchLabel="Search the entire Bus2Ride knowledge base"
              searchPlaceholder='Try "deposit", "ADA", "polls"…'
            />
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-4xl px-4 pb-16">
          <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/70">
            No FAQs are available yet. Check back soon.
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-12 space-y-8">
        {sections.map((section, index) => {
          const gradient = GRADIENTS[index % GRADIENTS.length];
          return (
            <article key={section.slug} id={section.slug} className="scroll-mt-24">
              <div className={`relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br ${gradient} px-5 py-6 shadow-lg`}>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.55em] text-white/50">{section.slug}</p>
                    <h2 className="mt-1 text-xl md:text-2xl font-serif font-semibold">{section.title}</h2>
                    <p className="text-white/70 text-xs mt-1">
                      {section.faqs.length ? "Tap to expand—four answers at a time." : "No questions yet—coming soon."}
                    </p>
                  </div>
                  <span className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/70">
                    {section.faqs.length} entries
                  </span>
                </div>

                {section.faqs.length > 0 ? (
                  <div className="mt-4">
                    <FaqSectionList faqs={section.faqs} initialCount={SECTION_INITIAL} step={SECTION_STEP} />
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-xs text-white/70">
                    No questions yet—coming soon.
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {visibleReviews.length ? (
        <section className="relative w-full border-t border-white/5 bg-[#041026]">
          <div className="absolute inset-0 opacity-40" aria-hidden>
            <div className="mx-auto h-full max-w-6xl bg-[radial-gradient(circle_at_top,_rgba(58,105,255,0.3),_transparent_55%)]" />
          </div>
          <div className="relative mx-auto max-w-6xl px-4 py-14">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">Verified riders</p>
                <h2 className="mt-3 text-3xl font-serif font-semibold text-white">People cite these after reading FAQs</h2>
                <div className="mt-4 flex items-center gap-3 text-white/80">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm font-semibold">
                    <Stars value={reviewAverage ?? 5} size={16} />
                    <span>{reviewAverage ? `${reviewAverage} / 5` : "5 / 5"}</span>
                  </div>
                  <span className="text-sm text-white/60">Based on {reviewCount || visibleReviews.length} reviews</span>
                </div>
              </div>
              <Link
                href="/reviews"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 shadow-[0_10px_30px_rgba(3,7,18,0.65)] transition hover:border-white/40 hover:bg-white/15"
              >
                Read all reviews
              </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleReviews.map((review) => (
                <article
                  key={review.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/12 via-white/6 to-transparent p-6 text-white shadow-[0_25px_60px_rgba(3,7,18,0.4)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/35"
                >
                  <div className="absolute inset-0 opacity-0 transition group-hover:opacity-30" aria-hidden>
                    <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(86,156,255,0.45),_transparent_60%)]" />
                  </div>
                  <div className="relative flex items-center justify-between gap-3">
                    <Stars value={review.rating ?? 5} />
                    {shouldShowSource(review.source) ? (
                      <span className="text-[11px] uppercase tracking-wide text-white/50">{review.source}</span>
                    ) : null}
                  </div>
                  {review.body ? (
                    <p
                      className="relative mt-4 text-[15px] leading-relaxed text-white/90"
                      style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                    >
                      “{review.body}”
                    </p>
                  ) : null}
                  <div className="relative mt-4 flex items-center gap-2 text-[13px] text-white/75">
                    <span className="inline-block h-[6px] w-[6px] rounded-full bg-emerald-400" />
                    — {review.author_display ?? "Verified rider"}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/reviews"
                className="inline-flex items-center justify-center rounded-full bg-white/95 px-7 py-3 text-sm font-semibold text-[#04132d] shadow-[0_15px_40px_rgba(10,27,54,0.35)] transition hover:translate-y-0.5 hover:bg-white"
              >
                See more reviews
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-7 py-3 text-sm font-semibold text-white/80 hover:text-white hover:border-white/40"
              >
                More blogs
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {spotlightFaqs.length ? (
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#13182a] via-[#090d19] to-[#04060b] px-6 py-10 shadow-lg">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-[11px] uppercase tracking-[0.5em] text-white/60">Quick answers</p>
              <h2 className="mt-3 text-3xl font-serif font-semibold">Most-clicked this week</h2>
              <p className="mt-3 text-sm text-white/70">Eight fast responses people reference right after reading policies.</p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {spotlightFaqs.map((faq) => (
                <div key={`spot-${faq.id}`} className="rounded-3xl border border-white/15 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">{faq.categoryTitle}</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{faq.question}</h3>
                  <p className="mt-2 text-sm text-white/75">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
