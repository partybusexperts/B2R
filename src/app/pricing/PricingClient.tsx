"use client";

import React, { useMemo, useState } from "react";
import SmartImage from "../../components/SmartImage";
import Section from "../../components/Section";
import ToolsGrid from "../../components/tools/ToolsGrid";
import HomePolls from "../../components/HomePolls";

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

export default function PricingClient() {
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
                <SmartImage src={item.image} alt={item.title} className="w-10 h-10" />
                <h3 className="text-white font-extrabold text-xl font-serif">{item.title}</h3>
              </div>
              <p className="text-blue-100">{item.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">
          Pricing Polls
        </h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-6">
          See what riders value most on price—features, timing, trip length, and more.
        </p>
        <div className="max-w-6xl mx-auto">
          <HomePolls pickSize={150} visiblePerGroup={3} />
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

      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">
          Helpful Pricing Tools
        </h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">
          Quick calculators and finders to dial in your budget, compare options, and book smarter.
        </p>

        <div className="mb-8">
          <ToolsGrid limit={4} randomize={true} />
        </div>
      </Section>
    </>
  );
}
