import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export const mockFaqs: FaqData[] = [
  {
    id: "1",
    question: "What is your name?",
    answer: "My name is John Doe.",
    page_slug: "home",
    click_count: 10,
    sort_order: 1,
    created_at: "2023-10-15T14:30:00Z",
    updated_at: "2023-10-15T14:30:00Z",
  },
  {
    id: "2",
    question: "What is your age?",
    answer: "I am 30 years old.",
    page_slug: "home",
    click_count: 5,
    sort_order: 2,
    created_at: "2023-10-15T14:30:00Z",
    updated_at: "2023-10-15T14:30:00Z",
  },
  {
    id: "3",
    question: "How can I book a vehicle?",
    answer:
      "You can book a vehicle through our website by selecting your desired vehicle and filling out the booking form.",
    page_slug: "home",
    click_count: 8,
    sort_order: 3,
    created_at: "2023-10-15T14:30:00Z",
    updated_at: "2023-10-15T14:30:00Z",
  },
  {
    id: "4",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers.",
    page_slug: "home",
    click_count: 12,
    sort_order: 4,
    created_at: "2023-10-15T14:30:00Z",
    updated_at: "2023-10-15T14:30:00Z",
  },
  {
    id: "5",
    question: "Can I cancel my booking?",
    answer:
      "Yes, you can cancel your booking up to 48 hours before the scheduled time for a full refund.",
    page_slug: "home",
    click_count: 6,
    sort_order: 5,
    created_at: "2023-10-15T14:30:00Z",
    updated_at: "2023-10-15T14:30:00Z",
  },
  {
    id: "6",
    question: "What is your cancellation policy?",
    answer:
      "Cancellations made less than 48 hours in advance will incur a 50% cancellation fee.",
    page_slug: "home",
    click_count: 4,
    sort_order: 6,
    created_at: "2023-10-15T14:30:00Z",
    updated_at: "2023-10-15T14:30:00Z",
  },
  {
    id: "7",
    question: "Do you provide chauffeurs?",
    answer:
      "Yes, all our vehicles come with a professional chauffeur included in the price.",
    page_slug: "home",
    click_count: 15,
    sort_order: 7,
    created_at: "2023-10-15T14:30:00Z",
    updated_at: "2023-10-15T14:30:00Z",
  },
  {
    id: "8",
    question: "What are the capacity limits for your vehicles?",
    answer:
      "Our vehicles can accommodate groups ranging from 10 to 50 passengers, depending on the type of vehicle.",
    page_slug: "home",
    click_count: 9,

    sort_order: 8,
    created_at: "2023-10-15T14:30:00Z",
    updated_at: "2023-10-15T14:30:00Z",
  },
  {
    id: "9",
    question: "What is your refund policy?",
    answer: "What is your refund policy?",
    page_slug: "home",
    click_count: 10,
    sort_order: 9,
    created_at: "2023-10-15T14:30:00Z",
    updated_at: "2023-10-15T14:30:00Z",
  },
];

export const getFaqs = cache(async (slug?: string, limit?: number) => {
  const supabase = await createClient();

  let request = supabase
    .from("faqs")
    .select("*")
    .order("click_count", { ascending: false, nullsFirst: false }); // Show most popular first

  if (slug) {
    request = request.ilike("page_slug", `%${slug}%`);
  }

  if (limit) {
    request = request.limit(limit);
  }

  const { data: faqs, error } = await request;

  if (error) {
    console.error("getFaqs:", error);
    return null;
  }

  if (!faqs) {
    console.warn("getFaqs:", "No data found");
    return null;
  }

  return faqs;
});

export async function searchFaqsBySlug({
  slug,
  query = "",
  limit,
}: {
  slug?: string;
  query?: string;
  limit?: number;
}) {
  const supabase = await createClient();

  const trimmedQuery = query.trim();
  // Supabase `.or()` filters are string-parsed; avoid commas/parens breaking it.
  const safeQuery = trimmedQuery.replace(/[(),]/g, " ").replace(/\s+/g, " ");

  let request = supabase
    .from("faqs")
    .select("*")
    .order("click_count", { ascending: false, nullsFirst: false });

  if (slug) {
    request = request.ilike("page_slug", `%${slug}%`);
  }

  if (limit) {
    request = request.limit(limit);
  }

  if (safeQuery.length > 0) {
    const pattern = `%${safeQuery}%`;
    request = request.or(`question.ilike.${pattern},answer.ilike.${pattern}`);
  }

  const { data, error } = await request;

  if (error) {
    console.error("searchFaqsBySlug:", error);
    return [];
  }

  return data ?? [];
}

export type FaqData = NonNullable<Awaited<ReturnType<typeof getFaqs>>>[number];
