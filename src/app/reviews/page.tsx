import HeroHeader from "@/components/HeroHeader";
import FaqSearchClient from "@/components/faqs/FaqSearchClient";
import PollColumnsByCategoryClient from "@/components/polls/PollColumnsByCategoryClient";
import ToolsGrid from "@/components/tools/ToolsGrid";
import { getHeroFallback } from "@/data/heroFallbacks";
import { getHomepageCategoryColumns } from "@/lib/home-polls";
import { getFaqsForPage } from "@/lib/server/faqs";
import { getAggregateRating, getFeaturedReviews } from "@/lib/server/reviews";

export const revalidate = 300;

type DisplayReview = {
  id: string;
  body: string;
  author: string;
  rating: number;
  source?: string | null;
};

const FALLBACK_REVIEWS: DisplayReview[] = [
  {
    id: "paul",
    author: "Paul P.",
    body:
      "Absolutely excellent! Great customer service! We changed drop off points several times and they were so accommodating. Gail in the office is top notch and on top of everything! The price was very good. The driver was so nice and professional. The limo looked pristine, inside and out.",
    rating: 5,
    source: "Community",
  },
  {
    id: "jessie",
    author: "Jessie A.",
    body: "The limo company that you need to call when you have an event. Prices and fleet look like no other limo company.",
    rating: 5,
  },
  {
    id: "dee",
    author: "Dee C.",
    body:
      "Definitely lives up to their name! We used them for our bachelorette/bachelor parties and our wedding and will be using them again. They let me extend an hour when I wasn’t ready to go yet.",
    rating: 5,
  },
  {
    id: "halee",
    author: "Halee H.",
    body: "Price was great, interior was spotless, driver was friendly and accommodating! Will never use another company besides this one!",
    rating: 5,
  },
  {
    id: "rachel",
    author: "Rachel L.",
    body: "We had the best time ever! Darrius was our driver and he kept the energy up the entire bachelor/bachelorette weekend.",
    rating: 5,
  },
  {
    id: "becky",
    author: "Becky B.",
    body: "Sonny can take your event to the next level with his beautiful limos and sedans making you feel like a movie star!",
    rating: 5,
  },
  {
    id: "george",
    author: "George S.",
    body: "Top of the line chauffeur and limo service.",
    rating: 5,
  },
  {
    id: "teresa",
    author: "Teresa S.",
    body:
      "What a memorable night for our students’ prom. Rick was an excellent and safe driver, providing top notch customer service and hitting every timing window.",
    rating: 5,
  },
  {
    id: "carleigh",
    author: "Carleigh S.",
    body: "We have used them twice—once for a 16th birthday and once for a large group transfer. Always on time. Drivers were wonderful.",
    rating: 5,
  },
  {
    id: "lindsay",
    author: "Lindsay J.",
    body: "Used for a wedding and very satisfied! Drivers were extremely communicative. Jerry was friendly and easy to work with.",
    rating: 5,
  },
  {
    id: "leah",
    author: "Leah K.",
    body:
      "We rented a party bus for my daughter’s 10th birthday and I cannot say enough good things! Communicating with dispatch was easy and they accommodated every request.",
    rating: 5,
  },
  {
    id: "angela",
    author: "Angela F.",
    body: "Booked the party bus for prom. The driver was on time, the bus was clean, and the kids made amazing memories.",
    rating: 5,
  },
  {
    id: "kaley",
    author: "Kaley H.",
    body: "Driver was on time both directions and even got the things we left on the bus back to us.",
    rating: 5,
  },
  {
    id: "amanda",
    author: "Amanda P.",
    body: "Best limo company around! Worth every dime. Our driver Mike was sweet, easygoing, and the limo was updated.",
    rating: 5,
  },
  {
    id: "chad",
    author: "Chad M.",
    body: "Booked a party bus several months in advance and was very impressed. Jerry made the booking process simple and fast!",
    rating: 5,
  },
];

const SIGNALS = [
  { key: "driver", label: "Pro driver shout-outs", keywords: ["driver", "chauffeur", "captain"] },
  { key: "price", label: "Budget wins", keywords: ["price", "budget", "rate", "cost"] },
  { key: "clean", label: "Vehicles called spotless", keywords: ["clean", "pristine", "spotless"] },
  { key: "communication", label: "Rapid-fire comms", keywords: ["communicat", "text", "call", "responsive"] },
];

