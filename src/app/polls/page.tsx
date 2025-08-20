"use client";

import React, { useState, useEffect } from "react";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";

const pollCategories = [
  // Party Bus, Limousine, Coach/Charter Bus already filled above
  // Now fill out all remaining categories with 10+ polls each
  {
    title: 'Black Car / Luxury Sedan Polls',
    parent: 'Transportation Service Types',
    polls: [
      'What’s your favorite luxury sedan brand? (A: Mercedes, B: BMW, C: Audi, D: Lexus)',
      'Do you prefer black or white sedans? (A: Black, B: White)',
      'True or False: Sedans are best for airport transfers.',
      'Would you book a luxury sedan for a business trip? (Yes/No)',
      'Which sedan feature is most important? (A: Comfort, B: Privacy, C: Tech, D: Style)',
      'Would you recommend a black car service? (Yes/No)',
      'True or False: Luxury sedans are safer than taxis.',
      'Which city has the best black car service? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a luxury sedan for a night out? (Yes/No)',
      'True or False: Sedans are more comfortable than SUVs.',
      'Would you book a luxury sedan for a wedding? (Yes/No)',
      'What’s the best sedan amenity? (A: WiFi, B: Leather, C: Sound, D: Privacy)',
    ],
  },
  {
    title: 'SUV / Executive Transport Polls',
    parent: 'Transportation Service Types',
    polls: [
      'Do you prefer SUVs or sedans for airport transfers? (A: SUV, B: Sedan)',
      'Would you book an SUV for a night out? (Yes/No)',
      'True or False: SUVs are safer than sedans.',
      'Would you recommend an executive SUV? (Yes/No)',
      'Which SUV feature is most important? (A: Space, B: Comfort, C: Tech, D: Style)',
      'Would you use an SUV for a business trip? (Yes/No)',
      'True or False: SUVs are best for group travel.',
      'Which city has the best SUV service? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you book an SUV for a wedding? (Yes/No)',
      'What’s the best SUV amenity? (A: WiFi, B: Leather, C: Sound, D: Privacy)',
      'Would you use an SUV for a concert? (Yes/No)',
    ],
  },
  {
    title: 'Shuttle / Minibus Polls',
    parent: 'Transportation Service Types',
    polls: [
      'Have you ever used a shuttle for a concert? (Yes/No)',
      'Which is better for groups? (A: Shuttle, B: Minibus)',
      'True or False: Minibuses are more fun than shuttles.',
      'Would you book a minibus for a wedding? (Yes/No)',
      'Which minibus feature is most important? (A: Space, B: Comfort, C: Tech, D: Style)',
      'Would you recommend a shuttle service? (Yes/No)',
      'True or False: Shuttles are best for airport transfers.',
      'Which city has the best shuttle service? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a minibus for a night out? (Yes/No)',
      'What’s the best minibus amenity? (A: WiFi, B: Leather, C: Sound, D: Privacy)',
      'Would you use a shuttle for a business trip? (Yes/No)',
    ],
  },
  {
    title: 'Prom Transportation Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Would you book a limo for prom? (Yes/No)',
      'Which ride is best for prom? (A: Limo, B: Party Bus, C: SUV, D: Shuttle)',
      'True or False: Prom is the most popular event for limos.',
      'Would you book a party bus for prom? (Yes/No)',
      'Which is the most fun for prom? (A: Limo, B: Party Bus, C: SUV, D: Shuttle)',
      'Would you recommend a limo for prom? (Yes/No)',
      'True or False: Party buses are safer than limos for prom.',
      'Which city has the best prom rides? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a shuttle for prom? (Yes/No)',
      'What’s the best prom amenity? (A: Lights, B: Sound, C: Bar, D: TV)',
    ],
  },
  {
    title: 'Wedding Transportation Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Would you book a party bus for a wedding? (Yes/No)',
      'What’s the best wedding getaway car? (A: Limo, B: Classic Car, C: SUV, D: Party Bus)',
      'True or False: Most couples use limos for weddings.',
      'Would you book a shuttle for a wedding? (Yes/No)',
      'Which is the most fun for weddings? (A: Limo, B: Party Bus, C: SUV, D: Shuttle)',
      'Would you recommend a limo for a wedding? (Yes/No)',
      'True or False: Party buses are safer than limos for weddings.',
      'Which city has the best wedding rides? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a minibus for a wedding? (Yes/No)',
      'What’s the best wedding amenity? (A: Lights, B: Sound, C: Bar, D: TV)',
    ],
  },
  {
    title: 'Sporting Event Transportation Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Would you take a charter bus to a game? (Yes/No)',
      'Which is best for tailgating? (A: Party Bus, B: Shuttle, C: Limo, D: SUV)',
      'True or False: Buses are the safest way to travel to games.',
      'Would you book a party bus for a game? (Yes/No)',
      'Which is the most fun for games? (A: Limo, B: Party Bus, C: SUV, D: Shuttle)',
      'Would you recommend a shuttle for a game? (Yes/No)',
      'True or False: Party buses are safer than limos for games.',
      'Which city has the best game rides? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a minibus for a game? (Yes/No)',
      'What’s the best game amenity? (A: Lights, B: Sound, C: Bar, D: TV)',
    ],
  },
  {
    title: 'Concert & Festival Transportation Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Have you ever used a shuttle for a concert? (Yes/No)',
      'What’s your favorite way to get to a festival? (A: Party Bus, B: Shuttle, C: Limo, D: Carpool)',
      'True or False: Party buses are the most fun for concerts.',
      'Would you book a party bus for a concert? (Yes/No)',
      'Which is the most fun for concerts? (A: Limo, B: Party Bus, C: SUV, D: Shuttle)',
      'Would you recommend a shuttle for a concert? (Yes/No)',
      'True or False: Party buses are safer than limos for concerts.',
      'Which city has the best concert rides? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a minibus for a concert? (Yes/No)',
      'What’s the best concert amenity? (A: Lights, B: Sound, C: Bar, D: TV)',
    ],
  },
  {
    title: 'Airport Transfer Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Do you prefer SUVs or sedans for airport transfers? (A: SUV, B: Sedan)',
      'Would you pay extra for a meet & greet? (Yes/No)',
      'True or False: Airport transfers are less stressful with a professional driver.',
      'Would you book a shuttle for an airport transfer? (Yes/No)',
      'Which is the most comfortable for airport transfers? (A: Limo, B: Party Bus, C: SUV, D: Shuttle)',
      'Would you recommend a limo for airport transfers? (Yes/No)',
      'True or False: Party buses are safer than limos for airport transfers.',
      'Which city has the best airport rides? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a minibus for an airport transfer? (Yes/No)',
      'What’s the best airport amenity? (A: WiFi, B: Leather, C: Sound, D: Privacy)',
    ],
  },
  {
    title: 'Bachelor/Bachelorette Party Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Would you book a party bus for a bachelor/bachelorette party? (Yes/No)',
      'What’s the best party ride? (A: Limo, B: Party Bus, C: SUV, D: Shuttle)',
      'True or False: Party buses are the most popular for these events.',
      'Would you book a limo for a bachelor party? (Yes/No)',
      'Which is the most fun for bachelor/bachelorette parties? (A: Limo, B: Party Bus, C: SUV, D: Shuttle)',
      'Would you recommend a party bus for a bachelor party? (Yes/No)',
      'True or False: Party buses are safer than limos for bachelor parties.',
      'Which city has the best bachelor party rides? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a minibus for a bachelor party? (Yes/No)',
      'What’s the best bachelor party amenity? (A: Lights, B: Sound, C: Bar, D: TV)',
    ],
  },
  {
    title: 'Birthday Party Transportation Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Would you rent a limo for a birthday? (Yes/No)',
      'What’s the best birthday ride? (A: Limo, B: Party Bus, C: SUV, D: Shuttle)',
      'True or False: Limos are the most popular for birthdays.',
      'Would you book a party bus for a birthday? (Yes/No)',
      'Which is the most fun for birthdays? (A: Limo, B: Party Bus, C: SUV, D: Shuttle)',
      'Would you recommend a party bus for a birthday? (Yes/No)',
      'True or False: Party buses are safer than limos for birthdays.',
      'Which city has the best birthday rides? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a minibus for a birthday? (Yes/No)',
      'What’s the best birthday amenity? (A: Lights, B: Sound, C: Bar, D: TV)',
    ],
  },
  {
    title: 'Casino Trip Transportation Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'What’s your favorite casino trip destination? (A: Vegas, B: Atlantic City, C: Local, D: Other)',
      'Would you book a bus for a casino trip? (Yes/No)',
      'True or False: Casino trips are more fun with a group.',
      'Would you book a limo for a casino trip? (Yes/No)',
      'Which is the most fun for casino trips? (A: Limo, B: Party Bus, C: SUV, D: Shuttle)',
      'Would you recommend a party bus for a casino trip? (Yes/No)',
      'True or False: Party buses are safer than limos for casino trips.',
      'Which city has the best casino trip rides? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a minibus for a casino trip? (Yes/No)',
      'What’s the best casino trip amenity? (A: Lights, B: Sound, C: Bar, D: TV)',
    ],
  },
  {
    title: 'Wine & Brewery Tour Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Would you book a party bus for a wine tour? (Yes/No)',
      'What’s your favorite tour ride? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)',
      'True or False: Wine tours are best with a group.',
      'Would you book a limo for a wine tour? (Yes/No)',
      'Which is the most fun for wine tours? (A: Limo, B: Party Bus, C: SUV, D: Shuttle)',
      'Would you recommend a party bus for a wine tour? (Yes/No)',
      'True or False: Party buses are safer than limos for wine tours.',
      'Which city has the best wine tour rides? (A: Napa, B: Sonoma, C: LA, D: Chicago)',
      'Would you use a minibus for a wine tour? (Yes/No)',
      'What’s the best wine tour amenity? (A: Lights, B: Sound, C: Bar, D: TV)',
    ],
  },
  {
    title: 'New Year’s Eve / Holiday Event Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Would you book a party bus for New Year’s Eve? (Yes/No)',
      'What’s the best holiday event ride? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)',
      'True or False: Party buses are the most popular for NYE.',
      'Would you book a limo for a holiday event? (Yes/No)',
      'Which is the most fun for holiday events? (A: Limo, B: Party Bus, C: SUV, D: Shuttle)',
      'Would you recommend a party bus for NYE? (Yes/No)',
      'True or False: Party buses are safer than limos for NYE.',
      'Which city has the best NYE rides? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a minibus for NYE? (Yes/No)',
      'What’s the best NYE amenity? (A: Lights, B: Sound, C: Bar, D: TV)',
    ],
  },
  {
    title: 'Corporate Event Transportation Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Would you book a shuttle for a corporate event? (Yes/No)',
      'What’s the best corporate ride? (A: Shuttle, B: Limo, C: SUV, D: Party Bus)',
      'True or False: Shuttles are the most popular for corporate events.',
      'Would you book a limo for a corporate event? (Yes/No)',
      'Which is the most fun for corporate events? (A: Limo, B: Party Bus, C: SUV, D: Shuttle)',
      'Would you recommend a shuttle for a corporate event? (Yes/No)',
      'True or False: Party buses are safer than limos for corporate events.',
      'Which city has the best corporate event rides? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a minibus for a corporate event? (Yes/No)',
      'What’s the best corporate event amenity? (A: Lights, B: Sound, C: Bar, D: TV)',
    ],
  },
  {
    title: 'Best Local Party Bus Company Polls (per city)',
    parent: 'Regional & City-Based Transportation',
    polls: [
      'Would you recommend your city’s party bus service? (Yes/No)',
      'Which city has the best party bus options? (A: NYC, B: LA, C: Chicago, D: Miami)',
      'True or False: Local companies are better than national.',
      'Would you book a party bus from a local company? (Yes/No)',
      'Which is the most fun: local or national party bus? (A: Local, B: National)',
      'Would you recommend a local party bus to a friend? (Yes/No)',
      'True or False: Local party buses are safer.',
      'Which city has the best local party bus deals? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a local party bus for a concert? (Yes/No)',
      'What’s the best local party bus amenity? (A: Lights, B: Sound, C: Bar, D: TV)',
    ],
  },
  {
    title: 'Best Limo Service Polls (per city)',
    parent: 'Regional & City-Based Transportation',
    polls: [
      'Best way to find a local limo company? (A: Google, B: Friends, C: Social Media, D: Other)',
      'Would you recommend your city’s limo service? (Yes/No)',
      'True or False: Limo services are always on time.',
      'Would you book a limo from a local company? (Yes/No)',
      'Which is the most fun: local or national limo? (A: Local, B: National)',
      'Would you recommend a local limo to a friend? (Yes/No)',
      'True or False: Local limos are safer.',
      'Which city has the best local limo deals? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a local limo for a concert? (Yes/No)',
      'What’s the best local limo amenity? (A: Lights, B: Sound, C: Bar, D: TV)',
    ],
  },
  {
    title: 'Best Shuttle / Coach Service Polls (per city)',
    parent: 'Regional & City-Based Transportation',
    polls: [
      'Would you recommend your city’s shuttle service? (Yes/No)',
      'Which city has the best shuttle options? (A: NYC, B: LA, C: Chicago, D: Miami)',
      'True or False: Shuttles are always on time.',
      'Would you book a shuttle from a local company? (Yes/No)',
      'Which is the most fun: local or national shuttle? (A: Local, B: National)',
      'Would you recommend a local shuttle to a friend? (Yes/No)',
      'True or False: Local shuttles are safer.',
      'Which city has the best local shuttle deals? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a local shuttle for a concert? (Yes/No)',
      'What’s the best local shuttle amenity? (A: Lights, B: Sound, C: Bar, D: TV)',
    ],
  },
  {
    title: 'Group Travel Comfort Polls',
    parent: 'Travel & Experience',
    polls: [
      'Is WiFi a must-have on group trips? (Yes/No)',
      'How do you rate your last group travel experience? (A: Excellent, B: Good, C: Fair, D: Poor)',
      'True or False: Comfort is more important than price.',
      'Would you pay extra for more comfort? (Yes/No)',
      'Which is the most comfortable? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)',
      'Would you recommend a comfortable ride to a friend? (Yes/No)',
      'True or False: Comfort is the top priority.',
      'Which city has the best group travel comfort? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a minibus for group travel? (Yes/No)',
      'What’s the best comfort amenity? (A: Reclining Seats, B: WiFi, C: Sound, D: Privacy)',
    ],
  },
  {
    title: 'Onboard Amenities Preference Polls',
    parent: 'Travel & Experience',
    polls: [
      'What’s your top onboard amenity? (A: Snacks, B: Drinks, C: Movies, D: Reclining Seats)',
      'Would you pay extra for WiFi? (Yes/No)',
      'True or False: Amenities make or break the trip.',
      'Would you recommend a ride with great amenities? (Yes/No)',
      'Which is the most important amenity? (A: WiFi, B: Snacks, C: Movies, D: Reclining Seats)',
      'Would you use a ride with no amenities? (Yes/No)',
      'True or False: Amenities are more important than price.',
      'Which city has the best amenities? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a minibus for amenities? (Yes/No)',
      'What’s the best amenity for a group? (A: WiFi, B: Snacks, C: Movies, D: Reclining Seats)',
    ],
  },
  {
    title: 'Safety & Reliability Polls',
    parent: 'Travel & Experience',
    polls: [
      'Would you pay extra for a safer vehicle? (Yes/No)',
      'Is reliability more important than price? (Yes/No)',
      'True or False: Safety is the top priority.',
      'Would you recommend a safe ride to a friend? (Yes/No)',
      'Which is the safest? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)',
      'Would you use a ride with a high safety rating? (Yes/No)',
      'True or False: Reliability is more important than comfort.',
      'Which city has the safest rides? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a minibus for safety? (Yes/No)',
      'What’s the best safety feature? (A: Airbags, B: Cameras, C: ABS, D: Driver)',
    ],
  },
  {
    title: 'Pricing & Value Polls',
    parent: 'Travel & Experience',
    polls: [
      'True or False: Price is more important than comfort.',
      'Do you look for deals when booking? (Yes/No)',
      'How do you rate value for money? (A: Excellent, B: Good, C: Fair, D: Poor)',
      'Would you recommend a ride with great value? (Yes/No)',
      'Which is the best value? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)',
      'Would you use a ride with a discount? (Yes/No)',
      'True or False: Value is more important than amenities.',
      'Which city has the best value rides? (A: NYC, B: LA, C: Miami, D: Chicago)',
      'Would you use a minibus for value? (Yes/No)',
      'What’s the best value feature? (A: Price, B: Comfort, C: Amenities, D: Safety)',
    ],
  },
];



