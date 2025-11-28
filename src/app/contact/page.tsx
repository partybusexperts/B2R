import ContactForm from "@/components/ContactForm";
import GlobalReviewStripServer from "@/components/reviews/GlobalReviewStripServer";
import HeroHeaderServer from "@/components/HeroHeaderServer";
import PageLayout from "@/components/PageLayout";
import { getHeroFallback } from "@/data/heroFallbacks";

const RESPONSE_STATS = [
  { label: "Median reply", value: "2m 11s" },
  { label: "Night coverage", value: "24 / 7" },
  { label: "Live metros", value: "38" },
  { label: "Quote accuracy", value: "97%" },
];

const CONTACT_CHANNELS = [
  {
    label: "Call Dispatch",
    value: "(888) 535-2566",
    detail: "Priority for departures inside 24 hours",
    href: "tel:18885352566",
    badge: "Instant human",
  },
  {
    label: "Text the Ops Desk",
    value: "+1 (405) 351-8488",
    detail: "Perfect for tweaks, headcounts, and multi-stop manifests",
    href: "sms:+14053518488",
    badge: "Seen in < 90s",
  },
  {
    label: "Mission Control Inbox",
    value: "ops@bus2ride.com",
    detail: "Attach rider lists, compliance docs, or PO approvals",
    href: "mailto:ops@bus2ride.com",
    badge: "Files welcome",
  },
];

const SLA_TIMELINE = [
  { label: "00:00 – 02:00", title: "Signal lock", desc: "Route + fleet matrix runs, we text/email an acknowledgement." },
  { label: "02:00 – 05:00", title: "Human review", desc: "Dispatcher validates vehicle class, DOT compliance, surge factors." },
  { label: "05:00 – 10:00", title: "Quote drop", desc: "You receive a firm itinerary with holds, deposits, and upgrade paths." },
  { label: "10:00+", title: "White-glove sync", desc: "Ops team stays in-thread for tweaks, docs, and payment capture." },
];

const AUTOMATIONS = [
  {
    title: "Live route intelligence",
    body: "We overlay your pickup+drop map with traffic APIs and stadium blackouts so the quote already includes realistic staging buffers.",
  },
  {
    title: "Vehicle telemetry hook",
    body: "Our CRM pings each assigned coach for maintenance flags. Anything redlines, we auto-sub another unit before you ever notice.",
  },
  {
    title: "Document sync",
    body: "Share COIs, manifests, or venue permits once; they auto-propagate to dispatch, your driver, and the rider SMS thread.",
  },
];

export default function ContactPage() {
  return (
    <PageLayout
      gradientFrom="from-[#01030b]"
      gradientVia="via-[#060f24]"
      gradientTo="to-[#02050f]"
      textColor="text-white"
    >
      <HeroHeaderServer
        pageSlug="contact"
        fallback={getHeroFallback("contact", {
          primary_cta: { label: "Text Dispatch", href: "sms:+14053518488" },
          secondary_cta: { label: "Schedule a Call", href: "tel:18885352566" },
        })}
      />

      <section className="relative mx-auto -mt-16 max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-[44px] border border-white/10 bg-gradient-to-br from-[#0b1734] via-[#040915] to-black px-8 py-10 shadow-[0_50px_140px_rgba(1,3,12,0.85)]">
          <div className="absolute inset-0 opacity-40" aria-hidden>
            <div className="absolute -left-10 top-6 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-purple-600/20 blur-3xl" />
          </div>
          <div className="relative">
            <p className="text-[11px] uppercase tracking-[0.45em] text-white/60">Mission control</p>
            <h1 className="mt-4 text-3xl font-serif font-semibold md:text-5xl">One command center for every question, quote, or curveball.</h1>
            <p className="mt-4 max-w-3xl text-base text-white/70 md:text-lg">
              We wire engineers directly into dispatch so your inquiry gets routed like an incident—not a generic inbox. Pick your lane below and the right person jumps in within minutes.
            </p>
            <div className="mt-8 grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
              {RESPONSE_STATS.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-5">
                  <p className="text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4">
        <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <div id="contact" className="rounded-[36px] border border-white/8 bg-[#0b1734]/90 p-1 shadow-[0_40px_120px_rgba(0,0,0,0.65)] backdrop-blur">
            <div className="rounded-[32px] border border-white/5 bg-white text-slate-900">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0d1b36] to-[#050a16] p-6">
              <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">Priority lines</p>
              <div className="mt-5 space-y-5">
                {CONTACT_CHANNELS.map((channel) => (
                  <a
                    key={channel.label}
                    href={channel.href}
                    className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-white/30"
                  >
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <span>{channel.label}</span>
                      <span className="rounded-full border border-white/10 px-3 py-0.5 text-[11px] uppercase tracking-[0.3em]">{channel.badge}</span>
                    </div>
                    <p className="text-2xl font-semibold text-white">{channel.value}</p>
                    <p className="text-sm text-white/65">{channel.detail}</p>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[#050912] p-6">
              <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Response SLA</p>
              <div className="mt-6 space-y-5">
                {SLA_TIMELINE.map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-28 text-xs uppercase tracking-[0.3em] text-white/60">{item.label}</div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-sm text-white/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#081022] to-[#050912] p-6">
              <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">Coverage locks</p>
              <ul className="mt-4 space-y-3 text-sm text-white/75">
                <li>• Dedicated overnight dispatcher in Dallas + LA for coast-to-coast overlap.</li>
                <li>• Shared Slack + SMS thread so your planner, driver, and ops hear the same updates.</li>
                <li>• Auto-escalation if a message goes unanswered for 6 minutes.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 pb-12">
        <div className="rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0e1c39] via-[#050a16] to-[#02040a] px-6 py-10">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">Workflow automations</p>
            <h2 className="mt-3 text-3xl font-serif font-semibold">Why our replies feel instant</h2>
            <p className="mt-3 text-sm text-white/70">Dispatch, engineering, and concierge tools run on the same spine so we can promise real SLAs instead of “we’ll get back to you.”</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {AUTOMATIONS.map((automation) => (
              <div key={automation.title} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">{automation.title}</p>
                <p className="mt-3 text-sm text-white/80">{automation.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GlobalReviewStripServer />
    </PageLayout>
  );
}

