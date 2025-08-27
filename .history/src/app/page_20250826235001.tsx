"use client";
// Removed unused tool imports; only ToolsSlider is needed

import React from "react";
import PageLayout from "../components/PageLayout";
import Section from "../components/Section";
import LiveWeatherAdvisor from "../components/LiveWeatherAdvisor";
import ToolsSlider from '../components/ToolsSlider';
import HeroSlideshow from "../components/Hero";
import PartyBusFeatureModalButton from "../components/PartyBusFeatureModalButton";
import { useMemo } from "react";
import SlideshowMaker from "../components/SlideshowMaker";
import { ReviewForm } from "../components/ReviewForm";
import PollsSection from "../components/PollsSection";
import WhyRentWithUs from "../components/WhyRentWithUs";
import { getCategoryImages, findByFileName } from "../utils/optimizedImages";
import { resolveVehicles } from "../data/vehicles";
import VehicleGalleryCard from "../components/VehicleGalleryCard";
import { SmartImage } from "../components/SmartImage"; // SmartImage import

// Optimized manifest categories (fallback arrays removed)
const partyOptimizedAll = getCategoryImages('partyBuses');
// limo & coach raw lists no longer used directly on homepage (kept party list for events image pool)





// coachBusImages legacy array removed (using manifest)

// random subset helpers removed; homepage now uses deterministic catalog-driven vehicles

