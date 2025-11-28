import HeroHeaderServer from "../../components/HeroHeaderServer";
import BlogClient from "./BlogClient";
import { getHeroFallback } from "../../data/heroFallbacks";
import GlobalReviewStripServer from "@/components/reviews/GlobalReviewStripServer";
import BlogFaqSection from "@/components/blog/BlogFaqSection";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-black text-white">
      <HeroHeaderServer pageSlug="blog" fallback={getHeroFallback("blog")} />
      <BlogClient />
      <div className="mt-16 space-y-16">
        <GlobalReviewStripServer />
        <BlogFaqSection />
      </div>
    </main>
  );
}
