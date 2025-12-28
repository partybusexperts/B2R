import Hero from "@/components/layout/hero";
import { LocationsDirectoryClient } from "@/components/sections/locations-directory.client";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { FaqSection } from "@/components/sections/faq-section";
import { EventsGrid } from "@/components/sections/events-grid";
import { getReviews } from "@/lib/data/reviews";
import { getLocations } from "@/lib/data/locations";
import FleetSection from "@/components/sections/fleet-section";
import { LinkConstellation, type InternalLink, type ExternalLink } from "@/components/sections/link-constellation";
import { SectionDivider, PremiumDivider } from "@/components/layout/section-dividers";
import { ComingSoonPlaceholder } from "@/components/sections/coming-soon-placeholder";
import { pageMetadata } from "@/lib/seo/metadata";
import { Sparkles } from "lucide-react";

export const metadata = pageMetadata({
  title: "Locations",
  description:
    "Find party bus, limo, and coach bus service by city and state. Browse coverage and get a fast quote for your route.",
  path: "/locations",
});

const INTERNAL_LINKS: InternalLink[] = [
  { href: "/fleet", label: "Browse Fleet", description: "See vehicles available in your area", category: "fleet" },
  { href: "/pricing", label: "Local Pricing", description: "Get rates for your city", category: "resources" },
  { href: "/events", label: "Event Ideas", description: "Popular events in your area", category: "events" },
  { href: "/contact", label: "Get a Quote", description: "Request personalized pricing", category: "resources" },
  { href: "/reviews", label: "Local Reviews", description: "See what customers say", category: "resources" },
];

const EXTERNAL_LINKS: ExternalLink[] = [
  { href: "https://www.tripadvisor.com/", label: "Local Attractions", source: "TripAdvisor" },
  { href: "https://www.yelp.com/", label: "Local Venues", source: "Yelp" },
];

async function getData() {
  const locations = await getLocations();
  const reviews = await getReviews();

  return {
    reviews: reviews || [],
    locations: locations || [],
  };
}

export default async function LocationsIndexPage() {
  const { reviews, locations } = await getData();

  return (
    <main className="bg-[#0a1628]">
      <Hero slug="locations" />

      <SectionDivider variant="glow" />

      <LocationsDirectoryClient locations={locations} />

      <PremiumDivider />

      <section className="py-16 bg-gradient-to-b from-[#0a1628] to-[#060e23]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-300">
                Coming Soon
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white font-serif mb-4">
              Enhanced Location Features
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto">
              We're working on exciting new features to make finding and booking 
              transportation in your city even easier.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <ComingSoonPlaceholder
              title="Live Weather Updates"
              description="Real-time weather conditions for your event date, helping you plan the perfect pickup timing."
              expectedDate="Q1 2025"
            />
            <ComingSoonPlaceholder
              title="Local Venue Partnerships"
              description="Special rates and preferred pickup at popular venues, hotels, and event spaces."
              expectedDate="Q1 2025"
            />
          </div>
        </div>
      </section>

      <SectionDivider variant="gradient" />

      <PollsGrid
        columnCategories={["weddings", "bachelorette-parties", "concerts"]}
        hideCities
        title="Location Polls"
      />

      <SectionDivider variant="dots" />

      <FleetSection />

      <PremiumDivider />

      <ToolsGrid category="locations" />

      <SectionDivider variant="glow" />

      <ReviewsSection reviews={reviews} />

      <SectionDivider variant="gradient" />

      <LinkConstellation
        internalLinks={INTERNAL_LINKS}
        externalLinks={EXTERNAL_LINKS}
        title="Explore Your Options"
      />

      <PremiumDivider />

      <EventsGrid />

      <SectionDivider variant="dots" />

      <FaqSection category="locations" title="Location FAQs" />
    </main>
  );
}