export default function Home() {
  // For demo: assign a random party bus image to each event card
  const partyBusImagesList = partyOptimizedAll.map(p => p.original);
  const eventNames = [
    "Haunted House Tours", "Thanksgiving Parties", "Christmas Parties", "Ski Resort Tours", "New Year’s Eve",
    "Sporting Events", "Weddings", "Prom", "Graduation", "Concerts / Events",
    "Bachelor Parties", "Bachelorette Parties", "Brewery Tours", "Red Rocks Concerts", "Girl’s Night Out",
    "Guys Night Out", "Retirement", "Casinos", "Corporate Parties", "Birthday Parties",
    "Kid’s Parties", "Entertainment Tours", "Charter Services", "Airport Shuttle", "Quinceanera Parties",
    "Anniversaries", "Special Dinners Out"
  ];
  const eventImages = useMemo(() => {
    // Assign a random party bus image to each event
    return eventNames.map((_, i) => partyBusImagesList[i % (partyBusImagesList.length || 1)]);
  }, [partyBusImagesList]);
  const catalog = useMemo(() => resolveVehicles(findByFileName), []);
  const partyVehicles = useMemo(() => catalog.filter(v => v.category === 'party-buses').slice(0,3), [catalog]);
  const limoVehicles = useMemo(() => catalog.filter(v => v.category === 'limousines').slice(0,3), [catalog]);
  const coachVehicles = useMemo(() => catalog.filter(v => v.category === 'coach-buses').slice(0,3), [catalog]);
  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      <Section className="!p-0 !py-0">
        <HeroSlideshow />
      </Section>
      <div className="h-10 md:h-16" />
  <Section className="max-w-6xl mx-auto">
    {/* WHY RENT WITH BUS2RIDE — award-level makeover (styling only, same content) */}
    <Section className="relative isolate overflow-hidden rounded-[28px] border border-blue-800/30 bg-gradient-to-br from-[#122a5c] via-[#112352] to-[#0e1b3c] shadow-[0_20px_60px_rgba(2,6,23,.45)]">
  {/* Ambient glow accents (no dots) */}
  <div className="pointer-events-none absolute -top-24 -left-20 h-[26rem] w-[26rem] rounded-full bg-sky-400/20 blur-3xl" />
  <div className="pointer-events-none absolute -bottom-24 -right-20 h-[26rem] w-[26rem] rounded-full bg-indigo-500/20 blur-3xl" />

  <div className="relative z-10 grid items-center gap-10 px-6 py-10 md:grid-cols-2 md:px-10 lg:gap-14">
    {/* Left: headline + features (your original content) */}
    <div>
      {/* Title with animated underline */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-center md:text-left tracking-tight leading-[1.15] mb-4">
        <span className="bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(59,130,246,.35)]">
          Why Rent With <span className="font-extrabold">Bus2Ride?</span>
        </span>
      </h2>
      <div className="mx-auto md:mx-0 mb-8 h-[4px] w-40 rounded-full bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-100" />

      {/* Your existing component — unchanged */}
      <div className="relative">
        {/* subtle glass frame */}
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-white/15 via-blue-300/10 to-transparent opacity-60 blur-sm" />
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 md:p-6">
          <WhyRentWithUs />
        </div>
      </div>

      {/* Micro trust pills (visual, not new copy) */}
  <div className="mt-6 flex flex-wrap md:flex-nowrap gap-2">
        {["4.9★ Avg", "On-Time Promise", "Clean Vehicle", "Transparent Pricing"].map((t) => (
          <span
            key={t}
    className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs md:text-sm backdrop-blur whitespace-nowrap"
          >
            {t}
          </span>
        ))}
      </div>
    </div>

    {/* Right: vehicle image showcase */}
    <div className="relative">
      {/* Framing glow + gradient ring */}
      <div className="absolute -inset-[2px] rounded-[24px] bg-gradient-to-br from-sky-300/40 via-blue-500/30 to-indigo-400/40 opacity-80 blur-sm" />
      <div className="relative group rounded-[24px] overflow-hidden border border-blue-800/40 bg-[#0f2148] shadow-[0_14px_40px_rgba(2,6,23,.55)]">
        <div className="relative">
          <SmartImage
            src="/images/18 Passenger Party Bus White Exterior.png"
            alt="Party Bus Exterior"
            className="w-full h-64 md:h-80 object-cover transition duration-700 ease-out will-change-transform group-hover:scale-[1.02]"
            sizes="(max-width:768px) 100vw, 540px" /* higher-res variant & explicit sizes to prevent upscaling blur */
          />
          {/* gloss sweep */}
          <span className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
            <span className="absolute -left-1/3 top-0 h-full w-1/2 rotate-12 bg-white/10 blur-xl transition-transform duration-700 group-hover:translate-x-[120%]" />
          </span>

          {/* spec bar (visual only) */}
          {/* Removed in-image spec bar (Seats / Premium Sound / LED Ambience) per request to remove overlay */}
        </div>

        {/* bottom action strip (keeps users moving without new copy) */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-gradient-to-t from-black/40 via-black/10 to-transparent">
          <a
            href="tel:8885352566"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition"
          >
            Call
          </a>
          <a
            href="mailto:info@bus2ride.com"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 font-bold bg-blue-800 text-white hover:bg-blue-900 border border-blue-900 transition"
          >
            Email
          </a>
          <a
            href="/quote#instant"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition"
          >
            Quote
          </a>
        </div>
      </div>

      {/* floating accent icons (decor only) */}
      <div className="pointer-events-none">
        <span className="absolute -left-4 -top-4 h-10 w-10 rounded-xl bg-white/10 border border-blue-300/30 grid place-items-center text-white/80 shadow-xl">
          🚐
        </span>
        <span className="absolute -right-4 -bottom-4 h-10 w-10 rounded-xl bg-white/10 border border-blue-300/30 grid place-items-center text-white/80 shadow-xl">
          ⭐
        </span>
      </div>
    </div>
  </div>
    </Section>
  </Section>
  {/* Party Buses Section */}
<Section className="max-w-6xl mx-auto">
  <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 mt-0 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg leading-[1.15] pb-2">
    Party Buses
  </h2>

  {/* 3 Image Boxes with left/right arrows, all clickable to /fleet */}
  <div className="relative flex items-center justify-center mb-8 mt-6" style={{ minHeight: "260px" }}>
    {/* Left Arrow */}
    <a
      href="/party-buses"
      aria-label="View previous party buses"
      className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute z-20 border-2 border-blue-200"
      tabIndex={0}
      style={{
        boxShadow: "0 2px 12px 0 rgba(30,64,175,0.10)",
        top: "calc(50% - 44px)",
        left: "-68px",
      }}
    >
      &#8592;
    </a>

    <div className="grid md:grid-cols-3 gap-6 w-full">
      {partyVehicles.map(v => (
        <VehicleGalleryCard key={v.id} vehicle={v} />
      ))}
    </div>

    {/* Right Arrow */}
    <a
      href="/party-buses"
      aria-label="View next party buses"
      className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute z-20 border-2 border-blue-200"
      tabIndex={0}
      style={{
        boxShadow: "0 2px 12px 0 rgba(30,64,175,0.10)",
        top: "calc(50% - 44px)",
        right: "-68px",
      }}
    >
      &#8594;
    </a>
  </div>

  {/* Features BELOW the 3 boxes — like “Why Rent With” buttons */}
  <div className="max-w-6xl mx-auto px-4">
    <div className="flex flex-col md:flex-row md:items-center gap-6">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6 mt-4 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg md:w-1/4">
        Popular Party Bus Features
      </h2>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-blue-900 flex-1">
        {[
          {
            text: "Lots of space to move & socialize",
            modal: {
              title: "Lots of Space to Move & Socialize",
              content:
                "Party buses are designed with open layouts and plenty of room, so your group can mingle, dance, and enjoy the ride together without feeling cramped.",
            },
          },
          {
            text: "Removable dance pole",
            modal: {
              title: "Removable Dance Pole",
              content:
                "Many party buses feature a removable dance pole for extra fun. If you prefer, it can be taken out for more space or left in for dancing.",
            },
          },
          {
            text: "Wet bars to help keep beverages cold",
            modal: {
              title: "Wet Bars to help keep beverages cold",
              content:
                "Enjoy built-in wet bars and ask us to stock it with ice and complimentary bottled water. Bring your own drinks to keep the party going!",
            },
          },
          {
            text: "Wrap-around leather seating",
            modal: {
              title: "Wrap-Around Leather Seating",
              content:
                "Luxurious wrap-around leather seating lets everyone face each other and relax in comfort, perfect for socializing.",
            },
          },
          {
            text: "Premium sound & LED lighting",
            modal: {
              title: "Premium Sound & LED Lighting",
              content:
                "Blast your favorite playlists with high-end sound systems and set the mood with vibrant LED party lighting.",
            },
          },
          {
            text: "Pro driver included",
            modal: {
              title: "Professional Driver Included",
              content:
                "Every rental comes with a licensed, experienced chauffeur so you can relax and enjoy the ride safely.",
            },
          },
        ].map((feature, idx) => (
          <li
            key={idx}
            className="flex items-center bg-white rounded-lg shadow px-4 py-3 hover:bg-blue-50 transition border border-blue-200"
          >
            <PartyBusFeatureModalButton
              title={feature.modal.title}
              content={feature.modal.content}
              label={feature.text}
            />
            <span className="text-blue-500 text-lg ml-2">→</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</Section>


{/* Limos Section */}
<Section className="max-w-6xl mx-auto">
  <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 mt-0 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg leading-[1.15] pb-2">
    Limousines
  </h2>

  {/* 3 Image Boxes with left/right arrows */}
  <div className="relative flex items-center justify-center mb-8" style={{ minHeight: "260px" }}>
    {/* Left Arrow */}
    <a
      href="/limousines"
      aria-label="View previous limos"
      className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute z-20 border-2 border-blue-200"
      tabIndex={0}
      style={{
        boxShadow: "0 2px 12px 0 rgba(30,64,175,0.10)",
        top: "calc(50% - 44px)",
        left: "-68px",
      }}
    >
      &#8592;
    </a>

    <div className="grid md:grid-cols-3 gap-6 w-full">
      {limoVehicles.map(v => (
        <VehicleGalleryCard key={v.id} vehicle={v} />
      ))}
    </div>

    {/* Right Arrow */}
    <a
      href="/limousines"
      aria-label="View next limos"
      className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute z-20 border-2 border-blue-200"
      tabIndex={0}
      style={{
        boxShadow: "0 2px 12px 0 rgba(30,64,175,0.10)",
        top: "calc(50% - 44px)",
        right: "-68px",
      }}
    >
      &#8594;
    </a>
  </div>

  {/* Features BELOW the 3 boxes */}
  <div className="max-w-6xl mx-auto px-4">
    <div className="flex flex-col md:flex-row md:items-center gap-6">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6 mt-4 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg md:w-1/4">
        Popular Limo Features
      </h2>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-blue-900 flex-1">
        {[
          {
            label: "Luxurious interiors with leather seating",
            modal: {
              title: "Luxurious Leather Interiors",
              content:
                "Our limousines feature plush leather seating and elegant interiors for a truly first-class experience.",
            },
          },
          {
            label: "Wet bar with optional ice and waters",
            modal: {
              title: "Wet bar with optional ice and waters",
              content:
                "Enjoy our wet bar in every limo. Ask us to stock it with complimentary ice and waters. Celebrate your occasion in style!",
            },
          },
          {
            label: "Premium sound system",
            modal: {
              title: "Premium Sound System",
              content:
                "Blast your favorite playlists with high-end sound systems for the ultimate party or relaxing ride.",
            },
          },
          {
            label: "Mood lighting for any occasion",
            modal: {
              title: "Mood Lighting",
              content: "Set the perfect vibe with customizable mood lighting, from romantic to party-ready.",
            },
          },
          {
            label: "Professional chauffeur included",
            modal: {
              title: "Professional Chauffeur Included",
              content:
                "Every limo comes with a licensed, experienced chauffeur for a safe and stress-free experience.",
            },
          },
          {
            label: "Perfect for weddings, proms & events",
            modal: {
              title: "Perfect for Weddings, Proms & Events",
              content:
                "Our limos are ideal for weddings, proms, birthdays, and all special occasions—arrive in style!",
            },
          },
        ].map((feature, idx) => (
          <li
            key={idx}
            className="flex items-center bg-white rounded-lg shadow px-4 py-3 hover:bg-blue-50 transition border border-blue-200"
          >
            <PartyBusFeatureModalButton title={feature.modal.title} content={feature.modal.content} label={feature.label} />
            <span className="text-blue-500 text-lg ml-2">→</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</Section>
        
{/* Coach Buses Section */}
<Section className="max-w-6xl mx-auto">
  <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 mt-0 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg leading-[1.15] pb-2">
    Coach Buses
  </h2>

  {/* 3 Image Boxes with left/right arrows */}
  <div className="relative flex items-center justify-center mb-10" style={{ minHeight: "288px" }}>
    {/* Left Arrow */}
    <a
      href="/coach-buses"
      aria-label="View previous coach buses"
      className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute z-20 border-2 border-blue-200"
      tabIndex={0}
      style={{
        boxShadow: "0 2px 12px 0 rgba(30,64,175,0.10)",
        top: "calc(50% - 56px)",
        left: "-68px",
      }}
    >
      &#8592;
    </a>

    <div className="grid md:grid-cols-3 gap-6 w-full">
      {coachVehicles.map(v => (
        <VehicleGalleryCard key={v.id} vehicle={v} />
      ))}
    </div>

    {/* Right Arrow */}
    <a
      href="/coach-buses"
      aria-label="View next coach buses"
      className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute z-20 border-2 border-blue-200"
      tabIndex={0}
      style={{
        boxShadow: "0 2px 12px 0 rgba(30,64,175,0.10)",
        top: "calc(50% - 56px)",
        right: "-68px",
      }}
    >
      &#8594;
    </a>
  </div>

  {/* Features BELOW the 3 boxes */}
  <div className="max-w-6xl mx-auto px-4">
    <div className="flex flex-col md:flex-row md:items-center gap-6">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6 mt-4 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg md:w-1/4">
        Popular Coach Bus Features
      </h2>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-blue-900 flex-1">
        {[
          {
            label: "Comfortable reclining seats",
            modal: {
              title: "Comfortable Reclining Seats",
              content: "Relax on long trips with plush, reclining seats designed for maximum comfort.",
            },
          },
          {
            label: "Wi-Fi & charging ports",
            modal: {
              title: "Wi-Fi & Charging Ports",
              content: "Stay connected on the road with onboard Wi-Fi and convenient charging ports at every seat.",
            },
          },
          {
            label: "Large luggage compartments",
            modal: {
              title: "Large Luggage Compartments",
              content: "Bring everything you need—our coach buses have spacious luggage bays for all your gear.",
            },
          },
          {
            label: "Onboard restroom on some coach buses",
            modal: {
              title: "Onboard Restroom available on some coach buses",
              content:
                "Enjoy the convenience of a clean, private restroom on your coach bus for longer journeys. Ask if your vehicle has a restroom",
            },
          },
          {
            label: "TVs & entertainment system",
            modal: {
              title: "TVs & Entertainment System",
              content: "Watch movies or presentations on flat-screen TVs with a premium entertainment system.",
            },
          },
          {
            label: "Experienced driver included",
            modal: {
              title: "Experienced Driver Included",
              content:
                "Every coach bus rental comes with a professional, experienced driver for a safe and smooth ride.",
            },
          },
        ].map((feature, idx) => (
          <li
            key={idx}
            className="flex items-center bg-white rounded-lg shadow px-4 py-3 hover:bg-blue-50 transition border border-blue-200"
          >
            <PartyBusFeatureModalButton title={feature.modal.title} content={feature.modal.content} label={feature.label} />
            <span className="text-blue-500 text-lg ml-2">→</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</Section>



  {/* Trust & Reputation */}
<Section className="relative bg-gradient-to-br from-blue-900/80 to-black overflow-visible">
  {/* soft glow orbs */}
  <div className="pointer-events-none absolute -top-24 -left-20 w-[28rem] h-[28rem] bg-sky-400/20 blur-3xl rounded-full" />
  <div className="pointer-events-none absolute -bottom-28 -right-16 w-[32rem] h-[32rem] bg-indigo-500/20 blur-3xl rounded-full" />

  <div className="max-w-5xl mx-auto px-4 text-center relative">
    <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-3 mt-10 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight leading-[1.08] pb-1">
      The Most Trusted Limo &amp; Bus Rental Company
    </h2>
    <p className="text-xl text-blue-100/90 mb-8 font-semibold">
      Trusted by thousands, booked in minutes, driven by a passion for making every ride unforgettable.
    </p>

    {/* trust stats strip with modals */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {[
        {
          stat: "4.9★",
          label: "Average Rating",
          title: "4.9★ Average Rating Across Platforms",
          content: (
            <>
              <p><strong>Consistently Excellent.</strong> Our blended rating across Google, event, and transportation review platforms averages 4.9 out of 5 stars.</p>
              <ul className="list-disc ml-5 mt-3 space-y-1 text-sm">
                <li>No bait‑and‑switch vehicles.</li>
                <li>Responsive communication before & during your trip.</li>
                <li>Clean, well‑maintained fleet with documented inspections.</li>
                <li>Professional, courteous, background‑checked drivers.</li>
              </ul>
              <p className="mt-3 text-sm text-blue-800/80">We continuously audit feedback to improve—every comment is reviewed.</p>
            </>
          ),
        },
        {
          stat: "10,000+",
          label: "Happy Riders",
          title: "10,000+ Happy Riders & Counting",
          content: (
            <>
              <p>We’ve moved thousands of guests for weddings, wine tours, corporate shuttles, prom, concerts, bachelor / bachelorette parties, and game days.</p>
              <ul className="list-disc ml-5 mt-3 space-y-1 text-sm">
                <li>Diverse fleet covers 6–56 passengers.</li>
                <li>Repeat groups rebook year after year.</li>
                <li>Dedicated coordination for multi-vehicle events.</li>
              </ul>
              <p className="mt-3 text-sm text-blue-800/80">Volume lets us keep pricing fair while investing in safer, newer vehicles.</p>
            </>
          ),
        },
        {
          stat: "On-Time",
          label: "Promise",
          title: "Our On‑Time Pickup Promise",
          content: (
            <>
              <p>Reliability matters. We target early arrival (10–15 min) so you’re never waiting curbside.</p>
              <ul className="list-disc ml-5 mt-3 space-y-1 text-sm">
                <li>Live dispatch tracking & proactive communication.</li>
                <li>Redundant routing & traffic monitoring.</li>
                <li>Backup vehicles on-call for peak periods.</li>
              </ul>
              <p className="mt-3 text-sm text-blue-800/80">If we’re late due to an operational miss, we make it right—every time.</p>
            </>
          ),
        },
        {
          stat: "100%",
          label: "Upfront Pricing",
          title: "100% Upfront, Transparent Pricing",
          content: (
            <>
              <p>No hidden mileage, fuel, or “weekend demand” add‑ons after you book.</p>
              <ul className="list-disc ml-5 mt-3 space-y-1 text-sm">
                <li>All mandatory fees disclosed before you pay.</li>
                <li>Clear overtime, cleaning, & cancellation terms.</li>
                <li>Instant quotes reflect current market + vehicle class.</li>
              </ul>
              <p className="mt-3 text-sm text-blue-800/80">You control the spend—what you see is what you pay.</p>
            </>
          ),
        },
      ].map((item) => (
        <TrustStatModalCard key={item.title} {...item} />
      ))}
    </div>

  {/* inline component for trust stat modal cards */}
  {/* Keeping inline for now to avoid extra file churn; can be refactored later */}
  { /* TrustStatModalCard component */ }
    
    

    {/* features */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
      {[
        {
          label: "Free Instant Estimates",
          title: "Free Instant Estimates",
          content:
            "Get a real-time quote for your trip in seconds. No obligation, no hidden fees—just transparent pricing.",
        },
        {
          label: "Massive Luxury Fleet",
          title: "Massive Luxury Fleet",
          content:
            "Choose from the largest selection of party buses, limos, and coach buses in the region. Find the perfect ride for any group size or occasion.",
        },
        {
          label: "Low Hourly Minimums",
          title: "Low Hourly Minimums",
          content:
            "Book for as little as 2–3 hours on most vehicles. Only pay for the time you need—perfect for short trips and special events.",
        },
        {
          label: "Professional Drivers",
          title: "Professional Drivers",
          content:
            "Every ride is chauffeured by a licensed, experienced, and friendly driver. Safety and service are our top priorities.",
        },
  ].map((feature) => (
        <div
          key={feature.label}
          className="group relative overflow-hidden bg-white rounded-2xl shadow-xl p-5 flex flex-col items-center border-2 border-blue-100"
        >
          {/* subtle gradient ring on hover */}
          <div className="pointer-events-none absolute -inset-[1px] rounded-[1.05rem] bg-gradient-to-br from-sky-300/40 via-blue-500/30 to-indigo-400/40 opacity-0 group-hover:opacity-100 blur-sm transition duration-300" />
          {/* top sheen */}
          <div className="pointer-events-none absolute -top-10 left-0 right-0 h-20 bg-gradient-to-b from-white/60 to-transparent opacity-60" />

          {/* button (opens your modal) */}
          <div className="relative z-10">
            <PartyBusFeatureModalButton
              label={feature.title}
              title={feature.title}
              content={feature.content}
            />
          </div>

          {/* chevron */}
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-500 text-2xl pointer-events-none">
            →
          </span>
        </div>
      ))}
    </div>

    {/* CTA ribbon */}
    <div className="mt-8 mb-2">
      <a
        href="/quote#instant"
        className="inline-flex items-center gap-2 rounded-full font-extrabold px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-600 shadow"
      >
        ⚡ Get Your Instant Quote
      </a>
    </div>
  </div>
</Section>


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
          body: <p>Place a small deposit to lock in your vehicle. We’ll confirm details & send your agreement.</p>,
        },
        {
          icon: "🎉",
          label: "4. Finalize & Ride",
          title: "Finalize & Ride",
          body: <p>Balance is billed 7–14 days before. On trip day, just relax—we handle the rest.</p>,
        },
      ].map((s, i) => (
        <div key={i} className="relative">
          {/* connector dots (desktop) */}
          <div className="hidden md:block absolute -top-[11px] left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-white border-2 border-blue-300 shadow" />
          {/* card */}
          <div className="group bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border-2 border-blue-100 hover:shadow-2xl transition relative h-full">
            {/* shimmering edge */}
            <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-blue-400/0 group-hover:ring-blue-400/30 transition" />
            {/* icon */}
            <span className="text-4xl mb-3">{s.icon}</span>
            {/* modal trigger */}
            <PartyBusFeatureModalButton
              label={s.label}
              title={s.title}
              content={<div className="text-gray-700 text-left">{s.body}</div>}
            />
            {/* arrow */}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 text-2xl pointer-events-none">
              →
            </span>

            {/* step badge */}
            <div className="absolute -top-3 left-3">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white border border-blue-300/40 tracking-wide">
                STEP {i + 1}
              </span>
            </div>
          </div>
        </div>
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
        text: "The limo company that you need to call when you have an event. Prices and limos and party buses are like no other limo company.",
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


{/* TOOLS — award-level wrapper around your existing ToolsSlider */}
<Section id="tools" className="relative max-w-7xl mx-auto overflow-hidden">
  {/* subtle background lighting */}
  <div className="pointer-events-none absolute -top-28 -left-20 w-[34rem] h-[34rem] bg-sky-400/15 blur-3xl rounded-full" />
  <div className="pointer-events-none absolute -bottom-24 -right-16 w-[30rem] h-[30rem] bg-indigo-500/15 blur-3xl rounded-full" />

  {/* heading */}
  <h2 className="text-4xl md:text-5xl font-extrabold text-center mt-10 mb-3 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
    Tools
  </h2>
  <p className="text-lg md:text-xl text-center text-blue-100 max-w-3xl mx-auto px-4">
    Plan smarter with our free, pro-grade helpers—quotes, splitters, route planners, comfort checks, and more.
  </p>

  {/* quick stat pills */}
  <div className="mt-6 mb-6 flex flex-wrap items-center justify-center gap-3 px-4">
    {[
      { k: "Instant", v: "⚡ Quotes" },
      { k: "Smart", v: "🧠 Planning" },
      { k: "Zero", v: "💵 Fees" },
      { k: "Mobile", v: "📱 Friendly" },
    ].map((p) => (
      <div
        key={p.v}
        className="inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-white/10 backdrop-blur px-4 py-2 text-sm text-blue-100 shadow"
      >
        <span className="font-semibold text-white">{p.k}</span>
        <span className="opacity-80">{p.v}</span>
      </div>
    ))}
  </div>

  {/* framed slider card */}
  <div className="relative mx-auto max-w-6xl">
    {/* glow border */}
    <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-br from-sky-300/40 via-blue-500/30 to-indigo-400/40 opacity-60 blur-sm" />
    <div className="relative rounded-3xl bg-[#0f2148]/80 backdrop-blur border border-blue-800/40 shadow-[0_10px_30px_rgba(2,6,23,.35)] p-5 md:p-7">
      {/* title bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <span className="ml-2 text-blue-100/90 text-sm">
          Bus2Ride Tools • <span className="opacity-70">To Help Our Customers Make Decisions</span>
        </span>
        <span className="ml-auto text-[11px] font-semibold text-emerald-300/90 bg-emerald-500/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
          New tools added weekly
        </span>
      </div>

      {/* your existing slider lives here */}
      <div className="rounded-2xl bg-white shadow-xl border-2 border-blue-100 p-4 md:p-6">
        <ToolsSlider />
      </div>

      {/* footer helper row */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        <a
          href="/quote#instant"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition text-center"
        >
          ⚡ Get Instant Quote
        </a>
        <a
          href="/tools"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold bg-blue-700 text-white hover:bg-blue-800 border border-blue-800 transition text-center"
        >
          🔧 Explore All Tools
        </a>
        <a
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold bg-blue-900 text-white hover:bg-blue-950 border border-blue-950 transition text-center"
        >
          🧑‍💼 Need a Custom Tool?
        </a>
      </div>
    </div>
  </div>

  {/* small helper note */}
  <div className="text-center text-blue-200/80 text-sm mt-6">
    Tip: Open on mobile to see the tools adapt perfectly to small screens.
  </div>
</Section>

  {/* Polls */}
  <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black">
  <div className="max-w-6xl mx-auto px-4 mt-12 mb-2">
  <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 mt-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight">Limo Industry Polls</h2>
    <p className="text-lg text-center text-blue-100 mb-6 max-w-2xl mx-auto">
      See what real riders and industry pros are saying! Our live polls help you compare trends, get honest opinions, and make smarter choices for your next trip. Vote, view results, and join the conversation.
    </p>
  </div>
  <PollsSection />
  </Section>
  {/* Live Weather & Comfort Advisor */}
  <Section className="bg-gradient-to-br from-blue-900/80 to-black">
  <div>
    <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 mt-0 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg leading-[1.15] pb-2 tracking-tight">
      Smart Weather & Comfort Tips
    </h2>
    <p className="text-lg text-center text-blue-100 mb-10 max-w-2xl mx-auto">
      Get real-time weather and comfort tips for your trip—no matter the season or city. We check the latest forecast and give you practical advice on what to wear, what to bring, and how to make your ride as comfortable as possible. Stay prepared and enjoy your journey!
    </p>
    <LiveWeatherAdvisor />
  </div>
  </Section>

      {/* Review Submission & Slideshow Maker (Python backend suggestion) */}
      <Section className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">Leave a Review & Get Featured Above!</span>
            </h2>
            <p className="text-blue-100 mb-4">
              Want to see your review in the main section above? Share your Bus2Ride experience below! Submit your review, add photos, or even upload a video. The best reviews will be featured at the top of this page for everyone to see.
            </p>
            <p className="text-green-400 font-semibold mb-2">
              Featured reviews may appear on our homepage and social media.
            </p>
            <ReviewForm />
          </div>
          <div className="flex-1 min-w-[260px] border-l border-gray-200 pl-0 md:pl-8 flex flex-col items-center md:items-start">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">Make & Share Your Slideshow Video</span>
            </h2>
            <p className="text-blue-100 mb-4">
              Upload your favorite party or limo photos (or anything else you’d like to share) and we’ll instantly turn them into a fun, shareable slideshow video—perfect for posting on Facebook, Instagram, or linking on your blog, website, or email. Show off your ride, your event, or your crew—then share the link anywhere!
            </p>
            <div id="slideshow-tool" className="w-full flex flex-col items-center mb-2" />
            <SlideshowMaker />
          </div>
        </div>
      </Section>

  {/* EVENTS & OCCASIONS — 4 per row, wide cards, no image overlay */}
<Section className="max-w-7xl mx-auto relative overflow-hidden bg-gradient-to-br from-blue-900/80 to-black">
  {/* (Optional) Confetti decorations — keep or remove */}
  <svg className="absolute left-0 top-0 w-48 h-48 opacity-20 pointer-events-none" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="12" fill="#60a5fa" />
    <rect x="120" y="30" width="18" height="18" rx="4" fill="#fbbf24" />
    <circle cx="170" cy="80" r="8" fill="#f472b6" />
    <rect x="60" y="120" width="14" height="14" rx="3" fill="#34d399" />
    <circle cx="180" cy="180" r="10" fill="#818cf8" />
  </svg>
  <svg className="absolute right-0 bottom-0 w-56 h-56 opacity-20 pointer-events-none" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="180" cy="40" r="14" fill="#fbbf24" />
    <rect x="30" y="160" width="20" height="20" rx="5" fill="#60a5fa" />
    <circle cx="60" cy="60" r="10" fill="#f472b6" />
    <rect x="120" y="120" width="16" height="16" rx="4" fill="#34d399" />
    <circle cx="40" cy="200" r="12" fill="#818cf8" />
  </svg>

  <div className="relative z-10 max-w-6xl mx-auto px-4 pt-12">
    {/* Header */}
    <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
      Events & Occasions
    </h2>
    <p className="text-lg text-center text-blue-100 mb-12 max-w-2xl mx-auto">
      Weddings, proms, concerts, sporting events, winery tours, nights out—pick your occasion and we’ll match the perfect ride.
    </p>

    {/* Grid: 1 / 2 / 3 / 4 columns */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
      {eventNames.map((event, i) => {
        const slug = event.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const img = eventImages[i % eventImages.length];
        const insertCta = i === 7 || i === 15; // after 8th and 16th card (aligned with 4-per-row)
        return (
          <React.Fragment key={event}>
            {/* Event Card (outer wrapper is a div acting like a link to avoid nested <a> elements) */}
            <div
              role="link"
              tabIndex={0}
              aria-label={`${event} details`}
              onClick={() => { window.location.href = `/events/${slug}`; }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = `/events/${slug}`; } }}
              className="group cursor-pointer relative rounded-[24px] overflow-hidden border border-blue-800/30 bg-[#173264] shadow-[0_10px_30px_rgba(2,6,23,.35)] hover:shadow-2xl hover:-translate-y-1 transition focus:outline-none focus:ring-4 focus:ring-blue-400/40"
            >
              {/* Image (taller, roomy) */}
              <div className="h-80 w-full bg-[#18356e]">
                <SmartImage
                  src={img}
                  alt={event}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              {/* Body (title + subtitle, then buttons) */}
              <div className="px-6 py-6">
                <h3 className="text-2xl font-extrabold text-white tracking-tight mb-1">{event}</h3>
                <p className="text-blue-100/90 text-sm mb-5">
                  On-time pickups • Clean rides • Seamless drop-offs
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <a
                    href="tel:8885352566"
                    className="inline-flex items-center justify-center rounded-xl px-3 py-3 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition"
                  >
                    Call
                  </a>
                  <a
                    href="mailto:info@bus2ride.com"
                    className="inline-flex items-center justify-center rounded-xl px-3 py-3 font-bold bg-blue-800 text-white hover:bg-blue-900 border border-blue-900 transition"
                  >
                    Email
                  </a>
                  <a
                    href="/quote#instant"
                    className="inline-flex items-center justify-center rounded-xl px-3 py-3 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition"
                  >
                    Quote
                  </a>
                </div>
              </div>

              {/* Soft glow on hover */}
              <div className="pointer-events-none absolute -inset-[1px] rounded-[24px] opacity-0 group-hover:opacity-100 transition duration-300 blur-sm bg-gradient-to-br from-sky-300/20 via-blue-500/20 to-indigo-400/20" />
            </div>

            {/* Mid-grid CTA bands after full rows (8th, 16th, …) */}
            {insertCta && (
              <div className="col-span-full">
                <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-2xl shadow-xl px-6 md:px-10 py-10 flex flex-col items-center w-full border-2 border-blue-400">
                  <div className="text-3xl md:text-4xl font-extrabold text-center mb-3 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
                    Ready to Book or Have Questions?
                  </div>
                  <div className="mb-6 text-lg text-blue-100 text-center">
                    Call <a href="tel:8885352566" className="underline font-bold">888-535-2566</a> or email{" "}
                    <a href="mailto:info@bus2ride.com" className="underline font-bold">info@bus2ride.com</a>
                  </div>
                  <a
                    href="/quote#instant"
                    className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition border border-emerald-600"
                  >
                    Get a Free Quote
                  </a>
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>

    {/* Final CTA */}
    <div className="flex justify-center mt-12">
      <a
        href="/events"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700"
      >
        Browse All Events
      </a>
    </div>
  </div>
</Section>


   {/* Did You Know (Premium Cards, 8 items, 4 per row) */}
<Section className="relative rounded-2xl border border-blue-400 bg-gradient-to-br from-blue-900/80 to-black shadow-xl my-12">
  <div className="mx-auto max-w-6xl p-6 md:p-8">
    <h3 className="text-4xl md:text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
      Did You Know?
    </h3>

    {/* Mobile: horizontal snap; MD: 2 cols; LG: 4 cols */}
    <div
      className="
        md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6
        flex gap-5 overflow-x-auto pb-2
        snap-x snap-mandatory
        -mx-4 px-4 md:m-0 md:p-0
        [scrollbar-width:none] [-ms-overflow-style:'none'] [&::-webkit-scrollbar]:hidden
        [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]
      "
    >
      {[
        { icon: "🛋️", title: "Book by comfort, not max headcount", desc: "Most buses seat more than their ‘comfortable’ number." },
        { icon: "🎓", title: "Prom Saturdays sell out first", desc: "Book 3–6 weeks early (Mar–May) for best selection." },
        { icon: "🚦", title: "Gameday traffic can double travel time", desc: "Add a 30–45 min buffer for big events." },
        { icon: "💡", title: "LED party lighting uses almost no power", desc: "Run it the whole trip for max fun." },
        { icon: "📍", title: "Most venues require a loading zone", desc: "Ask us for the exact pin to avoid delays." },
        { icon: "📅", title: "Weekdays book easier (and often cheaper)", desc: "If you're flexible, Tue–Thu usually have more options and better rates." },
        // NEW
        { icon: "🧭", title: "Each extra pickup adds time", desc: "Plan +10–15 minutes per additional stop to stay on schedule." },
        // NEW
        { icon: "⏰", title: "Early departures beat traffic", desc: "Leaving 30–45 minutes earlier can avoid rush + reduce overtime risk." },
      ].map((fact, idx) => (
        <div
          key={idx}
          className="
            group
            min-w-[240px] md:min-w-0
            snap-start
            rounded-2xl border border-white/20 bg-white/90 backdrop-blur
            shadow-lg ring-1 ring-blue-400/30
            p-6 flex flex-col items-center text-center
            transition-transform duration-200 ease-out
            hover:-translate-y-1 hover:shadow-xl hover:ring-blue-400/50
          "
        >
          <div className="h-12 w-12 rounded-xl bg-blue-50 grid place-items-center text-2xl mb-3">
            {fact.icon}
          </div>
          <div className="font-semibold text-lg text-blue-900 mb-1">{fact.title}</div>
          <div className="text-blue-800 text-base">{fact.desc}</div>
        </div>
      ))}
    </div>

    <div className="flex justify-center mt-8">
      <a
        href="/industry-secrets"
        className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-xl text-lg transition"
      >
        More Industry Secrets <span aria-hidden>→</span>
      </a>
    </div>
  </div>
</Section>






  {/* Blog Topics header */}
<div className="max-w-6xl mx-auto px-4 mb-2">
  <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 md:mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg leading-[1.15] pb-2 tracking-tight">
    Blog Topics
  </h2>
  <p className="text-lg text-center text-blue-100 mb-8 md:mb-10 max-w-2xl mx-auto">
    Dive into our expert blog for tips, guides, and real-world advice on planning the perfect group trip. From wedding shuttles to prom safety, cost breakdowns, and more—get the knowledge you need to book with confidence and make your event unforgettable.
  </p>
</div>

{/* Blog Cards with photo Read More overlay + footer CTA */}
<Section className="bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl border border-blue-400 my-12">
  <div className="max-w-6xl mx-auto p-6 md:p-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
      {[
        {
          icon: "💍",
          title: "Wedding Shuttle Timeline: Exactly When to Book & How Many Runs",
          desc:
            "A step-by-step guide to planning your wedding shuttle, including timing and logistics for stress-free transport.",
          img: "/images/Bus-3.png",
          href: "/blog/wedding-shuttle-timeline",
          tag: "Weddings",
        },
        {
          icon: "🚌",
          title: "Prom Bus Safety & Rules (Parents’ Quick Guide)",
          desc:
            "Everything parents need to know about prom bus safety, rules, and peace of mind for the big night.",
          img: "/images/Bus-4.png",
          href: "/blog/prom-bus-safety",
          tag: "Prom",
        },
        {
          icon: "🏟️",
          title: "College Gameday Bus: Tailgate Checklist + Stadium Drop-offs (DAL/AUS/HOU/DEN)",
          desc:
            "Your ultimate checklist for a winning tailgate and smooth stadium drop-off in major cities.",
          img: "/images/Bus-5.png",
          href: "/blog/college-gameday-bus-checklist",
          tag: "Sports",
        },
        {
          icon: "💰",
          title: "How Much Does a Party Bus Cost in [City]? (Real Ranges + Examples)",
          desc:
            "See real price ranges and examples for party bus rentals in your city, so you can budget with confidence.",
          img: "/images/Bus-2.png",
          href: "/blog/party-bus-cost-city",
          tag: "Pricing",
        },
        {
          icon: "🤔",
          title: "Charter Bus vs Party Bus vs Limo: What’s Right for Your Group?",
          desc:
            "Compare the pros and cons of each vehicle type to find the perfect fit for your group and occasion.",
          img: "/images/Bus-1.png",
          href: "/blog/charter-vs-partybus-vs-limo",
          tag: "Guides",
        },
        {
          icon: "🗺️",
          title: "Multi-Stop Night Out: Route Planning, Safety & Timing",
          desc:
            "How to pick smart routes, set time windows, and keep your group together across multiple pickups and drop-offs.",
          img: "/images/Bus-1.png",
          href: "/blog/multi-stop-night-out",
          tag: "Night Out",
        },
      ].map((post, idx) => (
        <article
          key={idx}
          className="group bg-white rounded-2xl overflow-hidden border-2 border-blue-200/70 hover:border-blue-300 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 focus-within:ring-4 focus-within:ring-blue-300/40"
        >
          {/* Photo with overlay Read More */}
          <div className="relative h-56 w-full bg-blue-50">
            <SmartImage
              src={post.img}
              alt={post.title}
              className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            {/* Tag pill */}
            <span className="absolute top-3 left-3 rounded-full bg-blue-700/90 text-white text-xs font-bold px-3 py-1 border border-white/20 shadow">
              {post.tag}
            </span>

            {/* READ MORE overlay (image-level) */}
            <a
              href={post.href}
              className="absolute inset-x-0 bottom-0 p-3 md:p-4"
              aria-label={`Read more: ${post.title}`}
            >
              <span className="pointer-events-auto inline-flex items-center gap-2 rounded-xl bg-black/45 backdrop-blur px-4 py-2 text-white text-sm font-bold border border-white/20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
                Read More
                <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
                  <path
                    d="M13 5l7 7-7 7M5 12h14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 text-2xl mb-2">
              <span className="text-blue-500">{post.icon}</span>
              <h3 className="text-lg font-extrabold text-blue-900 leading-snug">
                {post.title}
              </h3>
            </div>
            <p className="text-blue-800/90 mb-5 flex-1">
              {post.desc}
            </p>

            {/* Footer CTA (secondary) */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-700/80">
                Read time: 4–6 min
              </span>
              <a
                href={post.href}
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg border border-blue-800 transition"
              >
                Read More
                <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-90">
                  <path
                    d="M13 5l7 7-7 7M5 12h14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Soft hover glow */}
          <div className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm bg-gradient-to-br from-sky-300/20 via-blue-500/20 to-indigo-400/20" />
        </article>
      ))}
    </div>

    {/* More posts CTA */}
    <div className="flex justify-center mt-2 md:mt-4">
      <a
        href="/blog"
        className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-xl transition inline-block text-center border border-blue-800"
      >
        More Blog Posts
      </a>
    </div>
  </div>
</Section>





  {/* Contact & Booking CTA */}
  <Section className="bg-blue-900 text-white">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight leading-[1.15] pb-2">Book Your Party Bus or Limo Today!</h2>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
        <a href="tel:8885352566" className="rounded-xl font-bold px-6 py-3 bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 shadow">Call (888) 535-2566</a>
  <a href="/quote#instant" className="rounded-xl font-bold px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-600 shadow">Get Instant Quote</a>
        <a href="mailto:info@bus2ride.com" className="rounded-xl font-bold px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white border border-blue-800 shadow">Email Us</a>
      </div>
    </div>
  </Section>
  </PageLayout>
  );
}