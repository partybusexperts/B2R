import React from "react";
import { fetchHomePage } from "@/lib/pages";
import { renderBlock } from "@/components/blocks/registry";

type Block = { slug?: string; [key: string]: unknown };

// Minimal server component: fetch page definition and render its blocks
export default async function Home(): Promise<JSX.Element> {
  const data = await fetchHomePage();
  if (!data) {
    return <main className="p-8">No page found.</main>;
  }
  return (
    <main className="space-y-6 p-4">
      {data.blocks.map((b: Block, i: number) => (
        <div key={(b.slug as string) ?? i}>{renderBlock(b as any)}</div>
      ))}
    </main>
  );
}
