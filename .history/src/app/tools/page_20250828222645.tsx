"use client";

import React from "react";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";
import ToolsGrid from "../../components/tools/ToolsGrid";
import tools from "../../components/tools/registry";

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
  const canonical = tools.filter((t) => !REMOVED_TOOL_TITLES.includes(t.title));

  return (
    <PageLayout>
      <Section className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-4">Tools & Planning Utilities</h1>
        <p className="text-blue-200 mb-6">
          Find interactive planning helpers, quick calculators, and trip planners.
          Tools on this canonical page are curated — other pages may show a random
          subset for customers.
        </p>

        <div className="mb-8">
          <ToolsGrid />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-3">Registry (for review)</h2>
          <p className="text-sm text-blue-200 mb-4">
            Below is a machine-readable list of the tools currently registered.
            Use this to decide replacements or removals.
          </p>
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
                {tools.map((t) => (
                  <tr key={t.id} className="border-t border-blue-900/30">
                    <td className="py-2 text-blue-100 align-top">{t.id}</td>
                    <td className="py-2 text-white align-top">{t.title}</td>
                    <td className="py-2 text-blue-200 align-top">
                      {t.component
                        ? "interactive"
                        : t.href
                        ? "link"
                        : "unknown"}
                    </td>
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
