import React from "react";
import Section from "@/components/Section";
import StepCard from "@/components/StepCard";
import ToolsSlider from "@/components/ToolsSlider";
import ClientOnly from "@/components/ClientOnly";
import HomePolls from "@/components/HomePolls";
import LiveWeatherAdvisor from "@/components/LiveWeatherAdvisor";
import ReviewForm from "@/components/ReviewForm";
import SlideshowMaker from "@/components/SlideshowMaker";

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

      {/* Tools */}
      <Section className="max-w-7xl mx-auto mt-8">
        <h2 className="text-4xl font-extrabold text-center mb-4">Tools</h2>
        <p className="text-center mb-6">Planner tools to help you choose the right vehicle and plan your trip.</p>
        <div className="max-w-6xl mx-auto bg-white p-4 rounded-2xl">
          <ToolsSlider />
        </div>
      </Section>

      {/* Polls (client-only) */}
      <Section className="max-w-6xl mx-auto mt-10">
        <h2 className="text-3xl font-bold text-center mb-4">Community Polls</h2>
        <ClientOnly>
          <HomePolls pickSize={50} visiblePerGroup={25} innerScroll={true} innerScrollClass="max-h-[50vh] overflow-y-auto" />
        </ClientOnly>
      </Section>

      {/* Live Weather */}
      <Section className="max-w-6xl mx-auto mt-10">
        <h2 className="text-3xl font-bold text-center mb-4">Smart Weather & Comfort Tips</h2>
        <LiveWeatherAdvisor />
      </Section>

      {/* Reviews & Slideshow */}
      <Section className="max-w-6xl mx-auto mt-10 mb-20">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-3">Leave a Review</h3>
            <ReviewForm />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3">Make a Slideshow</h3>
            <div id="slideshow-tool" />
            <SlideshowMaker />
          </div>
        </div>
      </Section>
    </main>
  );
}
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
      import React from "react";
      import PageLayout from "@/components/PageLayout";
      import Section from "@/components/Section";
      import StepCard from "@/components/StepCard";
      import ToolsSlider from "@/components/tools/ToolsSlider";
      import ClickableCard from "@/components/ClickableCard";
      import SmartImage from "@/components/SmartImage";
      import ClientOnly from "@/components/ClientOnly";
      import HomePolls from "@/components/HomePolls";
      import LiveWeatherAdvisor from "@/components/LiveWeatherAdvisor";
      import ReviewForm from "@/components/ReviewForm";
      import SlideshowMaker from "@/components/SlideshowMaker";

      export default function Home() {
        return (
          <>
            {/* (removed orphaned feature card block to fix unbalanced JSX) */}
            {/* CTA ribbon */}
            <div className="mt-8 mb-2">
            <a
              href="/quote#instant"
              className="inline-flex items-center gap-2 rounded-full font-extrabold px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-600 shadow"
            >
              ⚡ Get Your Instant Quote
            </a>
          </div>

import React from "react";
import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import StepCard from "@/components/StepCard";
import ToolsSlider from "@/components/tools/ToolsSlider";
import ClickableCard from "@/components/ClickableCard";
import SmartImage from "@/components/SmartImage";
import ClientOnly from "@/components/ClientOnly";
import HomePolls from "@/components/HomePolls";
import LiveWeatherAdvisor from "@/components/LiveWeatherAdvisor";
import ReviewForm from "@/components/ReviewForm";
import SlideshowMaker from "@/components/SlideshowMaker";

export default function Home() {
  return (
    <>
      {/* (removed orphaned feature card block to fix unbalanced JSX) */}
      {/* CTA ribbon */}
      <div className="mt-8 mb-2">
      <a
        href="/quote#instant"
        className="inline-flex items-center gap-2 rounded-full font-extrabold px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-600 shadow"
      >
        ⚡ Get Your Instant Quote
      </a>
    </div>


    {/* How It Works */}
<Section className="relative max-w-5xl mx-auto bg-gradient-to-br from-blue-900/80 to-black overflow-hidden">
  {/* light deco */}
  <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-sky-400/20 blur-3xl rounded-full" />

  <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 mt-2 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg leading-[1.15] pb-1">
    How It Works
  </h2>
  <p className="text-blue-100/90 text-center max-w-2xl mx-auto -mt-1 mb-7 font-medium">
    Four simple steps from “hello” to wheels rolling. Each card opens for quick details.
  </p>

  {/* connected timeline on desktop */}
  <div className="relative">
    {/* connector line (desktop) */}
    <div className="hidden md:block absolute left-0 right-0 top-[70px] h-[3px] bg-gradient-to-r from-blue-500/50 via-blue-300/50 to-blue-500/50 rounded-full" />

    <div className="grid md:grid-cols-4 gap-6 text-center relative z-10">
      {[
        {
          icon: "📞",
          label: "1. Contact Us",
          title: "Contact Us",
          body: <p>Call, email, or fill our form to get started. We’ll match the best vehicle to your trip.</p>,
        },
        {
          icon: "💬",
          label: "2. Get a Quote",
          title: "Get a Quote",
          body: <p>Fast, transparent pricing by city, date, hours, and group size. No hidden fees—ever.</p>,
        },
        {
          icon: "📝",
          label: "3. Reserve Ride",
          title: "Reserve Your Ride",
          body: (
            <p>
              Place a small deposit to lock in your vehicle. We’ll confirm details & send your agreement. In most cases
              you’ll receive a secure DocuSign to sign and (for fraud prevention) attach a photo of your ID plus the
              payment card (front only). This quick step protects both you and us from unauthorized use.
            </p>
          ),
        },
        {
          icon: "🎉",
          label: "4. Finalize & Ride",
          title: "Finalize & Ride",
          body: <p>Balance is billed 7–14 days before. On trip day, just relax—we handle the rest.</p>,
        },
      ].map((s, i) => (
        <StepCard key={i} icon={s.icon} label={s.label} title={s.title} body={s.body} stepIndex={i} />
      ))}
    </div>
  </div>

  {/* bottom CTA strip */}
  <div className="flex justify-center mt-8">
    <div className="inline-flex flex-wrap gap-2 items-center bg-white/95 text-blue-900 border border-blue-200 shadow rounded-full px-3 py-2">
      <span className="font-semibold">Need help choosing?</span>
      <a
        href="/quote#instant"
        className="rounded-full font-bold px-4 py-1.5 bg-blue-700 text-white hover:bg-blue-800 border border-blue-800 shadow-sm"
      >
        ⚡ Instant Quote
      </a>
      <a
        href="tel:8885352566"
        className="rounded-full font-bold px-4 py-1.5 bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 shadow-sm"
      >
        Call (888) 535-2566
      </a>
    </div>
  </div>
</Section>



 {/* Testimonials */}
<Section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-14 px-6 border border-blue-800/30">
  <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
    What Our Customers Say
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
    {[
      {
        name: "Paul P.",
        text: "Absolutely excellent! Great customer service! We changed drop off points several times and they were so accommodating. Gail in the office is top notch and on top of everything! The price was very good. The driver was so nice and professional. The limo looked pristine, inside and out. Use them, you won’t regret it!! Used for my son's wedding on August 11.",
      },
      {
        name: "Jessie A.",
        text: "The limo company that you need to call when you have an event. Prices and limousines and party buses are like no other limo company.",
      },
      {
        name: "Dee C.",
        text: "Definitely lives up to their name! We used them for our bachelorette/bachelor parties and our wedding and will be using them again. They were absolutely great! Even let me extend an hour when I decided my bachelorette party was too much fun and I wasn't ready to go yet!! I would absolutely recommend them and do to everyone!!",
      },
      {
        name: "Halee H.",
        text: "The price is great, inside is very clean, driver was very friendly and accommodating! Will never use another company besides this one!",
      },
    ].map((review, idx) => (
      <div
        key={idx}
        className="relative bg-[#12244e] border border-blue-800/40 rounded-2xl shadow-xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform"
      >
        {/* Quote Icon */}
        <div className="absolute -top-4 -left-4 bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-md text-2xl">
          “
        </div>

        {/* Review Text */}
        <p className="text-blue-100 italic mb-6 leading-relaxed text-lg">
          {review.text}
        </p>

        {/* Reviewer Info */}
        <div className="flex items-center gap-3 mt-auto">
          <div className="bg-blue-600 rounded-full w-11 h-11 flex items-center justify-center text-white font-bold shadow-md">
            {review.name[0]}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white">{review.name}</span>
            <span className="text-yellow-400 text-sm">★★★★★</span>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* More Reviews Button */}
  <div className="flex justify-center">
    <a
      href="/reviews"
      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700"
    >
      MORE REVIEWS
    </a>
  </div>
</Section>
            >

              <span className="font-semibold text-white">{p.k}</span>

              <span className="opacity-80">{p.v}</span>
