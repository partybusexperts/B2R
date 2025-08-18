import React from "react";
import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";

export default function SportingEventsPage() {
  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      <Section className="max-w-5xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-serif tracking-tight text-blue-200">Sporting Events Party Bus & Limo Service</h1>
        <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">Ride in style to the big game! Whether it's football, baseball, basketball, hockey, or a concert, our party buses and limos make every event a VIP experience. Avoid parking hassles, tailgate on the go, and keep your crew together for the ultimate fan adventure.</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-4">
          <a href="/quote" className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition text-center">Get Instant Quote</a>
          <a href="tel:8885352566" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition text-center">Call 888-535-2566</a>
        </div>
      </Section>
      <Section className="max-w-5xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 text-white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-blue-200 font-serif tracking-tight">Why Book a Party Bus for Sporting Events?</h2>
        <ul className="list-disc list-inside text-blue-100 text-lg space-y-2 mb-6">
          <li>Door-to-door service to stadiums and arenas</li>
          <li>BYOB and tailgate on the bus</li>
          <li>Spacious seating for your whole group</li>
          <li>Premium sound system and party lighting</li>
          <li>No parking or traffic headaches</li>
          <li>Safe, professional chauffeurs</li>
        </ul>
      </Section>
      <Section className="max-w-5xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 text-white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-blue-200 font-serif tracking-tight">Popular Events We Serve</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-950/70 rounded-xl p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🏈</span>
            <span className="font-bold text-blue-100 mb-1">Football Games</span>
            <span className="text-blue-200 text-sm">NFL, college, and local teams</span>
          </div>
          <div className="bg-blue-950/70 rounded-xl p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">⚾</span>
            <span className="font-bold text-blue-100 mb-1">Baseball Games</span>
            <span className="text-blue-200 text-sm">MLB, minor league, and more</span>
          </div>
          <div className="bg-blue-950/70 rounded-xl p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🏀</span>
            <span className="font-bold text-blue-100 mb-1">Basketball Games</span>
            <span className="text-blue-200 text-sm">NBA, college, and tournaments</span>
          </div>
          <div className="bg-blue-950/70 rounded-xl p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🎤</span>
            <span className="font-bold text-blue-100 mb-1">Concerts & Special Events</span>
            <span className="text-blue-200 text-sm">Arenas, stadiums, and festivals</span>
          </div>
        </div>
      </Section>
      <Section className="max-w-5xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 text-white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-blue-200 font-serif tracking-tight">FAQ</h2>
        <div className="space-y-6">
          <details className="group border border-blue-700/30 rounded-xl bg-blue-950/70 p-6 hover:bg-blue-900/40 transition-colors text-white">
            <summary className="cursor-pointer text-lg font-semibold text-white group-open:text-white flex items-center gap-2 font-sans">
              <span className="text-2xl">❓</span> Can we bring drinks and food on the bus?
            </summary>
            <p className="mt-3 text-white text-base font-sans">Yes! BYOB is allowed (no glass bottles). Snacks and non-messy food are welcome.</p>
          </details>
          <details className="group border border-blue-700/30 rounded-xl bg-blue-950/70 p-6 hover:bg-blue-900/40 transition-colors text-white">
            <summary className="cursor-pointer text-lg font-semibold text-white group-open:text-white flex items-center gap-2 font-sans">
              <span className="text-2xl">❓</span> How early should we book for big games?
            </summary>
            <p className="mt-3 text-white text-base font-sans">We recommend booking at least 2-4 weeks in advance for major sporting events.</p>
          </details>
          <details className="group border border-blue-700/30 rounded-xl bg-blue-950/70 p-6 hover:bg-blue-900/40 transition-colors text-white">
            <summary className="cursor-pointer text-lg font-semibold text-white group-open:text-white flex items-center gap-2 font-sans">
              <span className="text-2xl">❓</span> Can we make multiple stops?
            </summary>
            <p className="mt-3 text-white text-base font-sans">Absolutely! Unlimited stops are included within your reserved time.</p>
          </details>
        </div>
      </Section>
    </PageLayout>
  );
}
