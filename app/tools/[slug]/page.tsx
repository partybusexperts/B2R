import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/data/tools";
import { renderToolComponent } from "@/components/sections/tools-registry";
import Hero from "@/components/layout/hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    return pageMetadata({
      title: "Tool Not Found",
      description: "This tool doesn’t exist or may have moved.",
      noIndex: true,
    });
  }

  return pageMetadata({
    title: tool.title ?? "Tool",
    description: (tool.description ?? "").trim() || undefined,
    path: `/tools/${tool.slug}`,
  });
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) return notFound();

  return (
    <main>
      {/* 1. Reusing your Hero component, or a custom mini-hero */}
      <Hero
        slug="tools" // or pass a custom "tool-detail" slug if you have specific images
      />

      <div className="container mx-auto px-4 md:px-6 mb-12 relative z-10">
        <Button
          variant="outline"
          className="mb-8 bg-background/50 backdrop-blur-md"
          asChild
        >
          <Link href="/tools">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Tools
          </Link>
        </Button>

        {/* 2. Tool Content Container */}
        <div
          className="bg-background rounded-3xl shadow-xl border border-border/50
            p-6 md:p-12"
        >
          {/* 3. Render the specific tool from Registry */}
          {renderToolComponent(slug, tool)}
        </div>
      </div>
    </main>
  );
}
