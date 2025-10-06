import React from "react";
import Link from "next/link";
import { getHomeTools } from "@/lib/server/home-tools";
import ToolsGridClient from "@/components/tools/ToolsGridClient";

export default async function ToolsSection() {
  const tools = await getHomeTools();

  return (
    <section className="mt-16">
      {/* Align to the same width as polls; adjust max-w-* to match your polls container */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Tools</h2>
          <Link
            href="/tools"
            className="text-sm rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 hover:bg-white/15"
          >
            View more tools →
          </Link>
        </div>

        <ToolsGridClient tools={tools} />

        <div className="mt-6 flex justify-center">
          <Link
            href="/tools"
            className="text-sm rounded-xl border border-white/15 bg-white/10 px-4 py-2 hover:bg-white/15"
          >
            View more tools →
          </Link>
        </div>
      </div>
    </section>
  );
}
