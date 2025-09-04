"use client";
import React from "react";
import ToolRunner from "@/components/ToolRunner";
import { notFound } from "next/navigation";

type Props = { params: { id: string } };

export default function ToolPage({ params }: Props) {
  const { id } = params;
  // Simple guard: if id looks invalid, 404
  if (!id) return notFound();

  return (
    <main className="max-w-4xl mx-auto py-12">
      <ToolRunner toolId={id} />
    </main>
  );
}
