import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqData, getFaqs } from "@/lib/data/faqs";
import { getReviews } from "@/lib/data/reviews";
import FleetSection from "@/components/sections/fleet-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FaqSearchSection } from "@/components/sections/faq-search-section";
import Hero from "@/components/layout/hero";
import { FaqMostClickedWeek } from "@/components/sections/faq-most-clicked-week";
import { FaqCategorySection } from "@/components/sections/faq-category-section";
import { HeaderSection } from "@/components/sections/header-section";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "FAQ",
  description:
    "Search answers about booking, pricing, timing, vehicle rules, and event logistics — curated from real rider questions.",
  path: "/faq",
});

function getCountsByCategory(faqs: FaqData[]) {
  const counts = new Map<string, number>();
  for (const faq of faqs) {
    const slug = (faq.page_slug ?? "").toString();
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }
  return counts;
}

const categories = [
  {
    category: "home",
    title: "Homepage",
  },
  {
    category: "party-buses",
    title: "Party Bus Fleet",
  },
  {
    category: "limousines",
    title: "Limousine Fleet",
  },
  {
    category: "coach-buses",
    title: "Coach Bus Fleet",
  },
  {
    category: "events",
    title: "Events",
  },
  {
    category: "pricing",
    title: "Pricing",
  },
  {
    category: "locations",
    title: "Locations",
  },
  {
    category: "polls",
    title: "Polls",
  },
  {
    category: "blog",
    title: "Blog",
  },
  {
    category: "tools",
    title: "Tools",
  },
  {
    category: "secrets",
    title: "Industry Secrets",
  },
  {
    category: "poll-results",
    title: "Poll Results",
  },
  {
    category: "reviews",
    title: "Reviews",
  },
  {
    category: "contact",
    title: "Contact",
  },
] as const;

export default async function FaqPage() {
  const faqs = (await getFaqs()) ?? [];
  const reviews = (await getReviews()) ?? [];

  // Data for header section
  const countsByCategory = getCountsByCategory(faqs);

  const liveSections = categories.filter(
    (c) => (countsByCategory.get(c.category) ?? 0) > 0,
  );

  const deepest = categories
    .map((c) => ({ ...c, count: countsByCategory.get(c.category) ?? 0 }))
    .sort((a, b) => b.count - a.count)[0];

  const cardsForHeader = [
    {
      info: faqs.length + "", // to string
      label: "Total Answers",
    },
    {
      info: categories.length + "",
      label: "Categories",
    },
    {
      info: liveSections.length + "",
      label: "Live Sections",
    },
    {
      info: deepest?.title ?? "-",
      label: "Deepest Topic",
    },
  ] as const;

  return (
    <main>
      <Hero slug="faq" />

      {/* FAQ Modal */}
      <HeaderSection
        badgeText="FAQ Library"
        title="Ask smarter. Ride calmer."
        description="Find answers about booking, pricing, vehicles, and policies — written for real riders and real planners. Search the library or jump into a topic below."
        cards={cardsForHeader}
        categories={liveSections}
      />

      {/* Search between all faqs */}
      <FaqSearchSection />

      {/* order different faq sections by category */}
      {categories.map((category) => (
        <div key={category.category} id={`faq-${category.category}`}>
          <FaqCategorySection
            category={category.category}
            title={category.title}
          />
        </div>
      ))}

      <FaqMostClickedWeek faqs={faqs} categories={categories} />

      <ReviewsSection reviews={reviews} />
      <FleetSection />
      <PollsGrid
        columnCategories={["booking-experience", "pricing", "alcohol-policy"]}
        hideCities
      />
      <EventsGrid />
      <ToolsGrid category="faq" />
      <FaqSection category="faq" title="More FAQs" />
    </main>
  );
}
