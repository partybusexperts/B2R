"use client";
import React from "react";
import { SmartImage } from "../../components/SmartImage";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";

export default function PartyBus20Page() {
  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      <Section className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 text-white">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <SmartImage
            src="/images/party-buses/18 Passenger White Party Bus Exterior.png"
            alt="20 Passenger Party Bus"
            className="rounded-2xl shadow-xl w-full max-w-md h-72 object-cover object-center border-4 border-blue-700/30 mb-6 md:mb-0"
          />
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-serif tracking-tight text-blue-200">20 Passenger Party Bus</h1>
            <ul className="mb-6 text-lg text-blue-100 list-disc list-inside space-y-2">
              <li>Seats up to 20 passengers comfortably</li>
              <li>Wrap-around leather seating</li>
              <li>Premium sound system with Bluetooth</li>
              <li>LED party lighting & removable dance pole</li>
              <li>Wet bar with ice & bottled water (BYOB)</li>
              <li>Flat screen TV</li>
              <li>Professional chauffeur included</li>
            </ul>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <a href="/quote" className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition text-center">Get Instant Quote</a>
              <a href="tel:8885352566" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition text-center">Call 888-535-2566</a>
            </div>
            <p className="text-blue-100 text-base mb-2">Perfect for birthdays, nights out, proms, weddings, and more. All trips include a professional driver and unlimited stops within your reserved time.</p>
          </div>
        </div>
      </Section>
      <Section className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 text-white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-blue-200 font-serif tracking-tight">Gallery</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-blue-500/40 scrollbar-track-transparent">
          <SmartImage src="/images/party-buses/18 Passenger White Party Bus Exterior.png" alt="Exterior" className="rounded-2xl shadow-xl w-80 h-56 object-cover object-center border-4 border-blue-700/30" />
          <SmartImage src="/images/party-buses/18 Passenger White Party Bus Interior.png" alt="Interior" className="rounded-2xl shadow-xl w-80 h-56 object-cover object-center border-4 border-blue-700/30" />
        </div>
      </Section>
      <Section className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 text-white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-blue-200 font-serif tracking-tight">Typical Uses</h2>
        <ul className="list-disc list-inside text-blue-100 text-lg space-y-2 mb-6">
          <li>Birthday parties</li>
          <li>Bachelor & bachelorette parties</li>
          <li>Proms & homecomings</li>
          <li>Weddings</li>
          <li>Concerts & sporting events</li>
          <li>Bar crawls & nights out</li>
        </ul>
      </Section>
      <Section className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 text-white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-blue-200 font-serif tracking-tight">FAQ</h2>
        <div className="space-y-6">
          <details className="group border border-blue-700/30 rounded-xl bg-blue-950/70 p-6 hover:bg-blue-900/40 transition-colors text-white">
            <summary className="cursor-pointer text-lg font-semibold text-white group-open:text-white flex items-center gap-2 font-sans">
              <span className="text-2xl">❓</span> Can we bring our own drinks?
            </summary>
            <p className="mt-3 text-white text-base font-sans">Yes! All our party buses are BYOB friendly (no glass bottles please).</p>
          </details>
          <details className="group border border-blue-700/30 rounded-xl bg-blue-950/70 p-6 hover:bg-blue-900/40 transition-colors text-white">
            <summary className="cursor-pointer text-lg font-semibold text-white group-open:text-white flex items-center gap-2 font-sans">
              <span className="text-2xl">❓</span> Is there a minimum rental time?
            </summary>
            <p className="mt-3 text-white text-base font-sans">Most rentals have a 4-hour minimum, but we can sometimes accommodate shorter trips.</p>
          </details>
          <details className="group border border-blue-700/30 rounded-xl bg-blue-950/70 p-6 hover:bg-blue-900/40 transition-colors text-white">
            <summary className="cursor-pointer text-lg font-semibold text-white group-open:text-white flex items-center gap-2 font-sans">
              <span className="text-2xl">❓</span> Do you provide a driver?
            </summary>
            <p className="mt-3 text-white text-base font-sans">Yes, all rentals include a professional, licensed chauffeur.</p>
          </details>
          <details className="group border border-blue-700/30 rounded-xl bg-blue-950/70 p-6 hover:bg-blue-900/40 transition-colors text-white">
            <summary className="cursor-pointer text-lg font-semibold text-white group-open:text-white flex items-center gap-2 font-sans">
              <span className="text-2xl">❓</span> Can we play our own music?
            </summary>
            <p className="mt-3 text-white text-base font-sans">Absolutely! All buses have Bluetooth and AUX connections.</p>
          </details>
        </div>
      </Section>
    </PageLayout>
  );
}
