"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, BookOpen, Lightbulb, TrendingUp, Calendar, Shield, PartyPopper } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostsData } from "@/lib/data/blog";
import { toPublicStorageUrl } from "@/lib/helpers/storage";
import { cn } from "@/lib/utils";

const BLOG_CATEGORIES = [
  { id: "all", label: "All Articles", icon: BookOpen, color: "from-cyan-500 to-blue-500" },
  { id: "guides", label: "Guides", icon: BookOpen, color: "from-blue-500 to-indigo-500", keywords: ["guide", "how-to", "tips", "101", "complete"] },
  { id: "planning", label: "Planning", icon: Calendar, color: "from-purple-500 to-pink-500", keywords: ["planning", "plan", "organize", "book", "booking"] },
  { id: "events", label: "Events", icon: PartyPopper, color: "from-pink-500 to-rose-500", keywords: ["wedding", "prom", "party", "bachelor", "bachelorette", "birthday", "event"] },
  { id: "safety", label: "Safety", icon: Shield, color: "from-emerald-500 to-teal-500", keywords: ["safety", "safe", "tips", "avoid", "checklist"] },
  { id: "insights", label: "Industry Insights", icon: TrendingUp, color: "from-amber-500 to-orange-500", keywords: ["industry", "trend", "news", "pricing", "cost"] },
];

interface BlogGridClientProps {
  posts: PostsData;
}

export function BlogGridClient({ posts }: BlogGridClientProps) {
  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  
  const allPosts = posts ?? [];

  const categorizePost = React.useCallback((post: NonNullable<PostsData>[number]) => {
    const searchText = `${post.title} ${post.slug} ${post.excerpt || ""} ${(post.tags || []).join(" ")}`.toLowerCase();
    
    for (const cat of BLOG_CATEGORIES) {
      if (cat.id === "all") continue;
      if (cat.keywords?.some(kw => searchText.includes(kw))) {
        return cat.id;
      }
    }
    return "guides";
  }, []);

  const postsByCategory = React.useMemo(() => {
    const grouped: Record<string, NonNullable<PostsData>> = {};
    
    allPosts.forEach((post) => {
      const category = categorizePost(post);
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(post);
    });
    
    return grouped;
  }, [allPosts, categorizePost]);

  const filteredPosts = React.useMemo(() => {
    let filtered = allPosts;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => categorizePost(post) === selectedCategory);
    }
    
    if (query.trim()) {
      const normalized = query.trim().toLowerCase();
      filtered = filtered.filter((post) =>
        post.title?.toLowerCase().includes(normalized) ||
        post.slug?.toLowerCase().includes(normalized) ||
        post.excerpt?.toLowerCase().includes(normalized) ||
        post.tags?.some(tag => tag.toLowerCase().includes(normalized))
      );
    }
    
    return filtered;
  }, [query, selectedCategory, allPosts, categorizePost]);

  return (
    <section className="py-16 bg-gradient-to-b from-[#060e23] to-[#0a1628]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-300">
              Browse Articles
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Find Your Guide
          </h2>
          <p className="text-blue-200/60 max-w-xl mx-auto text-sm">
            {allPosts.length} articles with planning tips, booking advice, and industry insights
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300/50" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, guides, tips..."
              className="h-14 w-full rounded-full bg-[#0f1f46] text-blue-50 text-lg border-2 border-cyan-500/30 pl-14 pr-14 placeholder:text-blue-300/40 focus:border-cyan-400/60 focus:ring-cyan-400/20"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {BLOG_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            const count = cat.id === "all" ? allPosts.length : (postsByCategory[cat.id]?.length || 0);
            
            if (cat.id !== "all" && count === 0) return null;
            
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  isActive
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  isActive ? "bg-white/20" : "bg-white/10"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {(query || selectedCategory !== "all") && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-blue-200/70">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""} found
              {selectedCategory !== "all" && ` in ${BLOG_CATEGORIES.find(c => c.id === selectedCategory)?.label}`}
              {query && ` matching "${query}"`}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                setSelectedCategory("all");
              }}
              className="text-cyan-300 hover:text-white"
            >
              Clear filters
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const date = post.published_at 
              ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "";
            
            const thumbnailSrc = post.thumbnail_url && post.thumbnail_url.trim().length > 0
              ? toPublicStorageUrl("Blog", post.thumbnail_url)
              : null;

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b1d3c] via-[#0a1730] to-[#050b18] overflow-hidden transition hover:-translate-y-1 hover:shadow-xl hover:border-cyan-500/30">
                  {thumbnailSrc && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={thumbnailSrc}
                        alt={post.title || "Blog post"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/70">
                        <span className="uppercase tracking-wide font-medium">Article</span>
                        {date && <span>{date}</span>}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                    
                    {post.excerpt && (
                      <p className="text-sm text-white/60 line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/70"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm font-medium text-cyan-400 group-hover:text-cyan-300">
                      <span>Read article</span>
                      <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/50 text-lg">No articles found matching your search</p>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 rounded-full border-white/20 text-white hover:bg-white/10"
            >
              Browse all articles
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
