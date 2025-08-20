"use client";

import React, { useMemo, useState } from "react";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";

/* ------------------------------- FAQ content ------------------------------- */
/* Make sure the SVGs exist in /public (e.g., apps/chatbot/public/globe.svg) */
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

  const filteredFaq = useMemo(() => {
    const q = search.toLowerCase();
    return faqData.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <PageLayout
      gradientFrom="from-blue-950"
      gradientVia="via-blue-900"
      gradientTo="to-black"
      textColor="text-white"
    >
      {/* ---------------------------- Hero / Header ---------------------------- */}
      <Section className="relative text-center !p-0 !py-0">
        <div className="relative flex flex-col items-center justify-center overflow-hidden w-full">
          <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/30 via-blue-900/10 to-black" />
          <div className="pt-16" />
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif">
            Transparent Pricing
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-blue-100 font-semibold">
            No hidden fees. No surprises. Just clear, all-inclusive rates for every trip.
          </p>

          {/* CTA buttons – same look/size as your “MORE REVIEWS” etc. */}
          <div className="flex flex-wrap gap-4 justify-center mb-14">
            <a
              href="/quote"
              className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition"
            >
              ⚡ Get Instant Quote
            </a>
            <a
              href="/fleet"
              className="inline-block bg-white hover:bg-blue-50 text-blue-900 font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border-2 border-blue-100"
            >
              🚌 View Fleet
            </a>
            <a
              href="mailto:info@bus2ride.com"
              className="inline-block bg-white hover:bg-blue-50 text-blue-900 font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border-2 border-blue-100"
            >
              ✉️ Contact Us
            </a>
          </div>

          <div className="pb-6" />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120vw] h-40 bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-blue-900/10 blur-2xl opacity-60" />
        </div>
      </Section>

      {/* ---------------------------- Stats (cards) ---------------------------- */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-r from-white/5 via-blue-900/30 to-black/40 rounded-3xl shadow-xl my-12 py-10 px-6 border border-blue-500/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
          What Affects Your Price
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, idx) => (
            <button
              key={stat.title}
              type="button"
              onClick={() => setModalIdx(idx)}
              className="text-left bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100 hover:shadow-2xl hover:-translate-y-1 transition"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-blue-900 font-extrabold text-xl leading-tight">
                {stat.title}
              </div>
              <div className="text-blue-700 font-medium">{stat.subtitle}</div>
              <div className="mt-3 text-blue-600 font-semibold">Learn more →</div>
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
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-500/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
          Pricing FAQ
        </h2>

        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search pricing questions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xl rounded-2xl px-4 py-3 bg-white text-blue-900 border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Cards styled like your white cards across the site */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-h-[640px] overflow-y-auto pr-1">
          {filteredFaq.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100 hover:shadow-2xl transition"
            >
              <img
                src={item.image}
                alt=""
                className="w-20 h-20 object-contain rounded-xl mb-4 border-2 border-blue-100"
                loading="lazy"
              />
              <h3 className="text-blue-900 font-extrabold text-lg mb-2">{item.title}</h3>
              <p className="text-blue-800">{item.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* -------------------------------- Fun Polls ---------------------------- */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-500/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
          Fun Polls
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Which party bus feature is most important?",
              options: ["A: Sound System", "B: Lighting", "C: Bar", "D: TV Screens"],
            },
            { title: "Would you rent a party bus for a birthday?", options: ["Yes", "No"] },
            {
              title: "True or False: Party buses are safer than limos.",
              options: ["True", "False"],
            },
          ].map((poll) => (
            <div
              key={poll.title}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100"
            >
              <h3 className="text-blue-900 font-extrabold text-lg mb-3">{poll.title}</h3>
              <ul className="text-blue-800 mb-3 space-y-1">
                {poll.options.map((opt) => (
                  <li key={opt}>{opt}</li>
                ))}
              </ul>
              <a
                href="/polls"
                className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-2xl shadow transition"
              >
                Vote on Polls Page
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* --------------------------------- Tools -------------------------------- */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-500/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
          Helpful Tools
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100">
            <h3 className="text-blue-900 font-extrabold text-lg mb-2 flex items-center gap-2">
              ⚡ Instant Quote Tool
            </h3>
            <p className="text-blue-800 mb-3">
              Get a real-time quote for your trip in seconds. No obligation, no hidden fees.
            </p>
            <a
              href="/quote"
              className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-2xl shadow transition"
            >
              Try Now
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100">
            <h3 className="text-blue-900 font-extrabold text-lg mb-2 flex items-center gap-2">
              🚌 Vehicle Capacity Finder
            </h3>
            <p className="text-blue-800 mb-3">
              Enter your group size and see which vehicles fit best.
            </p>
            <a
              href="/tools"
              className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-2xl shadow transition"
            >
              Try Now
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100">
            <h3 className="text-blue-900 font-extrabold text-lg mb-2 flex items-center gap-2">
              💸 Cost Split Calculator
            </h3>
            <p className="text-blue-800 mb-3">
              Know your per-person cost instantly by entering the total and group size.
            </p>
            <a
              href="/tools"
              className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-2xl shadow transition"
            >
              Try Now
            </a>
          </div>
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
    </PageLayout>
  );
}
