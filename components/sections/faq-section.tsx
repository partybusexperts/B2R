import { FaqClient } from "./faq-client";
import { Button } from "@/components/ui/button";
import { getFaqs } from "@/lib/data/faqs";
import Link from "next/link";

interface FaqSectionProps {
  category: string;
  title?: string;
}

export async function FaqSection({
  category,
  title = "Frequently Asked Questions",
}: FaqSectionProps) {
  const faqs = await getFaqs(category);

  if (!faqs) return null;

  return (
    <section className="py-20 md:py-24 bg-[#0E1F46]">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">
            Got questions?
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base text-white/70 text-center">
            Search across the 50 most common things riders ask before they book.
            Everything is curated directly from real conversations, so you get
            honest answers fast.
          </p>
        </div>

        {/* FAQ List - No outer card, just the list */}
        <div className="mx-auto">
          <FaqClient faqs={faqs} />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm mb-3">
            Still have questions?
          </p>
          <Button
            variant="outline"
            asChild
            className="rounded-xl font-bold border-primary/20 hover:bg-primary/5
              hover:text-primary"
          >
            <Link href="/faq">Visit our Help Center</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
