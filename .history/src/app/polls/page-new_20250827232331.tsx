"use client";

import dynamic from "next/dynamic";

const PollsSection = dynamic(() => import("../../components/PollsSection"), { ssr: false });

export default function PollsPage() {
  return (
    <div className="py-20">
      <PollsSection />
    </div>
  );
}
