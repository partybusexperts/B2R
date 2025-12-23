import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

const mockTools = [
  {
    id: "mock-t1",
    slug: "party-bus-pricing-calculator",
    title: "Party Bus Pricing Calculator", // e.g. "Party Bus Pricing Calculator"
    description: "Estimate the cost of renting a party bus for your event.", // Short text shown on the card

    icon_name: "calculator", // The exact name of the Lucide icon (e.g. "calculator", "calendar-check")
    category: "pricing", // e.g. "pricing", "planning", "safety"

    modal_content:
      "Use our Party Bus Pricing Calculator to estimate the cost of renting a party bus for your event. Enter the number of guests and the duration of your event to get an instant quote.", // The text/html to show inside the popup

    cta_text: "Get Quote", // e.g. "Get Quote"
    cta_link: "/tools/pricing",

    href: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-t2",
    slug: "event-planning-checklist",
    title: "Event Planning Checklist", // e.g. "Event Planning Checklist"
    description: "Create a detailed checklist for your event planning.", // Short text shown on the card

    icon_name: "check-square", // The exact name of the Lucide icon (e.g. "check-square", "calendar-check")
    category: "planning", // e.g. "pricing", "planning", "safety"

    modal_content:
      "Use our Event Planning Checklist to create a detailed checklist for your event planning. This tool helps you stay organized and ensures that you don't forget anything important.", // The text/html to show inside the popup

    cta_text: "Create Checklist", // e.g. "Create Checklist"
    cta_link: "/tools/checklist",
    href: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-t3",
    slug: "event-safety-guide",
    title: "Event Safety Guide", // e.g. "Event Safety Guide"
    description: "Get a comprehensive safety guide for your event.", // Short text shown on the card

    icon_name: "shield-check", // The exact name of the Lucide icon (e.g. "shield-check", "calendar-check")
    category: "safety", // e.g. "pricing", "planning", "safety"

    modal_content:
      "Use our Event Safety Guide to get a comprehensive safety guide for your event. This tool provides essential safety tips and guidelines to ensure the well-being of all attendees.", // The text/html to show inside the popup

    cta_text: "View Guide", // e.g. "View Guide"
    cta_link: "/tools/safety-guide",

    href: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-t4",
    slug: "venue-selection",
    title: "Venue Selection Tool", // e.g. "Venue Selection Tool"
    description:
      "Find the perfect venue for your event with our Venue Selection Tool.", // Short text shown on the card

    icon_name: "map-pin", // The exact name of the Lucide icon (e.g. "map-pin", "calendar-check")
    category: "planning", // e.g. "pricing", "planning", "safety"

    modal_content:
      "Use our Venue Selection Tool to find the perfect venue for your event. This tool helps you compare different venues based on your requirements and provides detailed information about each option.", // The text/html to show inside the popup

    cta_text: "Find Venue", // e.g. "Find Venue"
    cta_link: "/tools/venue-selection",

    href: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-t5",
    slug: "catering-options",
    title: "Catering Options", // e.g. "Catering Options"
    description: "Explore various catering options for your event.", // Short text shown on the card

    icon_name: "utensils", // The exact name of the Lucide icon (e.g. "utensils", "calendar-check")
    category: "planning", // e.g. "pricing", "planning", "safety"

    modal_content:
      "Use our Catering Options tool to explore various catering options for your event. This tool provides a wide range of catering services and helps you choose the best option based on your requirements.", // The text/html to show inside the popup

    cta_text: "Explore Options", // e.g. "Explore Options"
    cta_link: "/tools/catering-options",

    href: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-t6",
    slug: "event-budgeting",
    title: "Event Budgeting Tool", // e.g. "Event Budgeting Tool"
    description: "Plan your event budget with our Event Budgeting Tool.", // Short text shown on the card

    icon_name: "dollar-sign", // The exact name of the Lucide icon (e.g. "dollar-sign", "calendar-check")
    category: "pricing", // e.g. "pricing", "planning", "safety"

    modal_content:
      "Use our Event Budgeting Tool to plan your event budget. This tool helps you create a detailed budget, track expenses, and ensure that you stay within your budget limits.", // The text/html to show inside the popup

    cta_text: "Plan Budget", // e.g. "Plan Budget"
    cta_link: "/tools/event-budgeting",

    href: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const getTools = cache(async (limit?: number) => {
  const supabase = await createClient();

  // Fetch tools
  let request = supabase.from("tools").select("*");

  if (limit) {
    request = request.limit(limit);
  }

  const { data: tools, error } = await request;

  if (error) {
    console.error("getTools:", error);
    return mockTools;
  }

  if (!tools) {
    console.warn("getTools:", "No data found");
    return mockTools;
  }

  if (tools) {
    return mockTools;
  }

  return tools;
});

export const getToolsByCategory = cache(
  async (category: string): Promise<ToolData[]> => {
    const supabase = await createClient();

    // Fetch tools
    const { data: toolsByCategory, error } = await supabase
      .from("tools")
      .select("*")
      .eq("category", category);

    if (error) {
      console.error("getToolsByCategory:", error);
      return mockTools.filter((t) => t.category === category);
    }

    if (!toolsByCategory) {
      console.warn("getToolsByCategory:", "No data found");
      return mockTools.filter((t) => t.category === category);
    }

    if (toolsByCategory) {
      return mockTools.filter((t) => t.category === category);
    }

    return toolsByCategory;
  },
);

export const getToolBySlug = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data: toolBySlug, error } = await supabase
    .from("tools")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("getToolBySlug:", error);
    return mockTools.find((t) => t.slug === slug);
  }

  if (!toolBySlug) {
    console.warn("getToolBySlug:", "No data found");
    return mockTools.find((t) => t.slug === slug);
  }

  if (toolBySlug) {
    return mockTools.find((t) => t.slug === slug);
  }

  return toolBySlug;
});

export type ToolData = NonNullable<Awaited<ReturnType<typeof getToolBySlug>>>;

// FIXME: All tools are mocked
