import HeroHeaderServer from "../../components/HeroHeaderServer";
import EventsClient from "./EventsClient";
import GlobalReviewStripServer from "../../components/reviews/GlobalReviewStripServer";
import EventsFaqSection from "../../components/events/EventsFaqSection";
import { getHeroFallback } from "../../data/heroFallbacks";

export default function EventsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06122c] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
        <div className="absolute -top-36 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-500/20 blur-[240px]" />
        <div className="absolute top-32 -left-24 h-[420px] w-[420px] rounded-full bg-indigo-700/30 blur-[220px]" />
        <div className="absolute bottom-0 right-0 h-[520px] w-[520px] translate-x-20 rounded-full bg-emerald-500/20 blur-[260px]" />
      </div>

      <div className="relative z-10">
        <HeroHeaderServer pageSlug="events" fallback={getHeroFallback("events")} />
        <EventsClient />
        <GlobalReviewStripServer />
        <EventsFaqSection />
      </div>
    </main>
  );
}


