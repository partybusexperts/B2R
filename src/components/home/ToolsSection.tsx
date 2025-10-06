import React from "react";
import { getHomeTools } from "@/lib/server/home-tools";
import ToolsGridClient from "@/components/tools/ToolsGridClient";

export default async function ToolsSection() {
  const tools = await getHomeTools();
  // always render the section; client fills to 12 if fewer are present
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">Tools</h2>
        <p className="text-sm text-white/60">All tools are “Coming soon” for now.</p>
      </div>
      <ToolsGridClient tools={tools} />
    </section>
  );
}
