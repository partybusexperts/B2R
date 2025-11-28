import HeroHeader from "../../components/HeroHeader";
import { getHeroFallback } from "../../data/heroFallbacks";
import IndustrySecretsClient from "./IndustrySecretsClient";
import GlobalReviewStripServer from "@/components/reviews/GlobalReviewStripServer";
import PollColumnsByCategoryClient from "@/components/polls/PollColumnsByCategoryClient";
import ToolsGrid from "@/components/tools/ToolsGrid";
import FaqSearchClient from "@/components/faqs/FaqSearchClient";
import { getHomepageCategoryColumns } from "@/lib/home-polls";
import { getFaqsForPage } from "@/lib/server/faqs";

const SECRET_COUNT = 32; // keep in sync with IndustrySecretsClient data

export default async function IndustrySecretsPage() {
  const [pollColumns, faqs] = await Promise.all([
    getHomepageCategoryColumns({ numColumns: 3, perColumn: 45 }).catch(() => []),
    getFaqsForPage("industry-secrets", 120).catch(() => []),
  ]);

  const metrics = [
    { label: "Playbook secrets", value: SECRET_COUNT.toString() },
    { label: "Average savings", value: "18%" },
    { label: "Cities validated", value: "38" },
    { label: "Dispatch interviews", value: "220" },
  ];

  const hasPolls = pollColumns.length > 0;
  const hasFaqs = faqs.length > 0;

  return (
    <main className="min-h-screen bg-[#050b1b] text-white">
      <HeroHeader
        pageSlug="industry-secrets"
        fallback={getHeroFallback("industry-secrets", {
          primary_cta: { label: "See Pricing", href: "/pricing" },
          secondary_cta: { label: "Ask About Off-Peak", href: "/contact" },
          tertiary_cta: { label: "Explore Fleet", href: "/party-buses" },
        })}
      />

      <section className="relative mx-auto -mt-16 max-w-6xl px-4 pb-4">
        <div className="relative rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0f1c3c] via-[#09122b] to-[#04070e] px-8 py-10 shadow-[0_45px_120px_rgba(2,6,15,0.65)]">
          <div className="absolute inset-0 overflow-hidden rounded-[40px]" aria-hidden>
            <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="absolute -left-12 bottom-0 h-48 w-48 rounded-full bg-fuchsia-500/15 blur-3xl" />
          </div>
          <div className="relative">
            <p className="text-[11px] uppercase tracking-[0.5em] text-white/60">Intel briefing</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-serif font-extrabold leading-tight">The receipts behind every “industry secret.”</h1>
            <p className="mt-4 max-w-3xl text-base text-white/75 md:text-lg">
              Dispatch notes, procurement audits, and metro-by-metro pricing quirks—all distilled so you can negotiate like an insider, even if it’s your first charter.
            </p>
            <div className="mt-8 grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-5">
                  <p className="text-3xl font-semibold text-white">{metric.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/60">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <IndustrySecretsClient />

      {hasPolls ? (
        <section className="relative mx-auto my-12 max-w-6xl rounded-[36px] border border-white/8 bg-gradient-to-br from-[#030711] via-[#09132a] to-[#030711] py-14 px-7 shadow-[0_45px_100px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,_rgba(59,130,246,0.35),_transparent_70%)]" aria-hidden />
          <div className="relative mx-auto mb-8 max-w-3xl text-center">
            <p className="text-[11px] uppercase tracking-[0.45em] text-white/60">Live polls</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif font-semibold">What riders care about right now</h2>
            <p className="mt-4 text-sm text-white/70 md:text-base">These three columns mirror the homepage feed so you can see sentiment before sending a quote.</p>
          </div>
          <div className="relative grid gap-8 md:grid-cols-3">
            <PollColumnsByCategoryClient columns={pollColumns} />
          </div>
        </section>
      ) : null}

      <section className="mx-auto my-12 max-w-6xl px-4">
        <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-[#0d1a32] via-[#070d1a] to-[#03050a] px-6 py-10 shadow-2xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">Ops lab</p>
            <h2 className="mt-3 text-3xl font-serif font-semibold">Tools we actually use to audit fleets</h2>
            <p className="mt-3 text-sm text-white/70">Sample the same calculators embedded across the platform. Every card opens a live widget so you can pressure-test a scenario without leaving this page.</p>
          </div>
          <div className="mt-8">
            <ToolsGrid limit={6} randomize className="[&_div]:bg-[#101c34]" />
          </div>
        </div>
      </section>

      <GlobalReviewStripServer />

      {hasFaqs ? (
        <section className="mx-auto my-16 max-w-6xl px-4">
          <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-[#0a1324] via-[#060a15] to-[#03050b] px-6 py-10 shadow-2xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">FAQ</p>
              <h2 className="mt-3 text-3xl font-serif font-semibold">Industry Secrets mailbag</h2>
              <p className="mt-3 text-sm text-white/70">Search the questions ops teams ask after reading these playbooks—policies, billing, compliance, and more.</p>
            </div>
            <div className="mt-8">
              <FaqSearchClient
                faqs={faqs}
                searchInputId="industry-secrets-faq"
                searchLabel="Search every answer"
                searchPlaceholder='Try "overtime", "prom season", "insurance"…'
              />
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
