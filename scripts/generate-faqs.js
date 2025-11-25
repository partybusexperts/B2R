import 'dotenv/config';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const TARGET_FAQ_COUNT = 50;
const MAX_ATTEMPTS = 3;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// All of your main pages + FAQ topics
const PAGES = [
  {
    slug: 'home',
    title: 'Homepage',
    topic: `General Bus2Ride overview. Combine all main themes: what Bus2Ride does, nationwide coverage, what kinds of vehicles and events you handle, how quoting and booking work, safety, refunds, and why someone should trust and use Bus2Ride. Use the sub-themes: Overview, Coverage, Quoting & Pricing, Safety & Policies, Booking & Events, Refunds & Support.`
  },
  {
    slug: 'party-buses',
    title: 'Party Bus Fleet',
    topic: `All about party buses. Use sub-themes: Features & Amenities, Rules & Policies, Events & Itineraries, Pricing & Payments, Booking Process, Safety & Conduct. Emphasize capacities, lighting, sound, dance poles, BYOB rules, event types (birthdays, bachelor/bachelorette, concerts, games), overtime, and safety on nightlife trips.`
  },
  {
    slug: 'limousines',
    title: 'Limousine Fleet',
    topic: `Limo-specific questions. Use sub-themes: Limo Models & Amenities, Weddings & Proms, Airport & Corporate Transfers, Pricing & Packages, Rules & Dress Code, Booking & Timing, Safety & Comfort.`
  },
  {
    slug: 'coach-buses',
    title: 'Coach Bus Fleet',
    topic: `Coach and charter buses for large groups. Use sub-themes: Capacity & Luggage, Restrooms & Comfort, Long-Distance & Multi-Day Trips, School & Team Travel, Pricing & Fuel/Distance, Safety & Regulations, Route Planning & Stops.`
  },
  {
    slug: 'events',
    title: 'Events',
    topic: `By-event FAQs. Use sub-themes: Weddings, Proms, Bachelor/Bachelorette, Birthdays, Corporate Events, Concerts & Festivals, Wine Tours, Game Days, Misc/Other. For each, cover timing, recommended booking lead time, pickup/drop-off logistics, overtime, multiple stops, and planning tips.`
  },
  {
    slug: 'pricing',
    title: 'Pricing',
    topic: `Deep pricing questions. Use sub-themes: Hourly vs Packages, Deposits, Overtime, Taxes & Fees, Peak Dates (prom, NYE), Distance & Drive Time, Discounts & Deals, Quotes vs Contracts, Avoiding Hidden Fees.`
  },
  {
    slug: 'locations',
    title: 'Locations',
    topic: `Coverage and travel fees. Use sub-themes: Service Areas (major metros + smaller cities), Rural/Out-of-Area Pickups, Cross-State Trips, Travel & Drive-Time Fees, Multiple Pickups/Stops, Adding New Locations, Safety in Different Areas.`
  },
  {
    slug: 'polls',
    title: 'Polls',
    topic: `Poll system. Use sub-themes: Why Bus2Ride uses polls, How to Vote, Anonymity & Privacy, How Often New Polls Appear, How Results Are Used, Suggesting New Polls, Sharing Polls, Tech/Account Issues with Polls.`
  },
  {
    slug: 'blog',
    title: 'Blog',
    topic: `Blog content. Use sub-themes: Types of Posts (guides, tips, stories), Posting Frequency, Who Writes Posts, Guest Posts & Contributions, How to Use Blog Posts to Plan Trips, Sharing & Linking Articles, Sponsored Content & Transparency.`
  },
  {
    slug: 'tools',
    title: 'Tools',
    topic: `Online calculators and planners. Use sub-themes: Budget & Cost Estimators, Hours vs Distance Tools, Split-the-Bill Tools, Event Planning Checklists, Accuracy & Assumptions, How to Go from Tool → Real Quote, Saving & Sharing Results.`
  },
  {
    slug: 'industry-secrets',
    title: 'Industry Secrets',
    topic: `“Tell-all” style FAQs. Use sub-themes: Common Scams, Bait-and-Switch Photos, Hidden Fees, Unsafely Run Companies, How to Vet Providers, Best Times/Strategies to Book, How Bus2Ride Protects Customers, Myths vs Reality.`
  },
  {
    slug: 'poll-results',
    title: 'Poll Results',
    topic: `Poll results pages. Use sub-themes: How Results Are Calculated, Update Frequency, Sample Size & Representativeness, City vs National Breakdown, How to Interpret Charts/Tables, Using Data to Plan Trips, Data Privacy.`
  },
  {
    slug: 'reviews',
    title: 'Reviews',
    topic: `Reviews & testimonials. Use sub-themes: Where Reviews Come From, How Bus2Ride Handles Fake/Abusive Reviews, Incentives (if any), How to Read Reviews Smartly, Responding to Bad Experiences, Sharing Your Own Review.`
  },
  {
    slug: 'contact',
    title: 'Contact',
    topic: `Contact and quoting. Use sub-themes: Best Ways to Reach Bus2Ride (phone, email, text, form), What Info to Include, Response Times & Business Hours, Urgent/Last-Minute Trips, What Happens After You Send a Request, Changing or Updating Details, Support for Problems/Complaints.`
  }
];

