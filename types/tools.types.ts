// import { Database } from "./database.types";
// export type ToolData = Database["public"]["Tables"]["tools"]["Row"];

// TODO: This should be generated from the database schema
export interface ToolData {
  id: string;
  slug: string; // <--- NEW: vital for routing (e.g. "party-bus-calculator")
  title: string; // e.g. "Party Bus Pricing Calculator"
  description: string; // Short text shown on the card

  icon_name: string; // The exact name of the Lucide icon (e.g. "calculator", "calendar-check")
  category: string; // e.g. "pricing", "planning", "safety"

  modal_content: string | null; // The text/html to show inside the popup

  cta_text: string | null; // e.g. "Get Quote"
  cta_link: string | null; // e.g. "/quote"
}
