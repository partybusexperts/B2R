

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";

const POLL_QUESTIONS = [
  { id: "partybus_vs_limo", question: "Party Bus vs Limo — which would you pick?", options: ["Party Bus", "Limo"] },
  { id: "event_type", question: "What’s your event?", options: ["Prom", "Wedding", "Gameday", "Birthday", "Corporate"] },
  { id: "matters_most", question: "What matters most?", options: ["Price", "Space", "Lighting", "Sound", "Luggage"] },
  { id: "partybus_safer", question: "True or False: Party buses are safer than limos.", options: ["True", "False"] },
  { id: "rent_partybus_birthday", question: "Would you rent a party bus for a birthday?", options: ["Yes", "No"] },
  { id: "important_partybus_feature", question: "Which party bus feature is most important?", options: ["Sound System", "Lighting", "Bar", "TV Screens"] },
  { id: "rent_limo_birthday", question: "Would you rent a limousine for a birthday?", options: ["Yes", "No"] },
  { id: "favorite_limo_color", question: "What’s your favorite limo color?", options: ["Black", "White", "Pink", "Silver"] },
  { id: "limo_best_wedding", question: "True or False: Limousines are best for weddings.", options: ["True", "False"] },
  { id: "suv_vs_sedan_airport", question: "Do you prefer SUVs or sedans for airport transfers?", options: ["SUV", "Sedan"] },
  { id: "coachbus_feature", question: "Which feature matters most on a coach bus?", options: ["WiFi", "Reclining Seats", "Restroom", "Outlets"] },
  { id: "shuttle_concert", question: "Have you ever used a shuttle for a concert?", options: ["Yes", "No"] },
];

type PollResults = Record<string, Record<string, number>>;


export default function PollResultsPage() {
  const [results, setResults] = useState<PollResults>({});
  const [loading, setLoading] = useState(true);

  // Find the max number of options across all polls
  const maxOptions = React.useMemo(() => {
    return POLL_QUESTIONS.reduce((max, poll) => Math.max(max, poll.options.length), 0);
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/poll/all")
      .then(r => r.json())
      .then(data => {
        setResults(data || {});
        setLoading(false);
      });
  }, []);

  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      <Section className="flex flex-col items-center justify-center text-center !p-0 !py-0 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/30 via-blue-900/10 to-black" />
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg tracking-tight font-serif bg-gradient-to-r from-blue-400 via-blue-300 to-green-400 bg-clip-text text-transparent">
          Limo Industry Poll Results
        </h1>
        <p className="text-2xl md:text-3xl max-w-3xl mx-auto mb-10 text-blue-100 font-medium">
          The most complete and comprehensive data on the limo industry in the world. Explore all-time results from every poll below.
        </p>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120vw] h-40 bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-green-500/10 blur-2xl opacity-60" />
      </Section>
      <Section className="max-w-5xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <Link href="/polls" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg text-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 text-center">
            Do More Polls
          </Link>
          <span className="font-bold text-blue-200 text-lg">or</span>
          <Link href="/poll-results" className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg text-lg transition focus:outline-none focus:ring-2 focus:ring-green-400 text-center">
            See Limo Industry Data
          </Link>
        </div>
        {loading ? (
          <div className="bg-blue-950/80 rounded-2xl shadow p-8 text-center text-blue-200 font-semibold">Loading poll results...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-blue-950/80 rounded-2xl shadow border border-blue-700/20 text-white">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-200 uppercase">Poll Question</th>
                  {Array.from({ length: maxOptions }).map((_, idx) => (
                    <th key={idx} className="px-4 py-3 text-xs font-bold text-blue-200 uppercase">Option {idx + 1}</th>
                  ))}
                  <th className="px-4 py-3 text-xs font-bold text-blue-200 uppercase">Total Votes</th>
                </tr>
              </thead>
              <tbody>
                {POLL_QUESTIONS.map((poll) => {
                  const pollResults = results[poll.id] || {};
                  const totalVotes = Object.values(pollResults).reduce((a, b) => Number(a) + Number(b), 0);
                  return (
                    <tr key={poll.id} className="border-t border-blue-700/20 hover:bg-blue-900/60">
                      <td className="px-4 py-3 text-blue-100 font-semibold text-base max-w-xs whitespace-normal font-sans">{poll.question}</td>
                      {Array.from({ length: maxOptions }).map((_, idx) => {
                        const option = poll.options[idx];
                        if (option) {
                          const count = Number(pollResults[option] || 0);
                          const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                          return (
                            <td key={option} className="px-4 py-3 text-blue-100 text-base text-center font-sans">
                              <div className="font-bold">{option}</div>
                              <div>{count} {totalVotes > 0 ? <span className="text-xs text-blue-300">({percent}%)</span> : null}</div>
                            </td>
                          );
                        } else {
                          return <td key={"empty-" + idx} className="px-4 py-3" />;
                        }
                      })}
                      <td className="px-4 py-3 text-blue-100 text-center font-bold font-sans">{totalVotes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </PageLayout>
  );
}
