import { getFaqs } from "@/lib/data/faqs";
import { FaqSearchClient } from "@/components/sections/faq-search.client";

interface FaqSearchSectionProps {
  category?: string;
  title?: string;
  description?: string;
  initialCount?: number;
  searchMode?: "client" | "server" | "hybrid";
}

export async function FaqSearchSection({
  category,
  title,
  description,
  initialCount,
  searchMode,
}: FaqSearchSectionProps) {
  const faqs = await getFaqs(category);

  if (!faqs || faqs.length === 0) return null;

  return (
    <FaqSearchClient
      category={category}
      faqs={faqs}
      title={title}
      description={description}
      initialCount={initialCount}
      searchMode={searchMode}
    />
  );
}
