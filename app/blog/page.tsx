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
// import { FleetList } from "@/components/sections/fleet-list";
// import { getRandomVehicles } from "@/lib/data/vehicles";

export default async function BlogPage() {
  const blogs = (await getBlogPosts()) ?? [];
  const reviews = (await getReviews()) ?? [];
  // const fleet = (await getRandomVehicles()) ?? [];

  return (
    <main>
      <Hero slug="blog" />

      <BlogGrid posts={blogs} />

      {/* <FleetList title="Our Fleet" vehicles={fleet} /> */}
      <FleetSection />
      <ReviewsSection reviews={reviews} />
      <PollsGrid />
      <ToolsGrid category="blog" />
      <EventsGrid />
      <FaqSection category="blog" title="Blog FAQs" />
    </main>
  );
}
