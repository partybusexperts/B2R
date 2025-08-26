"use client";

import React, { useMemo, useState } from "react";
import Section from "../../components/Section";

/* ------------------------------- FAQ content ------------------------------- */
const faqData = [
  { title: "How much does a party bus cost?", answer: "Prices vary by city, date, and vehicle size. Use our Instant Quote Tool for real-time pricing!", image: "/globe.svg" },
  { title: "Are there hidden fees?", answer: "No hidden fees. All taxes and fees are included in your quote.", image: "/vercel.svg" },
  { title: "How do I split the cost with friends?", answer: "Use our Cost Split Calculator in the Tools section below!", image: "/window.svg" },
  { title: "What is the minimum booking time?", answer: "Most rentals require a 3-4 hour minimum to ensure value and availability.", image: "/clock.svg" },
  { title: "What payment methods are accepted?", answer: "We accept all major credit/debit cards, Zelle, CashApp, and more.", image: "/globe.svg" },
  { title: "Can I bring my own drinks?", answer: "Yes! Most party buses allow BYOB for guests 21+ (local laws apply).", image: "/vercel.svg" },
  { title: "Is gratuity included?", answer: "Standard driver gratuity is included in your quote. Extra tips are optional.", image: "/window.svg" },
  { title: "How far in advance should I book?", answer: "Book 2-6 weeks ahead for best selection, especially during peak seasons.", image: "/clock.svg" },
  { title: "Can I see the bus before booking?", answer: "Yes, we can provide photos or schedule a viewing upon request.", image: "/globe.svg" },
  { title: "What if my group is larger than expected?", answer: "Contact us ASAP. We’ll help you upgrade to a larger vehicle if available.", image: "/vercel.svg" },
  { title: "Are there cancellation fees?", answer: "Deposits are non-refundable, but we’ll work with you to reschedule if needed.", image: "/window.svg" },
  { title: "Can I decorate the bus?", answer: "Yes, simple decorations are allowed. Please ask for guidelines before your trip.", image: "/clock.svg" },
  { title: "Is smoking allowed?", answer: "No smoking or vaping is allowed on any vehicle.", image: "/globe.svg" },
  { title: "What happens if we go over time?", answer: "Overtime is billed in 15- or 30-minute increments at your quoted rate.", image: "/vercel.svg" },
  { title: "Can I change my pickup/dropoff location?", answer: "Yes, just let us know in advance so we can update your reservation.", image: "/window.svg" },
  { title: "Are party buses safe?", answer: "All vehicles are DOT-inspected and driven by licensed, professional chauffeurs.", image: "/clock.svg" },
  { title: "Do you offer one-way trips?", answer: "Yes, one-way and round-trip bookings are available. Ask for details!", image: "/globe.svg" },
  { title: "How do I get a quote?", answer: "Use our Instant Quote Tool or call us for a custom quote in minutes.", image: "/vercel.svg" },
];

/* ------------------------------ Stats + Modals ----------------------------- */
const statsData = [
  {
    icon: "⏰",
    title: "3–4 Hours",
    subtitle: "Minimum Booking",
    modalTitle: "Minimum Booking Time",
    modalContent:
      "Most party bus rentals require a 3–4 hour minimum. This ensures you get the best value and covers travel, setup, and cleanup time.",
  },
  {
    icon: "💵",
    title: "No Hidden Fees",
    subtitle: "Transparent Quotes",
    modalTitle: "No Hidden Fees",
    modalContent:
      "Quotes include taxes and standard fees. What you see is what you pay—no surprises at checkout.",
  },
  {
    icon: "🧾",
    title: "All-Inclusive",
    subtitle: "Taxes & Fees",
    modalTitle: "All-Inclusive Pricing",
    modalContent:
      "Your price covers all mandatory charges (taxes, standard fees, and service). Tipping extra is optional.",
  },
  {
    icon: "💳",
    title: "Flexible Pay",
    subtitle: "Cards, Zelle, CashApp",
    modalTitle: "Flexible Payment Methods",
    modalContent:
      "We accept all major credit/debit cards, Zelle, and CashApp. (No ACH or crypto.)",
  },
];

