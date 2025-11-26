import HeroHeaderServer from "../../components/HeroHeaderServer";
import BlogClient from "./BlogClient";
import { getHeroFallback } from "../../data/heroFallbacks";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-black text-white">
      <HeroHeaderServer pageSlug="blog" fallback={getHeroFallback("blog")} />
      <BlogClient />
    </main>
  );
}
