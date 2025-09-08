import React from "react";
import Section from "../components/Section";
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
      {/* Top CTA */}
      <Section className="max-w-4xl mx-auto text-center py-8">
        <a
          href="/quote#instant"
          className="inline-flex items-center gap-2 rounded-full font-extrabold px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-600 shadow"
        >
          ⚡ Get Your Instant Quote
        </a>
      </Section>

      {/* How It Works */}
      <Section className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: "📞", title: "Contact Us", body: "Call, email, or fill our form to get started." },
            { icon: "💬", title: "Get a Quote", body: "Fast, transparent pricing for your trip." },
            { icon: "📝", title: "Reserve Ride", body: "Place a small deposit to lock your vehicle." },
            { icon: "🎉", title: "Finalize & Ride", body: "Balance billed before trip; enjoy your ride." },
          ].map((s, i) => (
            <StepCard key={i} icon={s.icon} label={s.title} title={s.title} body={<p>{s.body}</p>} stepIndex={i} />
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="max-w-6xl mx-auto my-12">
        <h2 className="text-3xl font-extrabold text-center mb-6">What Our Customers Say</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: "Paul P.", text: "Absolutely excellent! Great customer service!" },
            { name: "Jessie A.", text: "The limo company that you need to call." },
          ].map((r, i) => (
            <div key={i} className="p-6 bg-slate-900 text-white rounded-lg">
              <p className="italic">{r.text}</p>
              <div className="mt-4 font-bold">{r.name}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Tools */}
      <Section className="max-w-7xl mx-auto my-12">
        <h2 className="text-3xl font-extrabold text-center mb-4">Tools</h2>
        <div className="bg-white rounded-xl p-4 shadow">
          <ToolsSlider />
        </div>
      </Section>

      {/* Polls (client-only) */}
      <Section className="max-w-6xl mx-auto my-12">
        <h2 className="text-3xl font-extrabold text-center mb-4">Industry Polls</h2>
        <ClientOnly>
          <HomePolls pickSize={50} visiblePerGroup={25} innerScroll={true} innerScrollClass="max-h-[50vh] overflow-y-auto" />
        </ClientOnly>
      </Section>

      {/* Live Weather Advisor */}
      <Section className="max-w-6xl mx-auto my-12">
        <LiveWeatherAdvisor />
      </Section>

      {/* Review & Slideshow */}
      <Section className="max-w-6xl mx-auto my-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Leave a Review</h3>
            <ReviewForm />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Slideshow Maker</h3>
            <SlideshowMaker />
          </div>
        </div>
      </Section>

      {/* Contact CTA */}
      <Section className="max-w-4xl mx-auto text-center py-8">
        <a href="tel:8885352566" className="rounded-xl font-bold px-6 py-3 bg-blue-700 text-white">Call (888) 535-2566</a>
      </Section>
    </main>
  );
}


