"use client";
// Removed unused tool imports; only ToolsSlider is needed

import React from "react";
import LiveWeatherAdvisor from "../components/LiveWeatherAdvisor";
import ToolsSlider from '../components/ToolsSlider';
import HeroSlideshow from "../components/Hero";
import PartyBusFeatureModalButton from "../components/PartyBusFeatureModalButton";
import { useMemo } from "react";
import Link from "next/link";
import SlideshowMaker from "../components/SlideshowMaker";
import { ReviewForm } from "../components/ReviewForm";
import PollsSection from "../components/PollsSection";

// List of images for each vehicle type
const partyBusImages = [
  "/images/18 Passenger White Party Bus Exterior.png",
  "/images/18 Passenger White Party Bus Interior.png",
  "/images/20 Passenger White Party Bus Exterior.png",
  "/images/36 Passenger Party Bus Exterior 4.png",
  "/images/Bus-1.png",
  "/images/Bus-2.png",
  "/images/Bus-3.png",
  "/images/Bus-4.png",
  "/images/Bus-5.png",
  "/images/17 Passenger Black Party Bus Exterior.png",
];

const limoImages = [
  "/images/10 Passenger Black Lincoln Stretch Limo Exterior Black.png",
  "/images/10 Passenger Chrysler 300 Limo Exterior.png",
  "/images/10 Passenger Lincoln Stretch Limo Exterior 2.png",
  "/images/10 Passenger Lincoln Stretch Limo Exterior 3.png",
  "/images/10 Passenger Lincoln Stretch Limo Interior.png",
  "/images/10 Passenger Lincoln Stretch Limo Interior Clean.png",
  "/images/10 Passenger Lincoln Stretch Limo Interior Very Clean.png",
  "/images/10 Passenger Lincoln Stretch Limo Inside.png",
  "/images/16 Passenger Ford Excursion Limousine Interior.png",
  "/images/16 Passenger Ford Excursion Stretch Limo Interior.png",
  "/images/16_Passenger_Stretch_Excursion_Exterior_optimized.jpg",
  "/images/18 Passenger Cadillac Escalade Limo Exterior.png",
  "/images/18 Passenger Ford Excursion Limo Exterior 2.png",
  "/images/18 Passenger Ford Excursion Limo Inside.png",
  "/images/18 Passenger Hummer Limo Exterior.png",
  "/images/18 Passenger Hummer Limo Inside.png",
  "/images/18 Passenger Hummer Limo Interior.png",
  "/images/10 Passenger Sprinter Van Limo Style Interior 1.png",
  "/images/12 Passenger Executive Style Sprinter Van Exterior.png",
  "/images/14 Passenger Sprinter Van Limo Style Exterior Door Open.png",
  "/images/14 Passenger Sprinter Van Limo Style Interior Again.png",
];





const coachBusImages = [
  "/images/Bus-1.png",
  "/images/Bus-2.png",
  "/images/Bus-3.png",
  "/images/Bus-4.png",
  "/images/Bus-5.png",
];

import { useEffect, useState } from "react";

function getRandomImages(arr: string[], count: number) {
  // Deterministic: just take the first N for SSR
  return arr.slice(0, count);
}

function useShuffledImages(arr: string[], count: number) {
  const [shuffled, setShuffled] = useState(() => arr.slice(0, count));
  useEffect(() => {
    // Shuffle only on client
    const shuffledArr = arr.slice().sort(() => 0.5 - Math.random()).slice(0, count);
    setShuffled(shuffledArr);
  }, [arr, count]);
  return shuffled;
}

import WhyRentWithUs from "../components/WhyRentWithUs";