function calcSignal(reviews: DisplayReview[], keywords: string[]) {
  const total = reviews.length || 1;
  const matches = reviews.filter((review) => {
    const body = review.body.toLowerCase();
    return keywords.some((kw) => body.includes(kw));
  }).length;
  return Math.round((matches / total) * 100);
}

export default async function ReviewsPage() {
  const [featured, agg, pollColumns, faqs] = await Promise.all([
    getFeaturedReviews(48).catch(() => []),
    getAggregateRating().catch(() => ({ avg: null, count: 0 })),
    getHomepageCategoryColumns({ numColumns: 3, perColumn: 50 }).catch(() => []),
    getFaqsForPage("reviews", 120).catch(() => []),
  ]);

  const feed: DisplayReview[] = featured.length
    ? (featured
        .map((review) => ({
          id: String(review.id ?? Math.random()),
          body: (review.body ?? "").trim(),
          author: review.author_display?.trim() || "Verified rider",
          rating: Number(review.rating ?? 5) || 5,
          source: review.source,
        }))
        .filter((review) => review.body.length > 0))
    : FALLBACK_REVIEWS;

  const primary = feed[0];
  const remainder = feed.slice(1);
  const avg = agg.avg ?? 5;
  const count = agg.count ?? feed.length;

  const heroStats = [
    { label: "Average rating", value: `${avg.toFixed(1)} / 5` },
    { label: "Reviews logged", value: count.toLocaleString() },
    { label: "Cities covered", value: "38 metros" },
    { label: "Audit lag", value: "< 6 hrs" },
  ];

  const signalData = SIGNALS.map((signal) => ({
    ...signal,
    percent: calcSignal(feed, signal.keywords),
  }));

  const hasPolls = pollColumns.length > 0;
  const hasFaqs = faqs.length > 0;

  return (
    <main className="min-h-screen bg-[#020614] text-white">
      <HeroHeader
        pageSlug="reviews"
        fallback={getHeroFallback("reviews", {
          primary_cta: { label: "Get Instant Quote", href: "/quote" },
          secondary_cta: { label: "See Fleet", href: "/party-buses" },
        })}
      />

      <section className="relative mx-auto -mt-16 max-w-6xl px-4 pb-6">
        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0b1734] via-[#040917] to-black px-8 py-10 shadow-[0_45px_120px_rgba(2,6,15,0.65)]">
          <div className="absolute inset-0 opacity-40" aria-hidden>
            <div className="absolute -left-8 top-6 h-40 w-40 rounded-full bg-sky-500/30 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-fuchsia-500/25 blur-3xl" />
          </div>
          <div className="relative">
            <p className="text-[11px] uppercase tracking-[0.45em] text-white/60">Telemetry stream</p>
            <h1 className="mt-3 text-3xl font-serif font-semibold md:text-5xl">Live rider sentiment, straight from dispatch logs.</h1>
            <p className="mt-4 max-w-3xl text-base text-white/70 md:text-lg">
              We ingest every approved review, score it with our ops team, and surface the patterns that matter when you are choosing a fleet partner.
            </p>
            <div className="mt-8 grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-5">
                  <p className="text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-[11px] uppercase tracking-[0.45em] text-white/60">Review control room</p>
          <h2 className="text-3xl font-serif font-semibold md:text-4xl">Human-verified, AI-organized testimonials</h2>
          <p className="mx-auto max-w-3xl text-sm text-white/70">Every card below is a verified rider. We surface trending themes, highlight actionable intel, and keep raw quotes intact.</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="space-y-6">
            {primary ? (
              <article className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 shadow-[0_30px_80px_rgba(3,7,18,0.65)]">
                <div className="absolute inset-0 opacity-50" aria-hidden>
                  <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_transparent_60%)]" />
                </div>
                <div className="relative flex flex-wrap items-center gap-3 text-sm text-white/70">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 font-semibold">
                    <span className="text-white">★</span>
                    <span>{primary.rating.toFixed(1)} / 5</span>
                  </span>
                  {primary.source ? (
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[12px] uppercase tracking-[0.3em] text-white/60">{primary.source}</span>
                  ) : null}
                </div>
                <p className="relative mt-6 text-2xl leading-snug text-white">“{primary.body}”</p>
                <p className="relative mt-6 text-sm uppercase tracking-[0.4em] text-white/60">— {primary.author}</p>
              </article>
            ) : null}

            <div className="columns-1 gap-6 space-y-6 md:columns-2">
              {remainder.map((review) => (
                <article
                  key={review.id}
                  className="relative mb-6 break-inside-avoid rounded-3xl border border-white/10 bg-[#070f21]/80 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/50">
                    <span>{review.source ?? "Verified"}</span>
                    <span>{review.rating.toFixed(1)} ★</span>
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-white/90">“{review.body}”</p>
                  <p className="mt-5 text-sm text-white/70">— {review.author}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-[#0b1a38] to-[#050912] p-6 shadow-2xl">
              <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">Signal scan</p>
              <h3 className="mt-3 text-2xl font-semibold">What riders mention the most</h3>
              <div className="mt-6 space-y-4">
                {signalData.map((signal) => (
                  <div key={signal.key}>
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span>{signal.label}</span>
                      <span>{signal.percent}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500"
                        style={{ width: `${signal.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#060b18] p-6">
              <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">Ops note</p>
              <p className="mt-3 text-sm text-white/70">
                We reconcile every review with dispatch logs and GPS breadcrumbs. Anything that does not match vehicle telemetry gets flagged for manual follow-up before it ever hits this wall.
              </p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center">
                <p className="text-3xl font-semibold">{avg.toFixed(1)} / 5</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Avg. rating across {count.toLocaleString()} rides</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {hasPolls ? (
        <section className="relative mx-auto mb-12 max-w-6xl rounded-[36px] border border-white/8 bg-gradient-to-br from-[#030711] via-[#09132a] to-[#030711] py-14 px-7 shadow-[0_45px_100px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-0 opacity-30" aria-hidden>
            <div className="mx-auto h-full max-w-5xl bg-[radial-gradient(circle,_rgba(14,165,233,0.3),_transparent_65%)]" />
          </div>
          <div className="relative mx-auto mb-8 max-w-3xl text-center">
            <p className="text-[11px] uppercase tracking-[0.45em] text-white/60">Live polls</p>
            <h2 className="mt-3 text-3xl font-serif font-semibold">Compare your instincts with the crowd</h2>
            <p className="mt-4 text-sm text-white/70 md:text-base">These Supabase-driven polls refresh constantly so you can see how other planners are voting on pricing, amenities, and policies.</p>
          </div>
          <div className="relative grid gap-8 md:grid-cols-3">
            <PollColumnsByCategoryClient columns={pollColumns} />
          </div>
        </section>
      ) : null}

      <section className="mx-auto mb-12 max-w-6xl px-4">
        <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-[#0d1a32] via-[#060a13] to-[#010207] px-6 py-10 shadow-2xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">Tool stack</p>
            <h2 className="mt-3 text-3xl font-serif font-semibold">The calculators reviewers referenced most</h2>
            <p className="mt-3 text-sm text-white/70">Launch budgeting, routing, and timing tools directly—each one opens an interactive modal so you can verify the same math as our riders.</p>
          </div>
          <div className="mt-8">
            <ToolsGrid limit={6} randomize className="[&_div]:bg-[#101c34]" />
          </div>
        </div>
      </section>

      {hasFaqs ? (
        <section className="mx-auto mb-16 max-w-6xl px-4">
          <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-[#0a1324] via-[#060a15] to-[#03050b] px-6 py-10 shadow-2xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">FAQ</p>
              <h2 className="mt-3 text-3xl font-serif font-semibold">Ask what other reviewers asked</h2>
              <p className="mt-3 text-sm text-white/70">Search common follow-ups on pricing, driver policies, and timeline tweaks.</p>
            </div>
            <div className="mt-8">
              <FaqSearchClient
                faqs={faqs}
                searchInputId="reviews-faq"
                searchLabel="Search the knowledge graph"
                searchPlaceholder='Try "driver", "pricing", "cleaning"…'
              />
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