/* ---------------------------------- Modal --------------------------------- */
function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-blue-800/40 bg-gradient-to-br from-[#13306a] to-[#0e2250] p-8 shadow-2xl text-blue-100">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-blue-100 hover:text-white text-2xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
        <h3 className="text-2xl font-extrabold mb-3 font-serif tracking-tight text-white">
          {title}
        </h3>
        <div className="text-blue-100 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [search, setSearch] = useState("");
  const [modalIdx, setModalIdx] = useState<number | null>(null);

  const filteredFaq = useMemo(() => {
    const q = search.toLowerCase();
    return faqData.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <main className="min-h-screen w-full text-white bg-[#0f1f46]">
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex flex-col items-center justify-center text-center py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 mix-blend-overlay pointer-events-none" />
        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-serif text-white drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]">
          Transparent Pricing
        </h1>
        <p className="relative z-10 text-2xl md:text-3xl max-w-3xl mx-auto mb-10 text-blue-50 font-medium drop-shadow">
          No hidden fees. No surprises. Just clear, all-inclusive rates for every trip.
        </p>
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-3xl">
          <a
            href="/quote"
            className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-white/95 text-blue-900 hover:bg-white border-blue-200"
          >
            Get Instant Quote
          </a>
          <a
            href="/fleet"
            className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700 border-blue-700"
          >
            🚌 View Fleet
          </a>
          <a
            href="mailto:info@bus2ride.com"
            className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-blue-800 text-white hover:bg-blue-900 border-blue-900"
          >
            ✉️ Contact Us
          </a>
        </div>
        <div className="absolute bottom-[-1px] left-0 right-0">
          <svg viewBox="0 0 1440 110" className="w-full h-[110px]" preserveAspectRatio="none">
            <path d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z" fill="#122a56" />
          </svg>
        </div>
      </section>

      {/* ---------- WHAT AFFECTS YOUR PRICE ---------- */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-white font-serif tracking-tight">
          What Affects Your Price
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, idx) => (
            <button
              key={stat.title}
              type="button"
              onClick={() => setModalIdx(idx)}
              className="text-left bg-[#12244e] rounded-2xl shadow-xl p-6 border border-blue-800/30 hover:shadow-2xl hover:-translate-y-1 transition group focus:outline-none"
            >
              <div className="text-5xl mb-3 drop-shadow-lg">{stat.icon}</div>
              <div className="text-white font-extrabold text-2xl leading-tight font-serif group-hover:underline">
                {stat.title}
              </div>
              <div className="text-blue-200 font-semibold text-lg mt-1">{stat.subtitle}</div>
              <div className="mt-4 text-blue-300 font-bold group-hover:text-blue-100 transition">Learn more →</div>
            </button>
          ))}
        </div>
        <Modal
          open={modalIdx !== null}
          onClose={() => setModalIdx(null)}
          title={modalIdx !== null ? statsData[modalIdx].modalTitle : ""}
        >
          {modalIdx !== null ? statsData[modalIdx].modalContent : null}
        </Modal>
      </Section>

      {/* ---------- CUSTOMER REVIEWS (moved up, right after boxes) ---------- */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-white font-serif tracking-tight">
          Customer Reviews
        </h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">
          Real feedback from happy riders. Book with confidence.
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Paul P.", text: "Absolutely excellent! Great customer service! We changed drop off points several times and they were so accommodating... The price was very good. The driver was so nice and professional." },
            { name: "Jessie A.", text: "The limo company that you need to call when u have an event. Prices and limos and party bus are like no other limo company." },
            { name: "Dee C.", text: "Definitely lives up to their name! We used them for multiple events and will be using them again. They were absolutely great!" },
            { name: "Halee H.", text: "The price is great, inside is very clean, driver was very friendly and accommodating! Will never use another company besides this one!" },
            { name: "Rachel L.", text: "We had the best time ever!! Our driver was so fun and amazing!! I would recommend them 100%!!!" },
            { name: "Becky B.", text: "Sonny can take your event to the next level with beautiful limos and sedans. Highly recommend!" },
          ].map((review, i) => (
            <div key={i} className="relative bg-[#12244e] border border-blue-800/30 rounded-2xl shadow-xl p-7 flex flex-col gap-3 hover:scale-[1.02] transition-transform overflow-hidden">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600 rounded-full w-11 h-11 flex items-center justify-center text-2xl font-bold text-white shadow-lg border border-blue-300/30">
                  {review.name[0]}
                </div>
                <span className="font-bold text-blue-50 text-lg">{review.name}</span>
                <span className="ml-auto text-yellow-300 text-xl">★★★★★</span>
              </div>
              <div className="text-blue-50 text-base leading-relaxed font-medium">
                {review.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <a
            href="/reviews"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700"
          >
            More Reviews
          </a>
        </div>
      </Section>

      {/* ---------- PRICING FAQ (kept same styling; appears after reviews) ---------- */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-white font-serif tracking-tight">
          Pricing FAQ
        </h2>
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search pricing questions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xl rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFaq.map((item) => (
            <div
              key={item.title}
              className="bg-[#12244e] rounded-2xl shadow-xl p-6 border border-blue-800/30 hover:shadow-2xl transition"
            >
              <div className="flex items-center gap-4 mb-3">
                <img src={item.image} alt="" className="w-10 h-10" />
                <h3 className="text-white font-extrabold text-xl font-serif">{item.title}</h3>
              </div>
              <p className="text-blue-100">{item.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- PRICING POLLS (renamed) ---------- */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">
          Pricing Polls
        </h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-6">
          See what riders value most on price—features, timing, trip length, and more.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[
            { question: "What’s the most important factor in party bus pricing?", options: ["Group size", "Date/season", "Trip length", "Vehicle type"] },
            { question: "Would you pay more for a newer party bus?", options: ["Yes", "No"] },
            { question: "How much extra would you pay for a party bus with a restroom?", options: ["$0", "$50", "$100", "$200+"] },
            { question: "What’s a fair hourly rate for a 20-passenger limo?", options: ["$100", "$150", "$200", "$250+"] },
            { question: "Would you split the cost with friends?", options: ["Always", "Sometimes", "Never"] },
            { question: "All-inclusive or itemized fees?", options: ["All-inclusive", "Itemized", "No preference"] },
            { question: "Biggest pricing surprise you’ve seen?", options: ["Taxes/fees", "Gratuity", "Fuel surcharge", "Damage deposit"] },
            { question: "Pay more for premium sound?", options: ["Yes", "No"] },
            { question: "Book ahead to save the most?", options: ["<1 week", "1–2 weeks", "3–4 weeks", "1+ month"] },
            { question: "Best way to save on limo pricing?", options: ["Book early", "Go off-peak", "Share with friends", "Smaller vehicle"] },
            { question: "Pay more for coach Wi-Fi?", options: ["Yes", "No"] },
            { question: "Most you’d pay for a 4-hour party bus?", options: ["$400", "$600", "$800", "$1000+"] },
            { question: "Expect taxes/fees included in quote?", options: ["Yes", "No"] },
            { question: "Pay more for a stocked bar?", options: ["Yes", "No"] },
            { question: "Best value overall?", options: ["Party bus", "Limo", "Coach bus", "Depends"] },
          ].map((poll, idx) => (
            <div key={idx} className="bg-[#12244e] rounded-2xl shadow-xl border border-blue-800/30 p-6 flex flex-col items-center">
              <h3 className="text-xl font-bold text-blue-50 mb-2 text-center">{poll.question}</h3>
              <ul className="text-blue-100 mb-2 text-center">
                {poll.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
              <span className="text-blue-200 text-sm">
                Vote on our <a href="/polls" className="underline hover:text-blue-50">polls page</a>!
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <a
            href="/polls"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700"
          >
            More Polls
          </a>
        </div>
      </Section>

      {/* ---------- HELPFUL PRICING TOOLS (renamed & slightly tuned copy) ---------- */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">
          Helpful Pricing Tools
        </h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">
          Quick calculators and finders to dial in your budget, compare options, and book smarter.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {[
            { title: "⚡ Instant Quote Tool", desc: "Get a real-time quote for your trip in seconds. No obligation, no hidden fees.", href: "/quote" },
            { title: "🚌 Vehicle Capacity Finder", desc: "Enter your group size and see which vehicles fit best (and what each costs).", href: "/tools" },
            { title: "💸 Cost Split Calculator", desc: "Know your per-person cost instantly—just enter total and group size.", href: "/tools" },
            { title: "📅 Date Price Checker", desc: "See how prices shift by weekday, season, or holiday.", href: "/tools" },
            { title: "📍 Zip Code Price Lookup", desc: "Find pricing for your city or zip code instantly.", href: "/tools" },
            { title: "🕒 Hourly vs. Flat Rate", desc: "Compare hourly and flat-rate options for your itinerary.", href: "/tools" },
            { title: "🚐 Vehicle Comparison", desc: "Compare prices & features across party bus, limo, and coach.", href: "/tools" },
            { title: "🧾 Fee & Tax Estimator", desc: "Rough in taxes, fees, and gratuity for a final out-the-door total.", href: "/tools" },
            { title: "💬 Ask a Pricing Expert", desc: "Get personalized help balancing budget and features.", href: "/tools" },
          ].map((tool) => (
            <div
              key={tool.title}
              className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200 text-left hover:shadow-2xl hover:-translate-y-1 transition"
            >
              <h3 className="text-blue-900 font-extrabold text-lg mb-2">
                {tool.title}
              </h3>
              <p className="text-blue-800 mb-4">{tool.desc}</p>
              <a
                href={tool.href}
                className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-2xl shadow transition border border-blue-800/70"
              >
                Try Now
              </a>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <a
            href="/tools"
            className="inline-block bg-white hover:bg-blue-50 text-blue-900 font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-200"
          >
            See All Tools
          </a>
        </div>
      </Section>
    </main>
  );
}