export default function Home() {
  // For demo: assign a random party bus image to each event card
  const partyBusImagesList = [
    "/images/18 Passenger White Party Bus Exterior.png",
    "/images/18 Passenger White Party Bus Interior.png",
    "/images/20 Passenger White Party Bus Exterior.png",
    "/images/36 Passenger Party Bus Exterior 4.png",
    "/images/Bus-1.png",
    "/images/Bus-2.png",
    "/images/Bus-3.png",
    "/images/Bus-4.png",
    "/images/Bus-5.png",
    "/images/17 Passenger Black Party Bus Exterior.png",
  ];
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
    return eventNames.map((_, i) => partyBusImagesList[i % partyBusImagesList.length]);
  }, []);
  return (
  <>

  {/* Hero Slideshow (assuming it’s imported) */}
  <HeroSlideshow />
  {/* Removed phone button below hero/header */}

      {/* Why Rent With Us */}
    <section className="max-w-6xl mx-auto px-4 py-16 bg-gradient-to-r from-white via-blue-50 to-white rounded-3xl shadow-xl flex flex-col md:grid md:grid-cols-2 gap-10 items-center">
      <div>
      <h2
        className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 tracking-tight font-serif drop-shadow-sm"
        style={{ letterSpacing: "0.01em" }}
      >
        Why Rent With <span className="text-blue-700">Bus2Ride?</span>
      </h2>
  {/* Feature list moved to Client Component */}
  <WhyRentWithUs />
      </div>
      <div className="flex justify-center">
      <img
        src="/images/18 Passenger White Party Bus Exterior.png"
        alt="Party Bus Exterior"
        className="w-[420px] h-64 md:w-[480px] md:h-80 object-cover rounded-3xl border-4 border-blue-100 shadow-2xl"
      />
      </div>
    </section>


      {/* CTA after Blog & Resources */}


      {/* Party Buses Section */}
  <section className="max-w-6xl mx-auto px-4 py-12">
    <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 text-center mb-8 tracking-tight">
      Party Buses
    </h2>

    {/* 3 Image Boxes with left/right arrows, all clickable to /fleet */}
    <div className="relative flex items-center justify-center mb-8" style={{ minHeight: '260px' }}>
      {/* Left Arrow - absolutely positioned, vertically centered with the images, with extra space */}
      <a
        href="/fleet"
        aria-label="View previous party buses"
        className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute z-20 border-2 border-blue-200"
        tabIndex={0}
        style={{
          boxShadow: '0 2px 12px 0 rgba(30,64,175,0.10)',
          top: 'calc(50% - 44px)',
          left: '-68px' // was -48px, now 20px farther for more space
        }}
      >
        &#8592;
      </a>
      <div className="grid md:grid-cols-3 gap-6 w-full">
        {useShuffledImages(partyBusImages, 3).map((img, idx) => (
          <div
            key={img}
            className="bg-white rounded-2xl shadow-xl p-4 flex flex-col items-center"
          >
            <img
              src={img}
              alt="Party Bus"
              className="w-full h-60 object-cover rounded-2xl mb-4"
            />
            <h4 className="text-base font-bold mb-2">Party Bus {idx + 1}</h4>
            <div className="flex flex-col gap-2 w-full">
              <a
                href="tel:8885352566"
                className="w-full bg-blue-700 text-white font-bold py-1 rounded-lg hover:bg-blue-800 transition text-center text-base px-3 font-serif"
              >
                888-535-2566
              </a>
              <a
                href="mailto:info@bus2ride.com"
                className="w-full bg-blue-600 text-white font-bold py-1 rounded-lg hover:bg-blue-700 transition text-center text-base px-3 font-serif"
              >
                Email Now
              </a>
              <a
                href="/quote"
                className="w-full bg-green-500 text-white font-bold py-1 rounded-lg hover:bg-green-600 transition text-center text-base px-3 font-serif"
              >
                Instant Live Quote
              </a>
            </div>
          </div>
        ))}
      </div>
      {/* Right Arrow - absolutely positioned, vertically centered with the images, with extra space */}
      <a
        href="/fleet"
        aria-label="View next party buses"
        className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute z-20 border-2 border-blue-200"
        tabIndex={0}
        style={{
          boxShadow: '0 2px 12px 0 rgba(30,64,175,0.10)',
          top: 'calc(50% - 44px)',
          right: '-68px' // was -48px, now 20px farther for more space
        }}
      >
        &#8594;
      </a>
    </div>

    {/* Features BELOW the 3 boxes — EXACT same format as "Why Rent With" buttons */}
    {/* Party Bus Features as Modal Buttons (like Why Rent With Us) */}
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
      <h2 className="text-2xl font-bold text-blue-900 md:w-1/4">
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
          text: "Wet bars with ice & bottled water",
          modal: {
          title: "Wet Bars with Ice & Bottled Water",
          content:
            "Enjoy built-in wet bars stocked with ice and complimentary bottled water. Bring your own drinks to keep the party going!",
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
    {/* End Party Bus Features */}
    </section>

      {/* Limos Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
  <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 text-center mb-8 tracking-tight">
          Limousines
        </h2>
        {/* 3 Image Boxes with left/right arrows, all clickable to /fleet */}
        <div className="relative flex items-center justify-center mb-8" style={{ minHeight: '260px' }}>
          {/* Left Arrow - absolutely positioned, vertically centered with the images, with extra space */}
          <a
            href="/fleet"
            aria-label="View previous limos"
            className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute z-20 border-2 border-blue-200"
            tabIndex={0}
            style={{
              boxShadow: '0 2px 12px 0 rgba(30,64,175,0.10)',
              top: 'calc(50% - 44px)',
              left: '-68px'
            }}
          >
            &#8592;
          </a>
          <div className="grid md:grid-cols-3 gap-6 w-full">
            {getRandomImages(limoImages, 3).map((img, idx) => (
              <div
                key={img}
                className="bg-white rounded-2xl shadow-xl p-4 flex flex-col items-center"
              >
                <img
                  src={img}
                  alt="Limo"
                  className="w-full h-60 object-cover rounded-2xl mb-4"
                />
                <h4 className="text-base font-bold mb-2">Limo {idx + 1}</h4>
                <div className="flex flex-col gap-2 w-full">
                  <a
                    href="tel:8885352566"
                    className="w-full bg-blue-700 text-white font-bold py-1 rounded-lg hover:bg-blue-800 transition text-center text-base px-3 font-serif"
                  >
                    888-535-2566
                  </a>
                  <a
                    href="mailto:info@bus2ride.com"
                    className="w-full bg-blue-600 text-white font-bold py-1 rounded-lg hover:bg-blue-700 transition text-center text-base px-3 font-serif"
                  >
                    Email Now
                  </a>
                  <a
                    href="/quote"
                    className="w-full bg-green-500 text-white font-bold py-1 rounded-lg hover:bg-green-600 transition text-center text-base px-3 font-serif"
                  >
                    Instant Live Quote
                  </a>
                </div>
              </div>
            ))}
          </div>
          {/* Right Arrow - absolutely positioned, vertically centered with the images, with extra space */}
          <a
            href="/fleet"
            aria-label="View next limos"
            className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute z-20 border-2 border-blue-200"
            tabIndex={0}
            style={{
              boxShadow: '0 2px 12px 0 rgba(30,64,175,0.10)',
              top: 'calc(50% - 44px)',
              right: '-68px'
            }}
          >
            &#8594;
          </a>
        </div>

        {/* Features BELOW the 3 boxes, styled like "Why Rent With" buttons */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <h2 className="text-2xl font-bold text-blue-900 md:w-1/4">
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
          label: "Complimentary champagne & ice",
          modal: {
          title: "Complimentary Champagne & Ice",
          content:
            "Enjoy complimentary champagne (21+) and ice in every limo rental. Celebrate your occasion in style!",
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
          content:
            "Set the perfect vibe with customizable mood lighting, from romantic to party-ready.",
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
          <PartyBusFeatureModalButton
          title={feature.modal.title}
          content={feature.modal.content}
          label={feature.label}
          />
          <span className="text-blue-500 text-lg ml-2">→</span>
        </li>
        ))}
      </ul>
      </div>
    </div>
    </section>



      {/* Coach Buses Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
  <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 text-center mb-8 tracking-tight">
        Coach Buses
      </h2>

      {/* 3 Image Boxes with left/right arrows, all clickable to /fleet */}
      <div className="relative flex items-center justify-center mb-10" style={{ minHeight: '288px' }}>
        {/* Left Arrow - absolutely positioned, vertically centered with the images, with extra space */}
        <a
          href="/fleet"
          aria-label="View previous coach buses"
          className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute z-20 border-2 border-blue-200"
          tabIndex={0}
          style={{
            boxShadow: '0 2px 12px 0 rgba(30,64,175,0.10)',
            top: 'calc(50% - 56px)', // h-72 = 288px, so 144px, but offset for margin/padding
            left: '-68px'
          }}
        >
          &#8592;
        </a>
        <div className="grid md:grid-cols-3 gap-6 w-full">
          {getRandomImages(coachBusImages, 3).map((img, idx) => (
            <div
              key={img}
              className="bg-white rounded-2xl shadow-xl p-5 flex flex-col items-center"
            >
              <img
                src={img}
                alt="Coach Bus"
                className="w-full h-72 object-cover rounded-2xl mb-5"
              />
              <h4 className="text-lg font-bold mb-2">Coach Bus {idx + 1}</h4>
              <div className="flex flex-col gap-2 w-full">
                <a
                  href="tel:8885352566"
                  className="w-full bg-blue-700 text-white font-bold py-1.5 rounded-lg hover:bg-blue-800 transition text-center text-sm px-3"
                >
                  888-535-2566
                </a>
                <a
                  href="mailto:info@bus2ride.com"
                  className="w-full bg-blue-600 text-white font-bold py-1.5 rounded-lg hover:bg-blue-700 transition text-center text-sm px-3"
                >
                  Email Now
                </a>
                <a
                  href="/quote"
                  className="w-full bg-green-500 text-white font-bold py-1.5 rounded-lg hover:bg-green-600 transition text-center text-sm px-3"
                >
                  Instant Live Quote
                </a>
              </div>
            </div>
          ))}
        </div>
        {/* Right Arrow - absolutely positioned, vertically centered with the images, with extra space */}
        <a
          href="/fleet"
          aria-label="View next coach buses"
          className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute z-20 border-2 border-blue-200"
          tabIndex={0}
          style={{
            boxShadow: '0 2px 12px 0 rgba(30,64,175,0.10)',
            top: 'calc(50% - 56px)',
            right: '-68px'
          }}
        >
          &#8594;
        </a>
      </div>

      {/* Features BELOW the 3 boxes, styled like "Why Rent With" buttons */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
        <h2 className="text-2xl font-bold text-blue-900 md:w-1/4">
          Popular Coach Bus Features
        </h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-blue-900 flex-1">
          {[
          {
            label: "Comfortable reclining seats",
            modal: {
            title: "Comfortable Reclining Seats",
            content:
              "Relax on long trips with plush, reclining seats designed for maximum comfort.",
            },
          },
          {
            label: "Wi-Fi & charging ports",
            modal: {
            title: "Wi-Fi & Charging Ports",
            content:
              "Stay connected on the road with onboard Wi-Fi and convenient charging ports at every seat.",
            },
          },
          {
            label: "Large luggage compartments",
            modal: {
            title: "Large Luggage Compartments",
            content:
              "Bring everything you need—our coach buses have spacious luggage bays for all your gear.",
            },
          },
          {
            label: "Onboard restroom",
            modal: {
            title: "Onboard Restroom",
            content:
              "Enjoy the convenience of a clean, private restroom on your coach bus for longer journeys.",
            },
          },
          {
            label: "TVs & entertainment system",
            modal: {
            title: "TVs & Entertainment System",
            content:
              "Watch movies or presentations on flat-screen TVs with a premium entertainment system.",
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
            <PartyBusFeatureModalButton
            title={feature.modal.title}
            content={feature.modal.content}
            label={feature.label}
            />
            <span className="text-blue-500 text-lg ml-2">→</span>
          </li>
          ))}
        </ul>
        </div>
      </div>
      </section>


      {/* Trust & Reputation */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-blue-900">
        The Most Trusted Limo & Bus Rental Company
          </h2>
          <p className="text-xl text-gray-700 mb-10">
        Trusted by thousands, booked in minutes, driven by a passion for
        making every ride unforgettable.
          </p>
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
          "Book for as little as 2-3 hours on most vehicles. Only pay for the time you need—perfect for short trips and special events.",
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
            className="bg-white rounded-2xl shadow-xl p-5 flex flex-col items-center border-2 border-blue-100 relative"
          >
            <PartyBusFeatureModalButton
          label={feature.title}
          title={feature.title}
          content={feature.content}
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-500 text-2xl pointer-events-none">
          →
            </span>
          </div>
        ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border-2 border-blue-100 hover:shadow-2xl transition relative">
          <span className="text-4xl mb-3">📞</span>
          <PartyBusFeatureModalButton
            label="1. Contact Us"
            title="Contact Us"
            content={
              <>
            <p>Call, email, or fill out our quote form to get started. Our team will help you find the perfect vehicle for your event.</p>
              </>
            }
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 text-2xl pointer-events-none">→</span>
            </div>
            {/* Step 2 */}
            <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border-2 border-blue-100 hover:shadow-2xl transition relative">
          <span className="text-4xl mb-3">💬</span>
          <PartyBusFeatureModalButton
            label="2. Get a Quote"
            title="Get a Quote"
            content={
              <>
            <p>
              Receive a fast, transparent quote based on your trip details—city, date, hours, and group size. No hidden fees.
            </p>
              </>
            }
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 text-2xl pointer-events-none">→</span>
            </div>
            {/* Step 3 */}
            <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border-2 border-blue-100 hover:shadow-2xl transition relative">
          <span className="text-4xl mb-3">📝</span>
          <PartyBusFeatureModalButton
            label="3. Reserve Your Ride"
            title="Reserve Your Ride"
            content={
              <>
            <p>
              Lock in your vehicle with a deposit. We’ll confirm all details and send your reservation agreement for review.
            </p>
              </>
            }
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 text-2xl pointer-events-none">→</span>
            </div>
            {/* Step 4 */}
            <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border-2 border-blue-100 hover:shadow-2xl transition relative">
          <span className="text-4xl mb-3">🎉</span>
          <PartyBusFeatureModalButton
            label="4. Finalize & Ride"
            title="Finalize & Ride"
            content={
              <>
            <p>
              Remaining balance is billed 7–14 days before your trip. We manage all service details on the day—just relax and enjoy the ride!
            </p>
            <div className="text-gray-700 text-base mt-2">
              Finalize details & enjoy your trip!
            </div>
              </>
            }
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 text-2xl pointer-events-none">→</span>
            </div>
          </div>
        </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-4 py-12">
  <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 text-center mb-8 tracking-tight">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 max-w-4xl mx-auto">
          {/* First row of 4 reviews */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
            <p className="text-gray-700 italic mb-4 text-lg">
              “Absolutely excellent! Great customer service! We changed drop off
              points several times and they were so accommodating. Gail in the
              office is top notch and on top of everything! The price was very
              good. The driver was so nice and professional. The limo looked
              pristine, inside and out. Use them, you wont regret it!! Used for
              my son&apos;s wedding on August 11.”
            </p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700">— Paul P.</span>
              <span className="text-yellow-400">★★★★★</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
            <p className="text-gray-700 italic mb-4 text-lg">
              “The limo company that you need to call when u have an event.
              Prices and limos and party bus are like no other limo company.”
            </p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700">— Jessie A.</span>
              <span className="text-yellow-400">★★★★★</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
            <p className="text-gray-700 italic mb-4 text-lg">
              “Definitely lives up to their name! We used them for our
              bachelorette/bachelor parties and our wedding and will be using
              them again. They were absolutely great! Even let me extend an hour
              when I decided my bachelorette party was too much fun and I wasn&apos;t
              ready to go yet!! :) I would absolutely recommend them and do to
              everyone!!”
            </p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700">— Dee C.</span>
              <span className="text-yellow-400">★★★★★</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
            <p className="text-gray-700 italic mb-4 text-lg">
              “The price is great, inside is very clean, driver was very friendly
              and accommodating! Will never use another company besides this
              one!”
            </p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700">— Halee H.</span>
              <span className="text-yellow-400">★★★★★</span>
            </div>
          </div>
        </div>
        {/* MORE REVIEWS button after first 4 reviews */}
        <div className="flex justify-center my-8">
          <Link
            href="/reviews"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-lg text-lg"
          >
            MORE REVIEWS
          </Link>
        </div>
      </section>
 {/* Tools Section (original slider version) */}
      <section className="max-w-6xl mx-auto px-4 py-12">
  <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 text-center mb-8 tracking-tight">
          Tools
        </h2>
        <p className="text-lg text-center text-blue-900 mb-6 max-w-2xl mx-auto">
          Discover our exclusive suite of free tools—designed to make planning your party bus, limo, or group trip effortless. From instant quotes and route planners to weather checkers and event sync, these tools help you compare, book, and enjoy your ride with total confidence. Try them all and see why Bus2Ride is the most trusted name in group transportation!
        </p>
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border-2 border-blue-100">
          <ToolsSlider />
        </div>
      </section>
  {/* Polls */}
  <div className="max-w-6xl mx-auto px-4 mt-12 mb-2">
    <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 text-center mb-2 tracking-tight">Limo Industry Polls</h2>
    <p className="text-lg text-center text-blue-900 mb-6 max-w-2xl mx-auto">
      See what real riders and industry pros are saying! Our live polls help you compare trends, get honest opinions, and make smarter choices for your next trip. Vote, view results, and join the conversation.
    </p>
  </div>
  <PollsSection />
  {/* Live Weather & Comfort Advisor */}
  <div className="py-8">
    <h2 className="text-4xl md:text-5xl font-extrabold text-sky-700 text-center mb-8 tracking-tight flex items-center gap-2">
      <span role="img" aria-label="fire">🔥</span> Smart Weather & Comfort Tips
    </h2>
    <LiveWeatherAdvisor />
  </div>

      {/* Review Submission & Slideshow Maker (Python backend suggestion) */}
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto px-4 py-12">
        {/* Review Submission */}
        <div className="flex-1 min-w-[260px]">
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 text-center mb-8 tracking-tight">
            Leave a Review & Get Featured Above!
          </h2>
          <p className="text-gray-700 mb-4">
            Want to see your review in the main section above? Share your Bus2Ride experience below! Submit your review, add photos, or even upload a video. The best reviews will be featured at the top of this page for everyone to see.
          </p>
          <p className="text-green-700 font-semibold mb-2">
            Featured reviews may appear on our homepage and social media.
          </p>
          {/* 
            To make this work in Python:
            - Use a Python backend (e.g., FastAPI, Django, Flask) with an endpoint to receive form data and file uploads.
            - Use fetch or axios in React to POST the form data (including files) to your Python API.
            - Store reviews and media in your backend/database.
            - For testing, you can use FastAPI's /docs to test uploads, or use Postman.
            - On submit, prevent default and send data via fetch to your Python endpoint.
          */}
          {/* Client component for review form */}
          <ReviewForm />
        </div>

        {/* Slideshow Maker */}
        <div className="flex-1 min-w-[260px] border-l border-gray-200 pl-0 md:pl-8 flex flex-col items-center md:items-start">
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 text-center mb-8 tracking-tight">
            Make & Share Your Slideshow Video
          </h2>
          <p className="text-gray-700 mb-4">
            Upload your favorite party or limo photos (or anything else you’d like to share) and we’ll instantly turn them into a fun, shareable slideshow video—perfect for posting on Facebook, Instagram, or linking on your blog, website, or email.
Show off your ride, your event, or your crew—then share the link anywhere!
          </p>
          {/* 
            For slideshow video generation in Python:
            - Use a Python backend (e.g., FastAPI) with an endpoint to accept multiple image uploads.
            - Use a library like moviepy or OpenCV to generate a video from images.
            - Return the video file or a download link.
            - In React, POST the images to your Python endpoint and show a download link or preview when ready.
          */}
          <div id="slideshow-tool" className="w-full flex flex-col items-center mb-2">
            {/* Link to Slideshow Tool removed as requested */}
          </div>
          <SlideshowMaker />

        </div>
      </div>

      {/* Group Transportation Services */}
      <section className="max-w-7xl mx-auto px-4 py-12 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
        {/* Decorative Confetti SVGs */}
        <svg className="absolute left-0 top-0 w-48 h-48 opacity-20 pointer-events-none" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="12" fill="#60a5fa"/>
          <rect x="120" y="30" width="18" height="18" rx="4" fill="#fbbf24"/>
          <circle cx="170" cy="80" r="8" fill="#f472b6"/>
          <rect x="60" y="120" width="14" height="14" rx="3" fill="#34d399"/>
          <circle cx="180" cy="180" r="10" fill="#818cf8"/>
        </svg>
        <svg className="absolute right-0 bottom-0 w-56 h-56 opacity-20 pointer-events-none" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="180" cy="40" r="14" fill="#fbbf24"/>
          <rect x="30" y="160" width="20" height="20" rx="5" fill="#60a5fa"/>
          <circle cx="60" cy="60" r="10" fill="#f472b6"/>
          <rect x="120" y="120" width="16" height="16" rx="4" fill="#34d399"/>
          <circle cx="40" cy="200" r="12" fill="#818cf8"/>
        </svg>
  <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 text-center mb-8 tracking-tight">Events & Occasions</h2>
        {/* Render events in rows of 5, only once */}
        {Array.from({ length: Math.ceil(eventNames.length / 5) }).map((_, rowIdx) => (
  <React.Fragment key={rowIdx}>
            <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
              {eventNames.slice(rowIdx * 5, rowIdx * 5 + 5).map((event, i) => (
                <a
                  key={event}
                  href={`/events/${event.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
                  className="bg-white rounded-xl shadow p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-300 hover:-translate-y-2 cursor-pointer group text-inherit no-underline"
                >
                  <img src={eventImages[rowIdx * 5 + i]} alt="Party Bus" className="w-full h-64 aspect-[4/3] object-cover rounded-lg mb-4" />
                  <h4 className="font-semibold mb-2 text-center group-hover:text-blue-700 transition-colors">{event}</h4>
                  <span className="text-blue-700 font-bold hover:underline mb-2">Learn More</span>
                  <span className="block w-full bg-blue-700 text-white font-bold py-2 rounded-lg text-center mb-1 mt-2 opacity-80 group-hover:opacity-100 transition">Call 888-535-2566</span>
                  <span className="block w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-center opacity-80 group-hover:opacity-100 transition">info@bus2ride.com</span>
                </a>
              ))}
            </div>
            {(rowIdx + 1) % 2 === 0 && rowIdx !== Array.from({ length: Math.ceil(eventNames.length / 5) }).length - 1 && (
              <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-2xl shadow-xl px-10 py-8 flex flex-col items-center w-full max-w-3xl border-2 border-blue-400">
                  <div className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">Ready to Book or Have Questions?</div>
                  <div className="mb-4 text-lg">Call <a href="tel:8885352566" className="underline font-bold">888-535-2566</a> or email <a href="mailto:info@bus2ride.com" className="underline font-bold">info@bus2ride.com</a></div>
                  <a href="/quote" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition">Get a Free Quote</a>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
  </section>
      {/* Blog & Resources */}

        {/* Did You Know (Modern Scrollable Cards) */}
        <section className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-8 border border-blue-400 my-12">
        <h3 className="text-2xl md:text-3xl font-extrabold mb-6 text-blue-900 tracking-tight">Did You Know?</h3>
        <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
          {[
          {
            icon: "🛋️",
            title: "Book by comfort, not max headcount",
            desc: "Most buses seat more than their ‘comfortable’ number.",
          },
          {
            icon: "🎓",
            title: "Prom Saturdays sell out first",
            desc: "Book 3–6 weeks early (Mar–May) for best selection.",
          },
          {
            icon: "🚦",
            title: "Gameday traffic can double travel time",
            desc: "Add a 30–45 min buffer for big events.",
          },
          {
            icon: "💡",
            title: "LED party lighting uses almost no power",
            desc: "Run it the whole trip for max fun.",
          },
          {
            icon: "📍",
            title: "Most venues require a loading zone",
            desc: "Ask us for the exact pin to avoid delays.",
          },
          ].map((fact, idx) => (
          <div key={idx} className="min-w-[260px] bg-white rounded-xl shadow p-6 flex flex-col items-center border-2 border-blue-400">
            <div className="text-4xl mb-2">{fact.icon}</div>
            <div className="font-semibold text-lg text-blue-900 mb-1 text-center">{fact.title}</div>
            <div className="text-blue-800 text-center text-base">{fact.desc}</div>
          </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <a
          href="/facts"
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-xl transition"
          >
          More Facts
          </a>
        </div>
        </section>

  {/* Blog Topics */}
  <section className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-8 border border-blue-400 my-12">
    <h3 className="text-2xl md:text-3xl font-extrabold mb-8 text-blue-900 tracking-tight">Blog Topics</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
      {[
        {
          icon: "💍",
          title: "Wedding Shuttle Timeline: Exactly When to Book & How Many Runs",
          desc: "A step-by-step guide to planning your wedding shuttle, including timing and logistics for stress-free transport.",
        },
        {
          icon: "🚌",
          title: "Prom Bus Safety & Rules (Parents’ Quick Guide)",
          desc: "Everything parents need to know about prom bus safety, rules, and peace of mind for the big night.",
        },
        {
          icon: "🏟️",
          title: "College Gameday Bus: Tailgate Checklist + Stadium Drop-offs (DAL/AUS/HOU/DEN)",
          desc: "Your ultimate checklist for a winning tailgate and smooth stadium drop-off in major cities.",
        },
        {
          icon: "💰",
          title: "How Much Does a Party Bus Cost in [City]? (Real Ranges + Examples)",
          desc: "See real price ranges and examples for party bus rentals in your city, so you can budget with confidence.",
        },
        {
          icon: "🤔",
          title: "Charter Bus vs Party Bus vs Limo: What’s Right for Your Group?",
          desc: "Compare the pros and cons of each vehicle type to find the perfect fit for your group and occasion.",
        },
      ].map((blog, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col border-2 border-blue-400">
          <div className="w-full h-32 bg-blue-100 rounded mb-4 flex items-center justify-center text-blue-400 text-4xl">{blog.icon}</div>
          <div className="font-bold text-lg mb-2 text-blue-900">{blog.title}</div>
          <div className="text-blue-800 mb-3">{blog.desc}</div>
          <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow transition self-start">Read More</button>
        </div>
      ))}
    </div>
    <div className="flex justify-center mt-8">
      <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-xl transition">More Blog Posts</button>
    </div>
  </section>

  {/* Contact & Booking CTA */}
  <section className="bg-blue-900 text-white py-12">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Book Your Bus or Limo Today!</h2>
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        <div className="bg-blue-700 rounded-lg px-6 py-3 font-bold text-lg">
          {/* PollsSection replaces all static poll markup */}
          {/* Footer and other elements should be implemented in a separate layout or Footer component if needed */}
        </div>
      </div>
    </div>
  </section>
  </>
  );
}