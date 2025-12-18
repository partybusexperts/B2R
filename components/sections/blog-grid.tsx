"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
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
    <section className="max-w-6xl mx-auto px-4 py-16 space-y-12 bg-[#0E1F46]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="space-y-3 text-center md:text-left mb-12">
          <p
            className="text-xs md:text-sm uppercase tracking-[0.35em]
              text-sky-400"
          >
            Bus2Ride Insider
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold leading-tight text-white"
          >
            Playbooks for Every Ride
          </h2>
          <p className="text-slate-300 max-w-3xl text-base md:text-lg">
            Deep dives, checklists, and operations war stories from the crews
            who keep party buses, limos, and shuttles running. Every article
            ships with 750+ words of tactics so your next run feels cinematic,
            not chaotic.
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
                  month: "numeric",
                  day: "numeric",
                },
              );

              const thumbnailSrc =
                post.thumbnail_url && post.thumbnail_url.trim().length > 0
                  ? toPublicStorageUrl("Blog", post.thumbnail_url)
                  : null;

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block h-full"
                >
                  <Card
                    key={post.id}
                    className="relative flex h-full flex-col overflow-hidden
                      rounded-[32px] border border-white/10 bg-gradient-to-b
                      from-slate-950/80 to-slate-900/80
                      shadow-[0_25px_80px_rgba(2,8,23,0.55)] transition-all
                      duration-300 group-hover:-translate-y-1 py-0
                      group-hover:border-sky-400/60"
                  >
                    {/* Image */}
                    <div
                      className="relative aspect-[4/2.1] w-full overflow-hidden
                        bg-slate-900"
                    >
                      {thumbnailSrc && (
                        <Image
                          src={thumbnailSrc}
                          alt={post.title ?? "Blog post"}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="h-full w-full object-cover transition
                            duration-500 group-hover:scale-[1.04]"
                        />
                      )}

                      <div
                        className="pointer-events-none absolute inset-0
                          bg-gradient-to-b from-black/10 via-transparent
                          to-black/60"
                      />

                      {/* Top overlay */}
                      <div
                        className="absolute inset-x-0 bottom-0 flex items-center
                          justify-between px-5 py-3 text-[0.65rem] font-semibold
                          uppercase tracking-[0.3em] text-white/80"
                      >
                        <span>PLAYBOOK</span>
                        <span>{date}</span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                      <h2
                        className="text-2xl font-semibold text-white/95
                          group-hover:text-sky-100"
                      >
                        {post.title}
                      </h2>

                      <p
                        className="mt-3 text-sm md:text-base text-slate-200
                          leading-relaxed"
                      >
                        {post.excerpt}
                      </p>

                      {tags && tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {tags.slice(0, 3).map((tag) => (
                            <button
                              key={post.id + tag}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setQuery(tag);
                              }}
                              className="rounded-full focus-visible:outline-none
                                focus-visible:ring-2 focus-visible:ring-white/30
                                inset-0"
                              aria-label={`Search posts tagged ${tag}`}
                            >
                              <Badge
                                variant="secondary"
                                className="rounded-full border border-white/15
                                  bg-white/5 px-3 py-1 text-xs font-semibold
                                  tracking-wide text-slate-100"
                              >
                                {tag}
                              </Badge>
                            </button>
                          ))}
                        </div>
                      )}

                      <div
                        className="mt-auto pt-6 flex items-center gap-2 text-sm
                          font-semibold text-sky-300 group-hover:text-white"
                      >
                        <span>Read the guide</span>
                        <span aria-hidden="true">→</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
        </div>

        {!filteredPosts && (
          <div className="text-center py-20">
            <p className="text-xl text-blue-100">
              No articles found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
