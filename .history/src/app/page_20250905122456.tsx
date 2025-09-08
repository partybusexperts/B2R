import React from "react";
import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import StepCard from "@/components/StepCard";
import ToolsSlider from "@/components/ToolsSlider";
import ClickableCard from "@/components/ClickableCard";
import SmartImage from "@/components/SmartImage";
import ClientOnly from "@/components/ClientOnly";
import HomePolls from "@/components/HomePolls";
import LiveWeatherAdvisor from "@/components/LiveWeatherAdvisor";
import { ReviewForm } from "@/components/ReviewForm";
// Small fallbacks for event arrays used in page markup (keeps file compiling)
const eventNames: string[] = [];
const eventImages: Array<{ original?: string; alt?: string } | undefined> = [];
const eventImageMap: Record<string, string> = {};
const eventBlurbMap: Record<string, string> = {};
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

  import { fetchHomePage } from "@/lib/pages";
  import { renderBlock } from "@/components/blocks/registry";

  // Small, safe server-rendered homepage: fetch page definition from DB and render blocks
  export default async function Home() {
    const data = await fetchHomePage();
    if (!data) {
      return <main className="p-8">No page found.</main>;
    }
    return <main>{data.blocks.map((b: any) => renderBlock(b))}</main>;
  }
        href="tel:8885352566"