async function requestFaqBatch(page, attemptNumber) {
  const { slug, title, topic } = page;

  console.log(`Requesting batch (attempt ${attemptNumber}) for [${slug}]`);

  const userPrompt = `
Create EXACTLY ${TARGET_FAQ_COUNT} unique frequently asked questions and answers for the "${title}" page of the Bus2Ride website.

PAGE TOPIC AND SUB-THEMES:
${topic}

GOAL:
- Questions should sound like real customers asking in plain language.
- Answers should be clear, conversational, and helpful.
- Always keep the focus on the specific page ("${title}") and how it fits into the Bus2Ride experience.
- You may reuse concepts from other pages (like booking, pricing, safety) but the wording and angle must feel specific to this page.

STYLE:
- Friendly, confident, and no-BS, aligned with a transparent, customer-advocate brand.
- Avoid specific dollar amounts or legal claims. Talk in ranges or general rules of thumb instead.
- Mention "Bus2Ride" naturally where it makes sense.
- Each answer should be 2–5 sentences max.

OUTPUT FORMAT (IMPORTANT):
Return ONLY a JSON object with this shape:

{
  "faqs": [
    { "question": "Question 1?", "answer": "Answer 1..." },
    { "question": "Question 2?", "answer": "Answer 2..." },
    ...
  ]
}

RULES:
- The "faqs" array MUST contain EXACTLY ${TARGET_FAQ_COUNT} items.
- If you return more or fewer than ${TARGET_FAQ_COUNT}, the job will fail and you will be asked again.
- Do NOT include comments, trailing commas, or any text before or after the JSON.
- Do NOT include any keys other than "faqs", "question", and "answer".
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You are a professional copywriter generating FAQs for a party bus and limo website. Always obey JSON formatting instructions exactly.'
      },
      { role: 'user', content: userPrompt }
    ]
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error(`Empty response from OpenAI for slug: ${slug}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    console.error('Failed to parse JSON from OpenAI for slug:', slug);
    console.error('Raw content:', content);
    throw err;
  }

  const faqs = parsed.faqs;
  if (!Array.isArray(faqs)) {
    throw new Error(`Response for slug ${slug} did not contain a "faqs" array.`);
  }

  return faqs;
}

async function generateFaqsForPage(page) {
  const { slug, title } = page;
  console.log(`\n=== Generating FAQs for [${slug}] (${title}) ===`);

  let faqs = [];
  let attempt = 1;

  while (attempt <= MAX_ATTEMPTS) {
    faqs = await requestFaqBatch(page, attempt);
    console.log(`Got ${faqs.length} FAQs on attempt ${attempt} for [${slug}]`);

    if (faqs.length === TARGET_FAQ_COUNT) {
      break;
    }

    attempt += 1;
  }

  if (faqs.length !== TARGET_FAQ_COUNT) {
    console.error(
      `❌ Failed to get exactly ${TARGET_FAQ_COUNT} FAQs for [${slug}] after ${MAX_ATTEMPTS} attempts. Skipping this page.`
    );
    return;
  }

  if (faqs.length > TARGET_FAQ_COUNT) {
    faqs = faqs.slice(0, TARGET_FAQ_COUNT);
  }

  console.log(`✅ Finalized ${faqs.length} FAQs for [${slug}]. Deleting old rows...`);

  const { error: deleteError } = await supabase
    .from('faqs')
    .delete()
    .eq('page_slug', slug);

  if (deleteError) {
    console.error(`Error deleting existing FAQs for [${slug}]:`, deleteError);
    return;
  }

  const rows = faqs.map((item, index) => ({
    page_slug: slug,
    question: item.question,
    answer: item.answer,
    sort_order: index + 1
  }));

  const { error: insertError } = await supabase.from('faqs').insert(rows);

  if (insertError) {
    console.error(`Supabase insert error for [${slug}]:`, insertError);
    return;
  }

  console.log(`✅ Inserted ${rows.length} FAQs for [${slug}].`);
}

async function main() {
  for (const page of PAGES) {
    try {
      await generateFaqsForPage(page);
    } catch (err) {
      console.error(`Error generating FAQs for slug=${page.slug}:`, err);
    }
  }
  console.log('\n🎉 All done.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
