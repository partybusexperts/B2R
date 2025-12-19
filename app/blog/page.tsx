import Hero from "@/components/layout/hero";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getReviews } from "@/lib/data/reviews";
import { getBlogPosts } from "@/lib/data/blog";
import { BlogGrid } from "@/components/sections/blog-grid";
import FleetSection from "@/components/sections/fleet-section";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Planning tips, pricing breakdowns, and booking advice for party buses, limos, and coach buses — written for real group trips.",
  path: "/blog",
});

export default async function BlogPage() {
  const blogs = (await getBlogPosts()) ?? [];
  const reviews = (await getReviews()) ?? [];

  return (
    <main>
      <Hero slug="blog" />

      <BlogGrid posts={blogs} />

      <FleetSection />
      <ReviewsSection reviews={reviews} />
      <PollsGrid
        columnCategories={["party-bus", "limo", "coach-bus"]}
        hideCities
      />
      <ToolsGrid category="blog" />
      <EventsGrid />
      <FaqSection category="blog" title="Blog FAQs" />
    </main>
  );
}
