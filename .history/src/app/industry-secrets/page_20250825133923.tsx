"use client";
import React from "react";

const EVENT_FACTS = [
  {
    id: "prom",
    event: "Prom",
    fact: "Prom Saturdays sell out first—book 3–6 weeks early for best selection!",
  },
  {
    id: "wedding",
    event: "Wedding",
    fact: "Limos and party buses are the most popular for weddings—reserve early for best choice!",
  },
  {
    id: "gameday",
    event: "Gameday",
    fact: "Gameday traffic can double travel time. Add a 30–45 min buffer for big events.",
  },
  {
    id: "birthday",
    event: "Birthday",
    fact: "Party buses are a top pick for milestone birthdays—bring your own playlist and drinks!",
  },
  {
    id: "corporate",
    event: "Corporate",
    fact: "Coach buses with WiFi and outlets are ideal for corporate outings and team events.",
  },
  {
    id: "concert",
    event: "Concert",
    fact: "Shuttles and party buses make concert parking and drop-off a breeze—no need to worry about traffic or parking!",
  },
  {
    id: "airport",
    event: "Airport Transfer",
    fact: "SUVs and sedans are the most popular for airport transfers—book in advance for early flights.",
  },
  {
    id: "quinceanera",
    event: "Quinceañera",
    fact: "Quinceañeras often book stretch limos or party buses for the whole court—plan ahead for group size!",
  },
  {
    id: "bachelor_bachelorette",
    event: "Bachelor/Bachelorette",
    fact: "Party buses with dance poles and LED lighting are a favorite for bachelor and bachelorette parties!",
  },
  {
    id: "graduation",
    event: "Graduation",
    fact: "Graduation parties love party buses for safe, fun group travel between venues.",
  },
  {
    id: "retirement",
    event: "Retirement",
    fact: "Retirement celebrations often choose limos for a touch of luxury and nostalgia.",
  },
  {
    id: "anniversary",
    event: "Anniversary",
    fact: "Anniversaries are perfect for a romantic limo ride—ask about complimentary champagne!",
  },
];

type EventFactType = {
  id: string;
  event: string;
  fact: string;
};

function EventFactCard({ fact }: { fact: EventFactType }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start border-l-4 border-blue-400 w-full">
      <div className="font-bold mb-2 text-blue-900 text-lg">{fact.event}</div>
      <div className="text-blue-800 text-base">{fact.fact}</div>
    </div>
  );
}

export default function FactsPage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-8 border border-blue-400 max-w-5xl mx-auto my-12">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-blue-900 tracking-tight" style={{ letterSpacing: '0.01em' }}>
        Limo & Party Bus Facts by Event
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {EVENT_FACTS.map((fact) => (
          <EventFactCard key={fact.id} fact={fact} />
        ))}
      </div>
      <div className="text-gray-500 text-base mt-2 text-center">
        <span className="font-semibold text-blue-900">Want more tips and facts?</span>
        <br />
        <a href="/" className="text-blue-700 hover:underline font-bold text-lg" rel="noopener noreferrer">
          Back to Home
        </a>
      </div>
    </div>
  );
}
