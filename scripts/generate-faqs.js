const path = require("path");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY environment variable.");
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

const FAQ_PROMPT_TEMPLATE = `You are an expert FAQ generator for bus2ride.com, a party bus, limousine, and coach bus booking website.

Task:
Generate exactly 20 high-quality FAQs for the bus2ride.com {{page_type}} in {{city}}, {{state}}.

Context:
- bus2ride.com helps people book party buses, limousines, and coach buses.
- This FAQ set is specifically for {{vehicle_type}} in and around {{city}}, {{state}}.
- Mix practical booking questions, pricing expectations, what to expect day-of, safety, policies, and location-specific nuances.
- Prioritize questions that real customers would search for before booking this type of vehicle in this city.

Output format (IMPORTANT):
- Return ONLY valid JSON.
- The JSON must be an array of exactly 20 objects.
- Each object must have this exact shape:
  {
    "question": "...",
    "answer": "..."
  }
- Do not include any extra keys.
- Do not include markdown, code fences, comments, or any text outside the JSON array.
- The response must be directly parseable by JSON.parse in JavaScript without any modification.
`;

const PAGE_VARIANTS = [
  {
    key: "party-buses",
    pageTypeLabel: "party bus fleet page",
    vehicleTypeLabel: "party buses",
  },
  {
    key: "limousines",
    pageTypeLabel: "limousine fleet page",
    vehicleTypeLabel: "limousines",
  },
  {
    key: "coach-buses",
    pageTypeLabel: "coach bus fleet page",
    vehicleTypeLabel: "coach buses",
  },
];

function toTitleCaseFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseLocationSlug(locationSlug) {
  const parts = locationSlug.split("-").filter(Boolean);
  if (parts.length < 2) {
    return {
      citySlug: locationSlug,
      stateSlug: "",
    };
  }

  const stateSlug = parts[parts.length - 1];
  const citySlug = parts.slice(0, -1).join("-");

  return { citySlug, stateSlug };
}

async function getLocations() {
  const { data, error } = await supabase
    .from("locations")
    .select("slug");

  if (error) throw error;
  return (data || []).map((l) => l.slug).filter(Boolean);
}

async function generateFAQs({ citySlug, stateSlug, pageVariant }) {
  const cityName = toTitleCaseFromSlug(citySlug);
  const stateName = stateSlug ? toTitleCaseFromSlug(stateSlug) : "";

  const prompt = FAQ_PROMPT_TEMPLATE
    .replace(/{{city}}/g, cityName)
    .replace(/{{state}}/g, stateName)
    .replace(/{{page_type}}/g, pageVariant.pageTypeLabel)
    .replace(/{{vehicle_type}}/g, pageVariant.vehicleTypeLabel);

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${text}`);
  }

  const json = await res.json();
  const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("Gemini API returned no text content.");
  }

  let parsed;
  try {
    // Clean up common Gemini formatting like ```json ... ``` fences
    let cleaned = rawText.trim();

    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/i, "");
      if (cleaned.endsWith("```")) {
        cleaned = cleaned.slice(0, -3);
      }
      cleaned = cleaned.trim();
    }

    // If there is surrounding explanation text, try to grab the JSON array only
    const firstBracket = cleaned.indexOf("[");
    const lastBracket = cleaned.lastIndexOf("]");
    if (firstBracket !== -1 && lastBracket !== -1) {
      cleaned = cleaned.slice(firstBracket, lastBracket + 1).trim();
    }

    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error("Failed to parse Gemini JSON response: " + err.message);
  }

  return parsed;
}

async function faqExists(slug) {
  const { count, error } = await supabase
    .from("faqs")
    .select("id", { count: "exact", head: true })
    .eq("page_slug", slug);

  if (error) throw error;
  return (count || 0) > 0;
}

async function insertFAQs(slug, faqs) {
  const rows = faqs.map((f, i) => ({
    page_slug: slug,
    question: f.question,
    answer: f.answer,
    sort_order: i + 1,
    click_count: 0,
  }));

  const { error } = await supabase.from("faqs").insert(rows);

  if (error) throw error;
}

(async () => {
  try {
    const slugs = await getLocations();

    if (!slugs.length) {
      console.log("No locations found in 'locations' table.");
      return;
    }

    const baseSlug = slugs[0];
    const { citySlug, stateSlug } = parseLocationSlug(baseSlug);

    console.log(
      `Test run: generating FAQs for single city slug: ${baseSlug} (city=${citySlug}, state=${stateSlug})`
    );

    for (const variant of PAGE_VARIANTS) {
      const pageSlug = `${variant.key}-${citySlug}`; // e.g. party-buses-memphis

      const exists = await faqExists(pageSlug);

      if (exists) {
        console.log(`Skipping ${pageSlug} — FAQs already exist`);
        continue;
      }

      console.log(
        `Generating FAQs for ${pageSlug} (city=${citySlug}, state=${stateSlug})...`
      );

      const faqs = await generateFAQs({
        citySlug,
        stateSlug,
        pageVariant: variant,
      });

      if (!Array.isArray(faqs) || faqs.length !== 20) {
        console.warn(`Skipped ${pageSlug} — invalid response`);
        continue;
      }

      await insertFAQs(pageSlug, faqs);

      console.log(`DONE for ${pageSlug}`);
    }

    console.log("DONE (single city, all vehicle types)");
  } catch (err) {
    console.error("Error running FAQ generator:", err);
    process.exit(1);
  }
})();
