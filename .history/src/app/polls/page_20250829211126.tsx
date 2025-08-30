"use client";

import React from "react";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";
import HomePolls from "../../components/HomePolls";

export default function PollsPage() {
  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      <Section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-0">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-300 via-blue-200 to-blue-400 bg-clip-text text-transparent">
              Interactive Polls
            </h1>
            <p className="text-blue-100 text-lg md:text-xl mt-3">
              Vote, see results, and explore what travelers prefer.
            </p>
          </div>

          {/* Use the new rotating HomePolls grid (3 columns × 8 picks) */}
          <div className="mt-8">
            <HomePolls />
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
