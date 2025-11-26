import React from "react";
import { getFaqsForPage } from "@/lib/server/faqs";
import FaqSearchClient from "@/components/faqs/FaqSearchClient";

interface FleetFaqSectionProps {
  pageSlug: string;
  eyebrow: string;
  heading: string;
  description: string;
  searchInputId: string;
  searchLabel: string;
  searchPlaceholder: string;
  limit?: number;
  className?: string;
}

export default async function FleetFaqSection({
  pageSlug,
  eyebrow,
  heading,
  description,
  searchInputId,
  searchLabel,
  searchPlaceholder,
  limit = 60,
  className,
}: FleetFaqSectionProps) {
  const faqs = await getFaqsForPage(pageSlug, limit);

  if (!faqs.length) {
    return null;
  }

  return (
    <section className={`mt-16 ${className ?? ""}`}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">{heading}</h2>
          <p className="mt-4 text-base text-white/70">{description}</p>
        </div>

        <FaqSearchClient
          faqs={faqs.slice(0, 50)}
          searchInputId={searchInputId}
          searchLabel={searchLabel}
          searchPlaceholder={searchPlaceholder}
        />
      </div>
    </section>
  );
}
