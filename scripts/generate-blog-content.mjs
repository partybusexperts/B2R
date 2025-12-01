import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { blogPostMeta } from "./blogPosts.meta.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STOP_WORDS = new Set(["the", "a", "an", "and", "or", "for", "to", "of", "by", "vs", "with", "how", "on", "in"]);

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

const buildSlugPhrase = (slug) => {
  const keywords = slug
    .split("-")
    .filter((segment) => segment && !STOP_WORDS.has(segment))
    .slice(0, 4)
    .map((segment) => capitalize(segment.replace(/_/g, " ")));
  return keywords.length ? keywords.join(", ") : "comfort, timing, safety";
};

const sentencesToParagraph = (sentences) => sentences.join(" ");

const buildParagraphs = (meta) => {
  const slugPhrase = buildSlugPhrase(meta.slug);
  const keywordPhrase = meta.keywords.join(", ");

  const introParagraph = sentencesToParagraph([
    `It is easy to romanticize ${meta.title.toLowerCase()}, but ${meta.introHook}`,
    `Bus2Ride treats every transport storyboard as a live operations document where each promise has an owner and a timestamp.`,
    `We convert the directional keywords you keep repeating—${slugPhrase}—into routing guardrails, staffing ratios, and guest communications.`,
    `That discipline keeps stakeholders aligned even when celebrity handlers, weather alerts, or late sponsor asks enter the chat at the last minute.`,
    `By defining success through rider outcomes instead of vehicle specs, the rest of the planning stack becomes calmer and measurably more resilient.`,
    `The goal is a weekend or single-night move that still feels effortless to guests while your logistics brain knows every variable has a backup.`,
  ]);

  const planningParagraph = sentencesToParagraph([
    `Planning begins weeks upstream with discovery calls, forms, and scouting drives anchored around ${meta.planningFocus}.`,
    `We map each traveler persona against the run of show so no one is surprised by attire changes, ADA requirements, or last minute VIP arrivals.`,
    `Our producers draft layered itineraries that explain who greets whom, which curb is primary versus fallback, and what copy needs to be printed for signage.`,
    `That documentation lets executives, wedding planners, campus staff, or brand teams sign off quickly because they can see the downstream effect of every choice.`,
    `We also log no-go rules—the songs that must play, the neighborhoods to avoid, the shots the photographer is chasing—so host energy stays protected.`,
    `When the planning stack reaches that clarity, even complex ${keywordPhrase} programs feel approachable.`,
  ]);

  const logisticsParagraph = sentencesToParagraph([
    `Logistics rehearsal focuses on ${meta.logisticsFocus} and the unglamorous tasks that actually preserve timelines.`,
    `We confirm permits, credential needs, and staging pads with photos, measurements, and contacts so the driver handshake is more than a blind guess.`,
    `Dispatch receives scenario scripts for weather, traffic gridlock, or celebrity security tweaks, and we mirror those scripts for the host team.`,
    `Every loop has a dwell budget, fuel plan, restroom strategy, and spare vehicle logic documented in plain English.`,
    `Because our on-site captains have direct radio or WhatsApp channels with chauffeurs, we can pulse information before a delay becomes a stall.`,
    `That muscle memory turns potential chaos into small course corrections riders never notice.`,
  ]);

  const amenitiesParagraph = sentencesToParagraph([
    `Amenities are curated intentionally instead of sprinkled randomly, with the spotlight on ${meta.amenitiesFocus}.`,
    `We compare rider avatars against cabin layouts to decide where hydration stations, photo props, vow cards, or merch drops should live.`,
    `Hosts receive a diagram that labels every comfort touch so they know what to hype on the mic, what to protect from overuse, and when to refresh each zone.`,
    `When a vehicle swap happens, our amenity trunks and digital signage kits move too, which keeps the vibe consistent.`,
    `We also script how chauffeurs or onboard concierges introduce the upgrades so the spend feels premium rather than gimmicky.`,
    `Done right, the amenities quietly accelerate boarding, encourage social sharing, and keep the story cohesive from stop to stop.`,
  ]);

  const budgetParagraph = sentencesToParagraph([
    `Budget modeling is transparent because we tie every dollar to a measurable constraint, especially around ${meta.budgetFocus}.`,
    `Finance leaders see the decision matrix that compares doing nothing, DIY attempts, or hiring the operator to handle it turnkey.`,
    `We highlight the costs of failure—injury claims, overtime spirals, missed sponsorship impressions—so approvals feel logical, not emotional.`,
    `During build-out we log which lines are flexible and which are sacred, making it easier to pivot if the group size or routing changes.`,
    `Deposits, milestone payments, and gratuity plans are stored in a single tracker to prevent the dreaded text chain of “who still owes what.”`,
    `With that clarity, stakeholders stay calm even when the scope evolves because they understand the tradeoffs.`,
  ]);

  const experienceParagraph = sentencesToParagraph([
    `Experience design pulls everything together with ${meta.experienceFocus} so guests feel guided instead of herded.`,
    `We coach emcees, chauffeurs, and onboard crew on language that is inclusive, celebratory, and sensitive to the group’s culture.`,
    `Live comms go out through SMS, WhatsApp, and QR-enabled microsites so riders always know where to stand, what is next, and who to text for help.`,
    `Our media team stages photo or video beats that match the narrative arc, whether that is a reveal moment, a toast, or a chill reset.`,
    `Post-trip surveys gather candid feedback plus testimonials the client can reuse internally, giving the transportation line item long-tail value.`,
    `When riders feel seen at every touchpoint, the charter becomes part of the story instead of just a shuttle.`,
  ]);

  const closingParagraph = sentencesToParagraph([
    `If you want this level of rigor for your own ${meta.title.toLowerCase()}, tap the Bus2Ride concierge team and we will adapt the playbook to your city.`,
    `We can collaborate directly with venues, production partners, hotels, or corporate travel managers and share our dashboards so everyone watches the same KPIs.`,
    `Send a quick brief to info@bus2ride.com or call (888) 535-2566, and we will workshop route ideas, budgets, and backup plans in the first conversation.`,
    `From there we lock in the exact fleet mix, staffing model, and amenity set that makes your brand, family, or fan base feel unstoppable.`,
  ]);

  return [introParagraph, planningParagraph, logisticsParagraph, amenitiesParagraph, budgetParagraph, experienceParagraph, closingParagraph];
};

const postsWithContent = blogPostMeta.map((entry) => {
  const paragraphs = buildParagraphs(entry);
  const content = paragraphs.join("\n\n");
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return {
    id: entry.slug,
    slug: entry.slug,
    title: entry.title,
    excerpt: entry.excerpt,
    content,
    wordCount,
    thumbnail_url: entry.thumbnail,
    published_at: entry.publishedAt,
    created_at: entry.publishedAt,
    updated_at: entry.publishedAt,
    keywords: entry.keywords,
    introHook: entry.introHook,
    planningFocus: entry.planningFocus,
    logisticsFocus: entry.logisticsFocus,
    amenitiesFocus: entry.amenitiesFocus,
    budgetFocus: entry.budgetFocus,
    experienceFocus: entry.experienceFocus,
  };
});

const outputPath = path.resolve(__dirname, "../src/data/blogPosts.generated.json");
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify(postsWithContent, null, 2));

const minWordCount = Math.min(...postsWithContent.map((post) => post.wordCount));
const maxWordCount = Math.max(...postsWithContent.map((post) => post.wordCount));

console.log(`Generated ${postsWithContent.length} posts with word counts between ${minWordCount} and ${maxWordCount}.`);
console.log(`Saved to ${path.relative(process.cwd(), outputPath)}.`);
