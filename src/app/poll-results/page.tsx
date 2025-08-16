

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

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

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/poll/all")
      .then(r => r.json())
      .then(data => {
        setResults(data || {});
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <Link href="/polls" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400" style={{ minWidth: 160, textAlign: 'center' }}>
          Do More Polls
        </Link>
        <span className="font-bold text-blue-900 text-lg">or</span>
        <Link href="/poll-results" className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg transition focus:outline-none focus:ring-2 focus:ring-green-400" style={{ minWidth: 220, textAlign: 'center' }}>
          See Limo Industry Data
        </Link>
      </div>
      <h1 className="text-3xl font-extrabold mb-6 text-blue-900 text-center">Limo Industry Poll Results</h1>
      <p className="text-blue-800 text-center mb-8">The most complete and comprehensive data on the limo industry in the world. Explore all-time results from every poll below.</p>
      {loading ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-blue-900 font-semibold">Loading poll results...</div>
      ) : (
        <div className="space-y-8">
          {POLL_QUESTIONS.map((poll) => {
            const pollResults = results[poll.id] || {};
            const totalVotes = Object.values(pollResults).reduce((a, b) => Number(a) + Number(b), 0);
            return (
              <div key={poll.id} className="bg-white rounded-xl shadow p-6 border border-blue-200">
                <div className="font-bold text-lg text-blue-900 mb-2">{poll.question}</div>
                {poll.options.map(option => {
                  const count = Number(pollResults[option] || 0);
                  const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                  return (
                    <div key={option} className="flex items-center mb-1 w-full">
                      <span className="w-32 text-blue-900 text-sm font-semibold">{option}</span>
                      <div className="flex-1 bg-blue-100 rounded h-4 mx-2">
                        <div className="bg-blue-700 h-4 rounded" style={{ width: totalVotes > 0 ? `${percent}%` : 0 }} />
                      </div>
                      <span className="text-blue-900 text-xs font-bold min-w-[32px] text-right">
                        {count} {totalVotes > 0 ? `(${percent}%)` : ""}
                      </span>
                    </div>
                  );
                })}
                <div className="text-xs text-blue-700 mt-2">Total votes: {totalVotes}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
