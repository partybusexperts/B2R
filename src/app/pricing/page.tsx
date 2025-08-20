"use client";
import React, { useMemo, useState } from "react";

/** Local Section that forwards className (use this or ensure your imported Section does) */
function Section({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <section className={className}>{children}</section>;
}

// Example FAQ data (images must live in /public and be referenced as "/file.svg")
const faqData = [
  {
    title: "How much does a party bus cost?",
    answer:
      "Prices vary by city, date, and vehicle size. Use our Instant Quote Tool for real-time pricing!",
    image: "/globe.svg",
  },
  {
    title: "Are there hidden fees?",
    answer: "No hidden fees. All taxes and fees are included in your quote.",
    image: "/vercel.svg",
  },
  {
    title: "How do I split the cost with friends?",
    answer: "Use our Cost Split Calculator in the Tools section below!",
    image: "/window.svg",
  },
];

export default function PricingPage() {
  const [search, setSearch] = useState("");

  const filteredFaq = useMemo(() => {
    const q = search.toLowerCase();
    return faqData.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <>
      {/* Stats */}
      <Section className="max-w-6xl mx-auto flex flex-wrap justify-center gap-10 bg-gradient-to-r from-blue-900/80 via-blue-950/80 to-black/90 rounded-3xl shadow-xl my-12 py-10 px-6">
        {[
          { label: "Lowest Hourly Minimums", value: "2-4 Hours", icon: "⏰" },
          { label: "Transparent Quotes", value: "No Hidden Fees", icon: "💵" },
          { label: "All-Inclusive Pricing", value: "Taxes & Fees Included", icon: "🧾" },
          { label: "Flexible Payment", value: "Cards, ACH, Wallets", icon: "💳" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center px-10 py-8 rounded-2xl bg-gradient-to-br from-blue-800 to-blue-950 shadow-2xl min-w-[200px] border border-blue-500/30 hover:scale-105 transition-transform"
          >
            <span className="text-5xl mb-2">{stat.icon}</span>
            <span className="text-3xl font-bold text-blue-300 mb-1 font-serif">
              {stat.value}
            </span>
            <span className="text-lg text-blue-100 font-sans">{stat.label}</span>
          </div>
        ))}
      </Section>

      {/* Pricing FAQ with search and scroll */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-blue-200 font-serif tracking-tight">
          Pricing FAQ
        </h2>
        <div className="flex flex-col items-center mb-8">
          <input
            type="text"
            placeholder="Search pricing questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xl rounded-lg px-4 py-3 bg-blue-950 text-blue-100 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-h-[600px] overflow-y-auto pr-2">
          {filteredFaq.map((item) => (
            <div
              key={item.title}
              className="bg-blue-950/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col hover:scale-105 transition-transform border border-blue-500/20 text-white p-8"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 object-contain rounded-xl mb-4 border-2 border-blue-400/20 mx-auto"
                loading="lazy"
              />
              <h3 className="text-xl font-bold mb-3 text-blue-200 font-serif">
                {item.title}
              </h3>
              <p className="text-blue-100 mb-2 font-sans">{item.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Fun Polls */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 px-6 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-blue-200 font-serif tracking-tight">
          Fun Polls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          <div className="bg-blue-950/90 rounded-2xl shadow-xl border border-blue-500/20 p-6 flex flex-col items-center">
            <h3 className="text-xl font-bold text-blue-100 mb-2">
              Which party bus feature is most important?
            </h3>
            <ul className="text-blue-200 mb-2">
              <li>A: Sound System</li>
              <li>B: Lighting</li>
              <li>C: Bar</li>
              <li>D: TV Screens</li>
            </ul>
            <span className="text-blue-400 text-sm">
              Vote on our <a href="/polls" className="underline hover:text-blue-200">polls page</a>!
            </span>
          </div>
          <div className="bg-blue-950/90 rounded-2xl shadow-xl border border-blue-500/20 p-6 flex flex-col items-center">
            <h3 className="text-xl font-bold text-blue-100 mb-2">
              Would you rent a party bus for a birthday?
            </h3>
            <ul className="text-blue-200 mb-2">
              <li>Yes</li>
              <li>No</li>
            </ul>
            <span className="text-blue-400 text-sm">
              Vote on our <a href="/polls" className="underline hover:text-blue-200">polls page</a>!
            </span>
          </div>
          <div className="bg-blue-950/90 rounded-2xl shadow-xl border border-blue-500/20 p-6 flex flex-col items-center">
            <h3 className="text-xl font-bold text-blue-100 mb-2">
              True or False: Party buses are safer than limos.
            </h3>
            <ul className="text-blue-200 mb-2">
              <li>True</li>
              <li>False</li>
            </ul>
            <span className="text-blue-400 text-sm">
              Vote on our <a href="/polls" className="underline hover:text-blue-200">polls page</a>!
            </span>
          </div>
        </div>
      </Section>

      {/* Tools promo cards */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 px-6 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-blue-200 font-serif tracking-tight">
          Helpful Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-8">
          <div className="bg-blue-950/90 rounded-2xl shadow-xl border border-blue-500/20 p-6 flex flex-col items-center">
            <h3 className="text-xl font-bold text-blue-100 mb-2 flex items-center gap-2">⚡ Instant Quote Tool</h3>
            <p className="text-blue-200 mb-2 text-center">
              Get a real-time quote for your trip in seconds. No obligation, no hidden fees—just transparent pricing.
            </p>
            <a
              href="/quote"
              className="rounded-full font-bold px-6 py-2 text-base tracking-tight shadow-md transition border-2 flex items-center justify-center bg-blue-700 text-white border-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2"
            >
              Try Now
            </a>
          </div>
          <div className="bg-blue-950/90 rounded-2xl shadow-xl border border-blue-500/20 p-6 flex flex-col items-center">
            <h3 className="text-xl font-bold text-blue-100 mb-2 flex items-center gap-2">🚌 Vehicle Capacity Finder</h3>
            <p className="text-blue-200 mb-2 text-center">
              Enter your group size and see which vehicles fit best. Fast, easy, and accurate for any event.
            </p>
            <a
              href="/tools"
              className="rounded-full font-bold px-6 py-2 text-base tracking-tight shadow-md transition border-2 flex items-center justify-center bg-blue-700 text-white border-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2"
            >
              Try Now
            </a>
          </div>
          <div className="bg-blue-950/90 rounded-2xl shadow-xl border border-blue-500/20 p-6 flex flex-col items-center">
            <h3 className="text-xl font-bold text-blue-100 mb-2 flex items-center gap-2">💸 Cost Split Calculator</h3>
            <p className="text-blue-200 mb-2 text-center">
              Know your per-person cost instantly by entering the total cost and number of people in your group.
            </p>
            <a
              href="/tools"
              className="rounded-full font-bold px-6 py-2 text-base tracking-tight shadow-md transition border-2 flex items-center justify-center bg-blue-700 text-white border-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2"
            >
              Try Now
            </a>
          </div>
        </div>
        <a
          href="/tools"
          className="rounded-full font-bold px-8 py-3 text-lg tracking-tight shadow-md transition border-2 flex items-center justify-center bg-white text-blue-900 border-blue-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          See All Tools
        </a>
      </Section>
    </>
  );
}
