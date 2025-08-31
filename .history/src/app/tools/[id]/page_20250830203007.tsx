"use client";

import React from "react";
import tools from "@/components/tools/registry";
import { useParams } from "next/navigation";

export default function ToolPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const entry = (tools || []).find((t) => t.id === id);

  if (!entry) {
    return (<div className="p-8 text-white bg-[#0f1f46] min-h-screen">Tool not found.</div>);
  }

  // If the registry provides a component, render it; otherwise show a simple link.
  const C = entry.component as React.FC | undefined;
  return (
    <main className="p-8 bg-[#0f1f46] min-h-screen text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-3">{entry.title}</h1>
        <p className="text-blue-200 mb-6">{entry.desc}</p>
        {C ? <C /> : (
          <div className="space-y-4">
            <p>This tool is available at <a href={entry.href} className="underline">{entry.href}</a>.</p>
            <a href={entry.href} className="inline-block bg-blue-600 px-4 py-2 rounded text-white">Open Tool</a>
          </div>
        )}
      </div>
    </main>
  );
}
