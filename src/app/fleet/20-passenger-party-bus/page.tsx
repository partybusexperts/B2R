import React from "react";

import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import PollsSection from "@/components/PollsSection";

export default function PartyBus20Page() {
  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      {/* Hero & Stats */}
      <Section className="max-w-5xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 text-white">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <img
            src="/images/18 Passenger White Party Bus Exterior.png"
            alt="20 Passenger Party Bus"
            className="rounded-2xl shadow-xl w-full max-w-md h-72 object-cover object-center border-4 border-blue-700/30 mb-6 md:mb-0"
          />
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-serif tracking-tight text-blue-200">20 Passenger Party Bus</h1>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-900/80 rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl font-bold text-blue-200">4.9/5</span>
                <span className="text-blue-100 text-xs">Avg. Rating</span>
              </div>
              <div className="bg-blue-900/80 rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl font-bold text-blue-200">13</span>
                <span className="text-blue-100 text-xs">Years in Business</span>
              </div>
              <div className="bg-blue-900/80 rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl font-bold text-blue-200">365</span>
                <span className="text-blue-100 text-xs">Days Support</span>
              </div>
              <div className="bg-blue-900/80 rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl font-bold text-blue-200">50,000+</span>
                <span className="text-blue-100 text-xs">Trips Completed</span>
              </div>
            </div>
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

      {/* Amenities/Features */}
      <Section className="max-w-5xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 text-white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-blue-200 font-serif tracking-tight">Amenities & Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-blue-950/70 rounded-xl p-4 flex flex-col items-center">
            <span className="text-3xl">💡</span>
            <span className="text-blue-100 mt-2">LED Party Lighting</span>
          </div>
          <div className="bg-blue-950/70 rounded-xl p-4 flex flex-col items-center">
            <span className="text-3xl">🔊</span>
            <span className="text-blue-100 mt-2">Premium Sound System</span>
          </div>
          <div className="bg-blue-950/70 rounded-xl p-4 flex flex-col items-center">
            <span className="text-3xl">🕺</span>
            <span className="text-blue-100 mt-2">Dance Pole</span>
          </div>
          <div className="bg-blue-950/70 rounded-xl p-4 flex flex-col items-center">
            <span className="text-3xl">🛋️</span>
            <span className="text-blue-100 mt-2">Leather Seating</span>
          </div>
          <div className="bg-blue-950/70 rounded-xl p-4 flex flex-col items-center">
            <span className="text-3xl">🍾</span>
            <span className="text-blue-100 mt-2">BYOB Friendly</span>
          </div>
          <div className="bg-blue-950/70 rounded-xl p-4 flex flex-col items-center">
            <span className="text-3xl">📺</span>
            <span className="text-blue-100 mt-2">Flat Screen TV</span>
          </div>
          <div className="bg-blue-950/70 rounded-xl p-4 flex flex-col items-center">
            <span className="text-3xl">🚻</span>
            <span className="text-blue-100 mt-2">Restroom (select buses)</span>
          </div>
          <div className="bg-blue-950/70 rounded-xl p-4 flex flex-col items-center">
            <span className="text-3xl">📶</span>
            <span className="text-blue-100 mt-2">WiFi (select buses)</span>
          </div>
        </div>
      </Section>

      {/* Gallery */}
      <Section className="max-w-5xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 text-white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-blue-200 font-serif tracking-tight">Gallery</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-blue-500/40 scrollbar-track-transparent">
          <img src="/images/18 Passenger White Party Bus Exterior.png" alt="Exterior" className="rounded-2xl shadow-xl w-80 h-56 object-cover object-center border-4 border-blue-700/30" />
          <img src="/images/18 Passenger White Party Bus Interior.png" alt="Interior" className="rounded-2xl shadow-xl w-80 h-56 object-cover object-center border-4 border-blue-700/30" />
          <img src="/images/partybus20.jpg" alt="Party Bus 20" className="rounded-2xl shadow-xl w-80 h-56 object-cover object-center border-4 border-blue-700/30" />
        </div>
      </Section>

      {/* Booking/Quote/CTA */}
      <Section className="max-w-5xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-blue-200 font-serif tracking-tight">Ready To Book?</h2>
        <p className="text-blue-100 text-lg mb-6">Booking with us is quick and easy. Just call or request a quote, and we’ll handle the rest!</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-4">
          <a href="/quote" className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition text-center">Get Instant Quote</a>
          <a href="tel:8885352566" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition text-center">Call 888-535-2566</a>
        </div>
        <div className="text-blue-100 text-base">Our team is here 24/7 — Let’s get you rolling!</div>
      </Section>

      {/* Polls Section */}
      <Section className="max-w-5xl mx-auto my-12 py-10">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-blue-900 font-serif tracking-tight text-center">Limo & Party Bus Polls</h2>
        <PollsSection />
      </Section>

      {/* Tools Section */}
      <Section className="max-w-5xl mx-auto my-12 py-10 text-white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-blue-200 font-serif tracking-tight">Party Bus Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-950/70 rounded-xl p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🗺️</span>
            <span className="font-bold text-blue-100 mb-1">Route Planner</span>
            <span className="text-blue-200 text-sm">Plan your party bus route and stops.</span>
          </div>
          <div className="bg-blue-950/70 rounded-xl p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🕒</span>
            <span className="font-bold text-blue-100 mb-1">Trip Duration Estimator</span>
            <span className="text-blue-200 text-sm">Estimate how long your trip will take.</span>
          </div>
          <div className="bg-blue-950/70 rounded-xl p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">💰</span>
            <span className="font-bold text-blue-100 mb-1">Cost Calculator</span>
            <span className="text-blue-200 text-sm">Get a quick estimate for your party bus rental.</span>
          </div>
        </div>
      </Section>

      {/* Rally Section */}
      <Section className="max-w-5xl mx-auto my-12 py-10 text-white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-blue-200 font-serif tracking-tight">Rally Your Crew</h2>
        <div className="bg-blue-950/70 rounded-xl p-8 flex flex-col items-center text-center">
          <span className="text-4xl mb-2">🎉</span>
          <span className="font-bold text-blue-100 mb-2">Invite friends, split costs, and coordinate your party bus adventure!</span>
          <span className="text-blue-200 text-base">Share your trip details and get everyone on board. The more, the merrier!</span>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className="max-w-5xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 text-white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-blue-200 font-serif tracking-tight">Frequently Asked Questions</h2>
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

      {/* Other Vehicles Section */}
      <Section className="max-w-5xl mx-auto my-12 py-10 text-white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-blue-200 font-serif tracking-tight">Some of Our Other Party Bus Rentals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-950/70 rounded-xl p-6 flex flex-col items-center">
            <img src="/images/partybus30.jpg" alt="30 Passenger Party Bus" className="rounded-xl w-40 h-28 object-cover mb-3 border-2 border-blue-700/30" />
            <span className="font-bold text-blue-100 mb-1">30 Passenger Party Bus</span>
            <a href="/fleet/30-passenger-party-bus" className="text-blue-400 hover:underline text-sm">View This Bus</a>
          </div>
          <div className="bg-blue-950/70 rounded-xl p-6 flex flex-col items-center">
            <img src="/images/partybus40.jpg" alt="40 Passenger Party Bus" className="rounded-xl w-40 h-28 object-cover mb-3 border-2 border-blue-700/30" />
            <span className="font-bold text-blue-100 mb-1">40 Passenger Party Bus</span>
            <a href="/fleet/40-passenger-party-bus" className="text-blue-400 hover:underline text-sm">View This Bus</a>
          </div>
          <div className="bg-blue-950/70 rounded-xl p-6 flex flex-col items-center">
            <img src="/images/limousine.jpg" alt="Limousine" className="rounded-xl w-40 h-28 object-cover mb-3 border-2 border-blue-700/30" />
            <span className="font-bold text-blue-100 mb-1">Limousine</span>
            <a href="/fleet/limousine" className="text-blue-400 hover:underline text-sm">View This Limo</a>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
