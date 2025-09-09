import React from "react";
import Section from "../components/Section";
import HeroHeader from "../components/HeroHeader";
import QuoteForm from '../components/QuoteForm';
import StepCard from "../components/StepCard";
import ToolsSlider from "../components/ToolsSlider";
import ClientOnly from "../components/ClientOnly";
import HomePolls from "../components/HomePolls";
import LiveWeatherAdvisor from "../components/LiveWeatherAdvisor";
import { ReviewForm } from "../components/ReviewForm";
import SlideshowMaker from "../components/SlideshowMaker";

export default function Home() {
  return (
    <main>
      <HeroHeader
        pageSlug="home"
        fallback={{
          page_slug: "home",
          title: "Bus2Ride — Group transport made easy",
          subtitle: "Instant quotes, transparent pricing, and clean vehicles for every event.",
          primary_cta: { label: "Get Instant Quote", href: "/quote" },
          secondary_cta: { label: "View Fleet", href: "/fleet" },
          tertiary_cta: { label: "Contact Us", href: "mailto:info@bus2ride.com" },
          gradient_from: "from-sky-400",
          gradient_via: "via-blue-600",
          gradient_to: "to-indigo-900",
          text_color: "text-white",
          wave_fill: "#122a56",
        }}
      />
      {/* Top CTA */}
      <Section className="max-w-4xl mx-auto text-center py-8">
        <a
          href="/quote#instant"
          className="inline-flex items-center gap-2 rounded-full font-extrabold px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-600 shadow"
        >
          ⚡ Get Your Instant Quote
        </a>
      </Section>

      {/* Instant Quote form */}
      <Section className="max-w-4xl mx-auto py-4">
        <QuoteForm />
      </Section>

      {/* How It Works */}
      <Section className="relative max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 mt-2">How It Works</h2>
        <p className="text-center max-w-2xl mx-auto mb-7">Four simple steps from hello to wheels rolling.</p>

        <div className="grid md:grid-cols-4 gap-6 text-center">
          {[
            { icon: "📞", label: "Contact Us", body: <p>Call, email, or fill our form to get started.</p> },
            { icon: "💬", label: "Get a Quote", body: <p>Fast, transparent pricing by city, date, hours, and group size.</p> },
            { icon: "📝", label: "Reserve", body: <p>Place a small deposit to lock in your vehicle.</p> },
            { icon: "🎉", label: "Ride", body: <p>Balance is billed before the trip; enjoy the ride.</p> },
          ].map((s, i) => (
            <StepCard key={i} icon={s.icon} label={s.label} title={s.label} body={s.body} stepIndex={i} />
          ))}
        </div>
      </Section>

      {/* Tools (client-only to avoid SSR stalls) */}
      <Section className="max-w-7xl mx-auto mt-8">
        <h2 className="text-4xl font-extrabold text-center mb-4">Tools</h2>
        <p className="text-center mb-6">Planner tools to help you choose the right vehicle and plan your trip.</p>
        <div className="max-w-6xl mx-auto bg-white p-4 rounded-2xl">
          <ClientOnly>
            <ToolsSlider />
          </ClientOnly>
        </div>
      </Section>

      {/* Polls (client-only) */}
      <Section className="max-w-6xl mx-auto mt-10">
        <h2 className="text-3xl font-bold text-center mb-4">Community Polls</h2>
        <ClientOnly>
          <HomePolls pickSize={50} visiblePerGroup={25} innerScroll={true} innerScrollClass="max-h-[50vh] overflow-y-auto" />
        </ClientOnly>
      </Section>

      {/* Live Weather (client-only) */}
      <Section className="max-w-6xl mx-auto mt-10">
        <h2 className="text-3xl font-bold text-center mb-4">Smart Weather & Comfort Tips</h2>
        <ClientOnly>
          <LiveWeatherAdvisor />
        </ClientOnly>
      </Section>

      {/* Reviews & Slideshow (client-only) */}
      <Section className="max-w-6xl mx-auto mt-10 mb-20">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-3">Leave a Review</h3>
            <ClientOnly>
              <ReviewForm />
            </ClientOnly>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3">Make a Slideshow</h3>
            <div id="slideshow-tool" />
            <ClientOnly>
              <SlideshowMaker />
            </ClientOnly>
          </div>
        </div>
      </Section>
    </main>
  );
}
