"use client";
import React from "react";
import ToolRunner from "@/components/ToolRunner";
import { notFound } from "next/navigation";

type Props = { params: any };

export default function ToolPage({ params }: Props) {
  // `params` is a Promise-like value in newer Next.js versions for migration.
  // Unwrap safely in a client component using React.use(params) before accessing properties.
  const { id } = React.use(params);
  // Simple guard: if id looks invalid, 404
  if (!id) return notFound();

  return (
    <main className="max-w-4xl mx-auto py-12">
      <ToolRunner toolId={id} />
    </main>
  );
}
