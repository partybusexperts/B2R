"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchFilterBar } from "@/components/sections/search-filter-bar";
import { PostsData } from "@/lib/data/blog";
import { toPublicStorageUrl } from "@/lib/helpers/storage";

interface BlogGridProps {
  posts: PostsData;
}

const BLOG_FILTERS = [
  { label: "Guides", value: "Guides" },
  { label: "News", value: "News" },
  { label: "Tips", value: "Tips" },
  { label: "Events", value: "Events" },
  { label: "Safety", value: "Safety" },
];

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

export function BlogGrid({ posts }: BlogGridProps) {
  const [filteredPosts, setFilteredPosts] = React.useState(posts);
  const [query, setQuery] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);

  React.useEffect(() => {
    let result = posts ?? [];

    // 1. Search
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (post) =>
          post.title?.toLowerCase().includes(q) ||
          post.excerpt?.toLowerCase().includes(q) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(q)) ||
          buildTopicTags(post.slug).some((tag) =>
            tag.toLowerCase().includes(q),
          ),
      );
    }

    // 2. Filters
    if (activeFilters.length > 0) {
      result = result.filter((post) =>
        activeFilters.some(
          (filter) =>
            post.tags?.includes(filter) ||
            buildTopicTags(post.slug).includes(filter),
        ),
      );
    }

    setFilteredPosts(result);
  }, [posts, query, activeFilters]);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight
              text-foreground"
          >
            Latest News & Guides
          </h2>
          <p className="text-lg text-muted-foreground">
            Expert advice, travel tips, and industry insights from the Bus2Ride
            team.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="max-w-4xl mx-auto mb-16">
          <SearchFilterBar
            placeholder="Search articles..."
            filters={BLOG_FILTERS}
            query={query}
            onSearchChange={setQuery}
            onFilterChange={setActiveFilters}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts &&
            filteredPosts.map((post) => {
              const tags = post.tags ?? buildTopicTags(post.slug);
              const date = new Date(post.published_at ?? "").toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              );

              const thumbnailSrc =
                post.thumbnail_url && post.thumbnail_url.trim().length > 0
                  ? toPublicStorageUrl("Blog", post.thumbnail_url)
                  : null;

              return (
                <Card
                  key={post.id}
                  className="group flex flex-col pt-0 overflow-hidden
                    border-border/50 hover:shadow-lg transition-all
                    duration-300"
                >
                  {/* Image Placeholder */}
                  <div
                    className="aspect-video bg-muted relative overflow-hidden"
                  >
                    {thumbnailSrc && (
                      <Image
                        src={thumbnailSrc}
                        alt={post.title ?? "Blog post"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    )}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/60
                        to-transparent opacity-60"
                    />
                  </div>

                  <CardHeader className="space-y-2">
                    <div
                      className="flex items-center gap-4 text-xs
                        text-muted-foreground"
                    >
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author ?? "Author"}
                      </span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group-hover:text-primary transition-colors"
                    >
                      <h3
                        className="text-xl font-bold leading-tight line-clamp-2"
                      >
                        {post.title}
                      </h3>
                    </Link>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <p
                      className="text-muted-foreground line-clamp-3 text-sm
                        leading-relaxed"
                    >
                      {post.excerpt}
                    </p>
                  </CardContent>

                  <CardFooter className="flex flex-col items-start gap-6">
                    {tags && tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.slice(0, 3).map((tag) => (
                          <button
                            key={post.id + tag}
                            type="button"
                            onClick={() => setQuery(tag)}
                            className="focus-visible:outline-none
                              focus-visible:ring-2 focus-visible:ring-ring
                              focus-visible:ring-offset-2 rounded-full"
                            aria-label={`Search posts tagged ${tag}`}
                          >
                            <Badge
                              variant="secondary"
                              className="rounded-full border border-border/60
                                bg-muted/30 text-foreground hover:bg-accent"
                            >
                              {tag}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    )}

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 font-semibold
                        text-foreground group-hover:text-primary
                        transition-colors"
                    >
                      Read the guide <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
        </div>

        {(!filteredPosts || filteredPosts.length === 0) && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              No articles found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
