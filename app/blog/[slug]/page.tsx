import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getReviews } from "@/lib/data/reviews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareArticleButton } from "@/components/ui/share-article-button";
import Link from "next/link";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/data/blog";
import FleetSection from "@/components/sections/fleet-section";
import Image from "next/image";
import { toPublicStorageUrl } from "@/lib/helpers/storage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const buildTopicTags = (slug: string) => {
  return slug
    .split("-")
    .filter(
      (segment) =>
        segment.length > 2 &&
        !["the", "and", "for", "with", "your", "you", "how"].includes(segment),
    )
    .slice(0, 3)
    .map((segment) => segment.replace(/[^a-z0-9]/gi, ""))
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1));
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await getBlogPostBySlug(slug);

  if (!post) return notFound();

  const reviews = (await getReviews()) ?? [];

  const tags = post.tags ?? buildTopicTags(post.slug);
  const date = new Date(post.published_at ?? "").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const thumbnailSrc =
    post.thumbnail_url && post.thumbnail_url.trim().length > 0
      ? toPublicStorageUrl("Blog", post.thumbnail_url)
      : null;

  return (
    <main>
      {/* Custom Hero for Blog Post */}
      <div
        className="relative bg-slate-900 text-white py-24 md:py-32
          overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/60 z-10" />
        {thumbnailSrc && (
          <Image
            src={thumbnailSrc}
            alt={post.title ?? "Blog post"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div
          className="container mx-auto px-4 md:px-6 relative z-20 text-center
            max-w-4xl"
        >
          <Badge
            className="mb-6 bg-primary text-primary-foreground
              hover:bg-primary/90 px-4 py-1 text-sm"
          >
            {tags[0] ?? "Post"}
          </Badge>

          <h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6
              leading-tight"
          >
            {post.title}
          </h1>
          <div
            className="flex items-center justify-center gap-6 text-slate-300
              text-sm md:text-base"
          >
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {date}
            </span>
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post.author ?? "Author"}
            </span>
          </div>
        </div>
      </div>

      <article className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {/* Back Link */}
          <div className="mb-8">
            <Button
              variant="ghost"
              asChild
              className="pl-0 hover:pl-2 transition-all gap-2
                text-muted-foreground hover:text-primary"
            >
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4" /> Back to Blog
              </Link>
            </Button>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-2xl prose-img:shadow-lg text-justify"
            dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
          />

          {/* Tags & Share */}
          <div
            className="mt-12 pt-8 border-t border-border/40 flex flex-col
              sm:flex-row justify-between items-center gap-6"
          >
            <div className="flex flex-wrap gap-2">
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="px-3 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
            <ShareArticleButton className="gap-2 rounded-full" />
          </div>
        </div>
      </article>

      <FleetSection />
      {/* <FleetList title="Related Vehicles" vehicles={fleet} /> */}

      <ReviewsSection reviews={reviews} />
      <PollsGrid category="blog" />
      <ToolsGrid category="blog" />
      <FaqSection category="blog" title="Related FAQs" />
      <EventsGrid />
    </main>
  );
}
