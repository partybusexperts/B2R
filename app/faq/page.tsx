import Hero from "@/components/layout/hero";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { getFaqs } from "@/lib/data/faqs";
import { getReviews } from "@/lib/data/reviews";
import FleetSection from "@/components/sections/fleet-section";
import { FaqGridClient } from "@/components/sections/faq-grid.client";
import { TriviaBookingSection, type TriviaItem } from "@/components/sections/trivia-booking-section";
import { FactsShowcase, type FactItem } from "@/components/sections/facts-showcase";
import { BookingProcessSection } from "@/components/sections/content-booking";
import { LinkConstellation, type InternalLink, type ExternalLink } from "@/components/sections/link-constellation";
import { SectionDivider, PremiumDivider } from "@/components/layout/section-dividers";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "FAQ",
  description:
    "Search answers about booking, pricing, timing, vehicle rules, and event logistics — curated from real rider questions.",
  path: "/faq",
});

const FAQ_TRIVIA: TriviaItem[] = [
  {
    id: "1",
    question: "What's the #1 question we get asked?",
    answer: "How far in advance should I book? For peak dates (prom, weddings, NYE), book 6-8 weeks ahead. Regular weekends need 2-3 weeks. Last minute? Call us - we'll try our best!",
    category: "Booking Insight",
    source: "Customer Service Data",
  },
  {
    id: "2",
    question: "What surprise do most first-timers not expect?",
    answer: "Gratuity isn't usually included in the quoted price! Standard tip is 15-20% of rental cost. Some packages include it, so always ask when booking.",
    category: "Pro Tip",
    source: "Customer Feedback",
  },
  {
    id: "3",
    question: "What's the most common mistake when booking?",
    answer: "Underestimating group size! Book for your maximum possible headcount. It's much easier to have extra space than to scramble for a bigger vehicle last minute.",
    category: "Avoid This",
    source: "Booking Team Insights",
  },
  {
    id: "4",
    question: "What policy confuses people most?",
    answer: "BYOB rules vary by state and company. Most party buses allow alcohol for 21+ passengers, but some states have strict regulations. Always confirm when booking!",
    category: "Policy Alert",
    source: "Legal Compliance Team",
  },
  {
    id: "5",
    question: "What's the best way to save money?",
    answer: "Book on off-peak days! Thursday or Sunday events are often 20-30% cheaper than Saturday nights. Mid-month dates beat end-of-month too.",
    category: "Money Saver",
    source: "Pricing Analysis",
  },
];

const FAQ_FACTS: FactItem[] = [
  { id: "1", stat: "500+", label: "Questions Answered", category: "stat" },
  { id: "2", stat: "6", label: "Categories", category: "stat" },
  { id: "3", stat: "24/7", label: "Support Available", category: "stat" },
  { id: "4", stat: "98%", label: "Issues Resolved", category: "stat" },
  { id: "5", stat: "<2min", label: "Avg Response Time", category: "stat" },
  { id: "6", stat: "15+", label: "Years Experience", category: "stat" },
];

const INTERNAL_LINKS: InternalLink[] = [
  { href: "/contact", label: "Contact Us", description: "Get personalized help with your questions", category: "resources" },
  { href: "/pricing", label: "Pricing Guide", description: "Detailed pricing information", category: "resources" },
  { href: "/fleet", label: "Browse Fleet", description: "Explore our vehicle options", category: "fleet" },
  { href: "/events", label: "Event Ideas", description: "Inspiration for your celebration", category: "events" },
  { href: "/reviews", label: "Customer Stories", description: "Real experiences from riders", category: "resources" },
];

const EXTERNAL_LINKS: ExternalLink[] = [
  { href: "https://www.nla.org/", label: "Industry Standards", source: "National Limousine Association" },
  { href: "https://www.fmcsa.dot.gov/", label: "Safety Regulations", source: "FMCSA" },
];

export default async function FaqPage() {
  const faqs = (await getFaqs()) ?? [];
  const reviews = (await getReviews()) ?? [];

  return (
    <main className="bg-[#0a1628]">
      <Hero slug="faq" />

      <SectionDivider variant="glow" />

      <FactsShowcase
        facts={FAQ_FACTS}
        title="FAQ By The Numbers"
        subtitle="Your questions, our expertise"
      />

      <PremiumDivider />

      <FaqGridClient faqs={faqs} />

      <SectionDivider variant="gradient" />

      <FleetSection />

      <SectionDivider variant="dots" />

      <TriviaBookingSection
        triviaItems={FAQ_TRIVIA}
        title="FAQ Trivia & How to Book"
        subtitle="Insider answers and step-by-step booking guide"
        bookingTitle="How to Book with Bus2Ride"
      />

      <PremiumDivider />

      <ReviewsSection reviews={reviews} />

      <SectionDivider variant="glow" />

      <PollsGrid
        columnCategories={["booking-lead-times", "pricing", "weddings"]}
        hideCities
        title="FAQ Polls"
      />

      <SectionDivider variant="gradient" />

      <BookingProcessSection />

      <PremiumDivider />

      <EventsGrid />

      <SectionDivider variant="dots" />

      <ToolsGrid category="faq" />

      <SectionDivider variant="glow" />

      <LinkConstellation
        internalLinks={INTERNAL_LINKS}
        externalLinks={EXTERNAL_LINKS}
        title="Still Have Questions?"
      />
    </main>
  );
}
