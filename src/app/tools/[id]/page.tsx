"use client";
import React from "react";
import ToolRunner from "@/components/ToolRunner";
import { notFound } from "next/navigation";

type Params = { id?: string };
type Props = { params: Params };

export default function ToolPage({ params }: Props) {
  // `params` may be a plain object here in this client component. Access id directly.
  const id = params?.id;
  // Simple guard: if id looks invalid, 404
  if (!id) return notFound();

  return (
    <main className="max-w-4xl mx-auto py-12">
      <ToolRunner toolId={id} />
    </main>
  );
}
