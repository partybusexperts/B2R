import HeroHeaderServer from "../../components/HeroHeaderServer";
import EventsClient from "./EventsClient";
import GlobalReviewStripServer from "../../components/reviews/GlobalReviewStripServer";
import EventsFaqSection from "../../components/events/EventsFaqSection";
import { getHeroFallback } from "../../data/heroFallbacks";

export default function EventsPage() {
  return (
    <main className="text-white bg-[#0f1f46] min-h-screen">
      <HeroHeaderServer pageSlug="events" fallback={getHeroFallback("events")} />
      <EventsClient />
      <GlobalReviewStripServer />
      <EventsFaqSection />
    </main>
  );
}