const answerOptions = [
  ['Yes', 'No'],
  ['A', 'B', 'C', 'D'],
  ['True', 'False'],
];

function getAnswerType(poll: string) {
  if (/yes|no/i.test(poll)) return answerOptions[0];
  if (/true|false/i.test(poll)) return answerOptions[2];
  if (/preference|comfort|value|best|favorite|which|what|who|how/i.test(poll)) return answerOptions[1];
  return answerOptions[0];
}


export default function Page() {
  // Modal state: which category is open (by title), or null
  const [openModal, setOpenModal] = useState<string | null>(null);
  // Group by parent category for section headers
  const grouped = pollCategories.reduce((acc, cat) => {
    if (!acc[cat.parent]) acc[cat.parent] = [];
    acc[cat.parent].push(cat);
    return acc;
  }, {} as Record<string, typeof pollCategories>);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [openModal]);

  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      <Section className="flex flex-col items-center justify-center text-center !p-0 !py-0 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/30 via-blue-900/10 to-black" />
        <div className="pt-16" />
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg tracking-tight font-serif bg-gradient-to-r from-blue-400 via-blue-300 to-green-400 bg-clip-text text-transparent">
          Industry Polls & Data
        </h1>
        <p className="text-2xl md:text-3xl max-w-3xl mx-auto mb-12 text-blue-100 font-medium">
          Bus2Ride.com offers the most comprehensive, up-to-date data and poll results in the global limo and group transportation industry.<br className="hidden md:block" />
          Explore real customer opinions, trends, and insights to make smarter travel decisions!
        </p>
        <div className="pb-10" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120vw] h-40 bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-green-500/10 blur-2xl opacity-60" />
      </Section>
      {Object.entries(grouped).map(([parent, cats]) => (
        <Section key={parent} className="max-w-7xl mx-auto mb-16 bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl py-10">
          <h2 className="text-4xl font-extrabold mb-10 text-blue-200 font-serif tracking-tight text-center">
            {parent}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {cats.map((cat) => {
              const showCount = 3;
              const hasMore = cat.polls.length > showCount;
              const isModalOpen = openModal === cat.title;
              return (
                <div
                  key={cat.title}
                  className={`relative group bg-blue-950/90 rounded-2xl shadow-2xl p-8 flex flex-col min-h-[340px] border border-blue-700/20 overflow-hidden text-white ${!isModalOpen ? 'hover:scale-105 hover:shadow-2xl transition-all duration-200' : ''}`}
                  style={isModalOpen ? { zIndex: 40, position: 'relative' } : {}}
                >
                  <div className="absolute -top-4 -right-4 opacity-10 text-[7rem] pointer-events-none select-none"></div>
                  <h3 className="text-2xl font-bold mb-6 text-blue-100 font-serif tracking-wide flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2" />
                    {cat.title}
                  </h3>
                  <ul className="space-y-5 mb-4">
                    {cat.polls.slice(0, showCount).map((poll, i) => (
                      <li
                        key={poll}
                        className="flex flex-col gap-2 bg-blue-900/60 rounded-xl px-5 py-4 border border-blue-700/20 hover:bg-blue-900/80 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-blue-100 font-medium text-lg leading-snug font-sans">{poll}</span>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-1">
                          {getAnswerType(poll).map((opt) => (
                            <label
                              key={opt}
                              className="inline-flex items-center cursor-pointer bg-blue-950/80 border border-blue-700/30 rounded-full px-4 py-2 text-base font-semibold text-blue-200 shadow-sm hover:bg-blue-900/80 transition font-sans"
                            >
                              <input type="radio" name={`poll-${cat.title}-${i}`} className="accent-blue-400" disabled />
                              <span className="ml-2">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                  {hasMore && (
                    <button
                      className="mt-auto px-6 py-2 rounded-full bg-gradient-to-r from-pink-400 via-blue-400 to-green-400 text-blue-950 font-extrabold shadow-xl hover:scale-110 hover:shadow-2xl transition-all text-lg focus:outline-none focus:ring-4 focus:ring-pink-300 animate-pulse"
                      onClick={() => setOpenModal(cat.title)}
                      aria-label={`Show more polls for ${cat.title}`}
                      tabIndex={isModalOpen ? -1 : 0}
                      disabled={isModalOpen}
                    >
                      <span className="mr-2">🎉</span> More Polls <span className="ml-2">→</span>
                    </button>
                  )}
                  {/* Modal for more polls */}
                  {isModalOpen && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in"
                      onClick={() => setOpenModal(null)}
                      aria-modal="true"
                      role="dialog"
                    >
                      <div
                        className="bg-gradient-to-br from-blue-900 via-blue-950 to-black rounded-3xl shadow-2xl p-10 max-w-2xl w-full relative border-4 border-pink-400/30 animate-fade-in"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          className="absolute top-4 right-4 text-pink-300 hover:text-pink-500 text-3xl font-extrabold focus:outline-none"
                          onClick={() => setOpenModal(null)}
                          aria-label="Close more polls modal"
                        >
                          ×
                        </button>
                        <h3 className="text-3xl font-extrabold mb-8 text-pink-200 font-serif tracking-wide flex items-center gap-2 drop-shadow">
                          <span className="inline-block w-3 h-3 rounded-full bg-pink-400 mr-2" />
                          {cat.title} <span className="ml-2 text-lg text-blue-200">– All Polls</span>
                        </h3>
                        <ul className="space-y-5 mb-6 max-h-[60vh] overflow-y-auto pr-2">
                          {cat.polls.map((poll, i) => (
                            <li
                              key={poll}
                              className="flex flex-col gap-2 bg-blue-900/70 rounded-xl px-5 py-4 border border-pink-400/20 hover:bg-blue-900/90 transition"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-blue-100 font-medium text-lg leading-snug font-sans">{poll}</span>
                              </div>
                              <div className="flex flex-wrap gap-3 mt-1">
                                {getAnswerType(poll).map((opt) => (
                                  <label
                                    key={opt}
                                    className="inline-flex items-center cursor-pointer bg-blue-950/80 border border-pink-400/30 rounded-full px-4 py-2 text-base font-semibold text-pink-200 shadow-sm hover:bg-blue-900/80 transition font-sans"
                                  >
                                    <input type="radio" name={`modal-poll-${cat.title}-${i}`} className="accent-pink-400" disabled />
                                    <span className="ml-2">{opt}</span>
                                  </label>
                                ))}
                              </div>
                            </li>
                          ))}
                        </ul>
                        <button
                          className="mt-2 px-8 py-3 rounded-full bg-gradient-to-r from-pink-400 via-blue-400 to-green-400 text-blue-950 font-extrabold shadow-xl hover:scale-110 hover:shadow-2xl transition-all text-xl focus:outline-none focus:ring-4 focus:ring-pink-300 w-full"
                          onClick={() => setOpenModal(null)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      ))}
    </PageLayout>
  );
}

