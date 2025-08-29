"use client";
import React, { Suspense, useState } from "react";
import ToolModalButton from "../../components/ToolModalButton";




// ToolCard: makes each legacy tool interactive and functional
function ToolCard({ tool }: { tool: Tool }) {
  const [shareCopied, setShareCopied] = useState(false);
  // For modal tool logic
  const [inputs, setInputs] = useState(() => tool.inputs ? tool.inputs.map(() => "") : []);
  const [result, setResult] = useState<any>(null);
  "use client";

  import React from "react";
  import PageLayout from "../../components/PageLayout";
  import Section from "../../components/Section";
  import ToolsGrid from "../../components/tools/ToolsGrid";
  import tools from "../../components/tools/registry";

  // Titles to hide from the canonical /tools page per product decision
  const REMOVED_TOOL_TITLES = [
    "Special Request Matcher",
    "Live Availability Checker",
    "Driver Tip Estimator",
    "Fuel Surcharge Calculator",
    "Insurance Coverage Checker",
    "Payment Plan Generator",
    "Review Aggregator",
    "Eco-Friendly Option Selector",
    "Loyalty Program Tracker",
    "Referral Bonus Calculator",
  ];

  export default function Page() {
    const canonical = tools.filter(t => !REMOVED_TOOL_TITLES.includes(t.title));

    return (
      <PageLayout>
        <Section className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4">Tools & Planning Utilities</h1>
          <p className="text-blue-200 mb-6">Find interactive planning helpers, quick calculators, and trip planners. Tools on this canonical page are curated — other pages may show a random subset for customers.</p>

          <div className="mb-8">
            <ToolsGrid />
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-3">Registry (for review)</h2>
            <p className="text-sm text-blue-200 mb-4">Below is a machine-readable list of the tools currently registered. Use this to decide replacements or removals.</p>
            <div className="bg-[#071233] border border-blue-800/40 rounded-lg p-4">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-blue-200">
                    <th className="pr-4 py-2">ID</th>
                    <th className="pr-4 py-2">Title</th>
                    <th className="pr-4 py-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {tools.map(t => (
                    <tr key={t.id} className="border-t border-blue-900/30">
                      <td className="py-2 text-blue-100 align-top">{t.id}</td>
                      <td className="py-2 text-white align-top">{t.title}</td>
                      <td className="py-2 text-blue-200 align-top">{t.component ? 'interactive' : (t.href ? 'link' : 'unknown')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>
      </PageLayout>
    );
  }
  const [search, setSearch] = useState("");
  const filteredTools = ALL_TOOLS.filter(
    t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      <div className="w-full bg-gradient-to-br from-blue-950 via-blue-900 to-black py-16 md:py-20 px-0 text-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center px-4 md:px-0">
          <h1 className="text-5xl md:text-7xl font-extrabold text-center mb-4 font-serif tracking-tight bg-gradient-to-r from-blue-300 via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            Limo & Party Bus Tools
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 text-center max-w-2xl font-medium mb-8">
            Instantly calculate, plan, and optimize your ride. Use our suite of tools for quotes, cost splits, routes, and more.
          </p>
          {/* Search Bar */}
          <div className="w-full flex justify-center mb-10">
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-blue-950/80 border border-blue-700/40 text-white placeholder-blue-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              aria-label="Search tools"
            />
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 justify-center items-stretch">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.title} tool={tool} />
            ))}
            {filteredTools.length === 0 && (
              <div className="col-span-full text-center text-blue-200 text-xl py-12">No tools found.</div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}




