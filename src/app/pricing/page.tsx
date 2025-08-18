"use client";

import React from "react";
import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";

const pricingFaq = [
  {
    title: "How Much Is A Luxury Party Bus Rental?",
    answer: "Our party bus rentals range from $500 to $5,000 per day depending on location, bus size, amenities, and rental length. We offer competitive pricing and top-notch service for any event.",
  image: "/images/globe.svg"
  },
  {
    title: "Why Does It Cost More On Prom?",
    answer: "Prom season means higher demand, longer hours, and premium amenities. This, plus seasonal costs, can increase rates. Booking early helps secure the best price!",
  image: "/images/vercel.svg"
  },
  {
    title: "Why Does Bus2Ride Have A Minimum Hour Rental?",
    answer: "A minimum rental period helps us cover overhead and ensures you get the most value. Most rentals require at least four hours, but we offer flexibility for off-peak or short trips.",
  image: "/images/window.svg"
  },
  {
    title: "How Much Does A Limousine Rental Cost?",
    answer: "Limousine rentals typically range from $100 to $400 per hour, with a 3-4 hour minimum. Pricing depends on location, vehicle type, and amenities. Contact us for a custom quote!",
  image: "/images/next.svg"
  },
  {
    title: "How Do I Get Pricing For Multi-State Trips?",
    answer: "Multi-state trips are quoted based on distance, group size, and duration. Contact our team for a custom travel plan and competitive quote for your adventure.",
  image: "/images/globe.svg"
  },
  {
    title: "What Does It Cost For A Quinceañera?",
    answer: "Quinceañera bus rentals range from $500 to $5,000, with a four-hour minimum. We offer exceptions for shorter rentals ending before 4pm on Saturdays. Get in touch for details!",
  image: "/images/vercel.svg"
  },
  // Custom FAQ rows below
  {
    title: "Are There Extra Fees for Additional Stops?",
    answer: "Additional stops may incur a small fee depending on distance and time. Let us know your itinerary for an exact quote—transparency is our priority!",
  image: "/images/window.svg"
  },
  {
    title: "Do Prices Change for Holidays or Special Events?",
    answer: "Yes, peak dates like holidays and major events may have higher rates due to demand. Book early to lock in the best price!",
  image: "/images/next.svg"
  },
  {
    title: "Is Gratuity Included in the Price?",
    answer: "Gratuity is not always included. We recommend 15-20% for excellent service. Your quote will specify if gratuity is added.",
  image: "/images/globe.svg"
  },
  {
    title: "Can I Get a Discount for Large Groups?",
    answer: "We offer special rates and discounts for large groups and multi-vehicle bookings. Ask our team for current promotions!",
  image: "/images/vercel.svg"
  },
  {
    title: "What Payment Methods Are Accepted?",
    answer: "We accept all major credit cards, ACH, and select digital wallets. Payment details will be provided with your quote.",
  image: "/images/window.svg"
  },
  {
    title: "Is a Deposit Required to Reserve?",
    answer: "A deposit is typically required to secure your booking. The amount and terms will be outlined in your quote and agreement.",
  image: "/images/next.svg"
  },
];

// Removed react-icons import

export default function PricingPage() {
  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      {/* Hero Section */}
      <Section className="flex flex-col items-center justify-center text-center !p-0 !py-0 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/30 via-blue-900/10 to-black" />
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg tracking-tight font-serif bg-gradient-to-r from-blue-400 via-blue-300 to-green-400 bg-clip-text text-transparent">
          Transparent Pricing
        </h1>
        <p className="text-2xl md:text-3xl max-w-3xl mx-auto mb-10 text-blue-100 font-medium">
          Know what to expect—no surprises, just great value for your luxury ride.
        </p>
        <a
          href="/quote"
          className="inline-block px-10 py-5 rounded-full bg-gradient-to-r from-blue-700 to-green-500 text-white font-bold text-2xl shadow-xl hover:scale-110 transition-transform"
        >
          Get Instant Quote
        </a>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120vw] h-40 bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-green-500/10 blur-2xl opacity-60" />
      </Section>

      {/* Stats Section */}
      <Section className="max-w-6xl mx-auto flex flex-wrap justify-center gap-10 bg-gradient-to-r from-blue-900/80 via-blue-950/80 to-black/90 rounded-3xl shadow-xl my-12 py-10">
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

      {/* FAQ Cards Section */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-blue-200 font-serif tracking-tight">
          Pricing FAQ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {pricingFaq.map((item) => (
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
              <h3 className="text-xl font-bold mb-3 text-blue-200 font-serif flex items-center gap-2">
                {item.title}
              </h3>
              <p className="mb-2 text-blue-100 flex-1 text-base font-sans text-center">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="max-w-2xl mx-auto text-center bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10">
        <h2 className="text-5xl font-extrabold mb-6 text-blue-200 font-serif tracking-tight">
          Get Your Custom Quote
        </h2>
        <p className="mb-8 text-xl text-blue-100 font-sans">
          Get a real-time quote in seconds. No hidden fees, no surprises. Just awesome rides.
        </p>
        <a
          href="/quote"
          className="inline-block px-12 py-5 rounded-full bg-gradient-to-r from-blue-700 to-green-500 text-white font-bold text-2xl shadow-xl hover:scale-110 transition-transform"
        >
          Book Now
        </a>
      </Section>
    </PageLayout>
  );
}
