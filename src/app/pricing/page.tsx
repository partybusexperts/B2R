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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gradient-to-br from-blue-900 to-black rounded-2xl shadow-2xl p-8 max-w-md w-full relative border-2 border-blue-400/30">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-blue-200 hover:text-white text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
        <h3 className="text-2xl font-extrabold mb-4 text-blue-100 font-serif tracking-tight">
          {title}
        </h3>
        <div className="text-blue-100 text-lg font-sans">{children}</div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [search, setSearch] = useState("");
  const [modalIdx, setModalIdx] = useState<number | null>(null);

  // ✅ This fixes the "filteredFaq is not defined" error
  const filteredFaq = useMemo(() => {
    const q = search.toLowerCase();
    return faqData.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-blue-950 via-blue-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-2 md:px-6">
        {/* ---------------------------- Hero / Header ---------------------------- */}
        <Section className="relative text-center !p-0 !py-0">
          <div className="relative flex flex-col items-center justify-center overflow-hidden w-full min-h-[520px] bg-gradient-to-br from-blue-950 via-blue-900 to-black">
            <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/30 via-blue-900/10 to-black" />
            <div className="pt-20" />
            <h1 className="text-6xl md:text-8xl font-extrabold mb-8 tracking-tight font-serif bg-gradient-to-r from-blue-200 via-blue-500 to-blue-800 bg-clip-text text-transparent drop-shadow-lg">
              Transparent Pricing
            </h1>
            <p className="text-2xl md:text-3xl max-w-3xl mx-auto mb-12 text-blue-100 font-medium">
              No hidden fees. No surprises. Just clear, all-inclusive rates for every trip.
            </p>
            <div className="flex flex-row flex-wrap gap-4 justify-center items-center mb-14">
              <a
                href="/quote"
                className="rounded-full font-bold px-7 py-3 text-lg tracking-tight shadow-md transition border-2 flex items-center justify-center min-w-[170px] max-w-full text-center bg-white text-blue-900 border-blue-200 hover:bg-blue-100 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap overflow-hidden"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="text-blue-700 text-xl">⚡</span>
                  <span className="leading-tight text-blue-900 font-semibold truncate">Get Instant Quote</span>
                </span>
              </a>
              <a
                href="/fleet"
                className="rounded-full font-bold px-7 py-3 text-lg tracking-tight shadow-md transition border-2 flex items-center justify-center min-w-[170px] max-w-full text-center bg-blue-700 text-white border-blue-700 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap overflow-hidden"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="text-white text-xl">🚌</span>
                  <span className="leading-tight text-white font-semibold truncate">View Fleet</span>
                </span>
              </a>
              <a
                href="mailto:info@bus2ride.com"
                className="rounded-full font-bold px-7 py-3 text-lg tracking-tight shadow-md transition border-2 flex items-center justify-center min-w-[170px] max-w-full text-center bg-white text-blue-900 border-blue-200 hover:bg-blue-100 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap overflow-hidden"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="text-blue-700 text-xl">✉️</span>
                  <span className="leading-tight text-blue-900 font-semibold truncate">Contact Us</span>
                </span>
              </a>
            </div>
            <div className="pb-10" />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120vw] h-40 bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-blue-900/10 blur-2xl opacity-60" />
          </div>
        </Section>

        {/* ---------------------------- Stats (cards) ---------------------------- */}
        <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-950 via-blue-900 to-black rounded-3xl shadow-2xl my-16 py-14 px-6 border border-blue-800/40">
          <h2 className="text-5xl md:text-6xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-200 via-blue-500 to-blue-800 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
            What Affects Your Price
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, idx) => (
              <button
                key={stat.title}
                type="button"
                onClick={() => setModalIdx(idx)}
                className="text-left bg-gradient-to-br from-[#232f5c] via-[#1a237e] to-black rounded-3xl shadow-xl p-8 border-2 border-blue-800/40 hover:shadow-2xl hover:-translate-y-1 transition group focus:outline-none"
              >
                <div className="text-5xl mb-3 drop-shadow-lg">{stat.icon}</div>
                <div className="text-blue-900 font-extrabold text-2xl leading-tight font-serif group-hover:underline">
                  {stat.title}
                </div>
                <div className="text-blue-700 font-semibold text-lg mt-1">{stat.subtitle}</div>
                <div className="mt-4 text-blue-600 font-bold group-hover:text-blue-800 transition">Learn more →</div>
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

        {/* -------------------------- Pricing FAQ + Search ----------------------- */}
        <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-950 via-blue-900 to-black rounded-3xl shadow-2xl my-16 py-14 px-6 border border-blue-800/40">
          <h2 className="text-5xl md:text-6xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-200 via-blue-500 to-blue-800 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
            Pricing FAQ
          </h2>
          <div className="flex justify-center mb-10">
            <input
              type="text"
              placeholder="Search pricing questions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-xl rounded-2xl px-5 py-4 bg-white/90 text-blue-900 border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg font-medium shadow"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-h-[640px] overflow-y-auto pr-1">
            {filteredFaq.map((item) => (
              <div
                key={item.title}
                className="bg-gradient-to-br from-[#232f5c] via-[#1a237e] to-black rounded-3xl shadow-xl p-8 border-2 border-blue-800/40 hover:shadow-2xl transition flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img src={item.image} alt="" className="w-12 h-12" />
                  <h3 className="text-blue-900 font-extrabold text-xl font-serif">{item.title}</h3>
                </div>
                <p className="text-blue-800 text-lg font-medium">{item.answer}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* -------------------------------- Fun Polls ---------------------------- */}
        <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-500/30">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
            Fun Polls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {[
              { question: "What’s the most important factor in party bus pricing?", options: ["Group size", "Date/season", "Trip length", "Vehicle type"] },
              { question: "Would you pay more for a newer party bus?", options: ["Yes", "No"] },
              { question: "How much extra would you pay for a party bus with a restroom?", options: ["$0", "$50", "$100", "$200+"] },
              { question: "What’s a fair hourly rate for a 20-passenger limo?", options: ["$100", "$150", "$200", "$250+"] },
              { question: "Would you split the cost of a party bus with friends?", options: ["Always", "Sometimes", "Never"] },
              { question: "Do you prefer all-inclusive pricing or itemized fees?", options: ["All-inclusive", "Itemized", "No preference"] },
              { question: "What’s the biggest pricing surprise you’ve seen?", options: ["Taxes/fees", "Gratuity", "Fuel surcharge", "Damage deposit"] },
              { question: "Would you pay more for a party bus with a dance pole?", options: ["Yes", "No"] },
              { question: "How far in advance do you book to get the best price?", options: ["<1 week", "1-2 weeks", "3-4 weeks", "1+ month"] },
              { question: "What’s the best way to save on limo pricing?", options: ["Book early", "Go off-peak", "Share with friends", "Smaller vehicle"] },
              { question: "Would you pay extra for a party bus with a premium sound system?", options: ["Yes", "No"] },
              { question: "What’s a reasonable tip for a party bus driver?", options: ["10%", "15%", "20%", "Other"] },
              { question: "Do you prefer to pay by the hour or by the trip?", options: ["Hour", "Trip", "Depends"] },
              { question: "Would you pay more for a coach bus with Wi-Fi?", options: ["Yes", "No"] },
              { question: "What’s the most you’d pay for a 4-hour party bus rental?", options: ["$400", "$600", "$800", "$1000+"] },
              { question: "Do you expect taxes/fees to be included in your quote?", options: ["Yes", "No"] },
              { question: "Would you pay more for a limo with a stocked bar?", options: ["Yes", "No"] },
              { question: "What’s the best value: party bus, limo, or coach bus?", options: ["Party bus", "Limo", "Coach bus", "Depends"] },
            ].map((poll, idx) => (
              <div key={idx} className="bg-blue-950/90 rounded-2xl shadow-xl border border-blue-500/20 p-6 flex flex-col items-center">
                <h3 className="text-xl font-bold text-blue-100 mb-2 text-center">{poll.question}</h3>
                <ul className="text-blue-200 mb-2 text-center">
                  {poll.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
                <span className="text-blue-400 text-sm">
                  Vote on our <a href="/polls" className="underline hover:text-blue-200">polls page</a>!
                </span>
              </div>
            ))}
          </div>
          {/* ✅ Added "More Polls" button below the 18 polls */}
          <div className="flex justify-center mt-10">
            <a
              href="/polls"
              className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition"
            >
              More Polls
            </a>
          </div>
        </Section>

        {/* --------------------------------- Tools -------------------------------- */}
        <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-500/30">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
            Helpful Tools
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {[
              { title: "⚡ Instant Quote Tool", desc: "Get a real-time quote for your trip in seconds. No obligation, no hidden fees.", href: "/quote" },
              { title: "🚌 Vehicle Capacity Finder", desc: "Enter your group size and see which vehicles fit best.", href: "/tools" },
              { title: "💸 Cost Split Calculator", desc: "Know your per-person cost instantly by entering the total and group size.", href: "/tools" },
              { title: "📅 Date Price Checker", desc: "See how prices change by date, season, or holiday.", href: "/tools" },
              { title: "📍 Zip Code Price Lookup", desc: "Find pricing for your city or zip code instantly.", href: "/tools" },
              { title: "🕒 Hourly vs. Flat Rate Tool", desc: "Compare hourly and flat-rate pricing for your trip.", href: "/tools" },
              { title: "🚐 Vehicle Comparison Tool", desc: "Compare prices and features for all vehicle types.", href: "/tools" },
              { title: "🧾 Fee & Tax Estimator", desc: "Estimate taxes, fees, and gratuity for your booking.", href: "/tools" },
              { title: "💬 Ask a Pricing Expert", desc: "Get personalized pricing help from our team.", href: "/tools" },
            ].map((tool) => (
              <div
                key={tool.title}
                className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100 text-left hover:shadow-2xl hover:-translate-y-1 transition"
              >
                <h3 className="text-blue-900 font-extrabold text-lg mb-2 flex items-center gap-2">
                  {tool.title}
                </h3>
                <p className="text-blue-800 mb-4">{tool.desc}</p>
                <a
                  href={tool.href}
                  className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-2xl shadow transition"
                >
                  Try Now
                </a>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <a
              href="/tools"
              className="inline-block bg-white hover:bg-blue-50 text-blue-900 font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border-2 border-blue-100"
            >
              See All Tools
            </a>
          </div>
        </Section>

        {/* ------------------------------- Reviews ------------------------------- */}
        <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-500/30">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-200 via-blue-500 to-blue-800 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
            Customer Reviews
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Paul P.", text: "Absolutely excellent! Great customer service! We changed drop off points several times and they were so accommodating... The price was very good. The driver was so nice and professional." },
              { name: "Jessie A.", text: "The limo company that you need to call when u have an event. Prices and limos and party bus are like no other limo company." },
              { name: "Dee C.", text: "Definitely lives up to their name! We used them for multiple events and will be using them again. They were absolutely great!" },
              { name: "Halee H.", text: "The price is great, inside is very clean, driver was very friendly and accommodating! Will never use another company besides this one!" },
              { name: "Rachel L.", text: "We had the best time ever!! Our driver was so fun and amazing!! I would recommend them 100%!!!" },
              { name: "Becky B.", text: "Sonny can take your event to the next level with beautiful limos and sedans. Highly recommend!" },
            ].map((review, i) => (
              <div key={i} className="relative bg-gradient-to-br from-[#232f5c] via-[#1a237e] to-black border-2 border-blue-800/40 rounded-2xl shadow-xl p-7 flex flex-col gap-3 hover:scale-[1.025] transition-transform group overflow-hidden">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 rounded-full w-11 h-11 flex items-center justify-center text-2xl font-bold text-white shadow-lg border-2 border-blue-300/40">
                    {review.name[0]}
                  </div>
                  <span className="font-bold text-blue-100 text-lg drop-shadow">{review.name}</span>
                  <span className="ml-auto text-yellow-400 text-xl">★★★★★</span>
                </div>
                <div className="text-blue-50 text-base leading-relaxed font-medium drop-shadow-lg relative z-10">
                  {review.text}
                </div>
                <svg className="absolute right-0 bottom-0 opacity-10 w-24 h-24 pointer-events-none group-hover:opacity-20 transition" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="url(#grad)" />
                  <defs>
                    <radialGradient id="grad">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1e293b" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <a
              href="/reviews"
              className="inline-block bg-white hover:bg-blue-50 text-blue-900 font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border-2 border-blue-100"
            >
              More Reviews
            </a>
          </div>
        </Section>
      </div>
    </main>
  );
}
