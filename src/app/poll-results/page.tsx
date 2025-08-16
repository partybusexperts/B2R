

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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow border border-blue-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-blue-900 uppercase">Poll Question</th>
                {Array.from({ length: maxOptions }).map((_, idx) => (
                  <th key={idx} className="px-4 py-3 text-xs font-bold text-blue-900 uppercase">Option {idx + 1}</th>
                ))}
                <th className="px-4 py-3 text-xs font-bold text-blue-900 uppercase">Total Votes</th>
              </tr>
            </thead>
            <tbody>
              {POLL_QUESTIONS.map((poll) => {
                const pollResults = results[poll.id] || {};
                const totalVotes = Object.values(pollResults).reduce((a, b) => Number(a) + Number(b), 0);
                return (
                  <tr key={poll.id} className="border-t border-blue-100 hover:bg-blue-50">
                    <td className="px-4 py-3 text-blue-900 font-semibold text-sm max-w-xs whitespace-normal">{poll.question}</td>
                    {Array.from({ length: maxOptions }).map((_, idx) => {
                      const option = poll.options[idx];
                      if (option) {
                        const count = Number(pollResults[option] || 0);
                        const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                        return (
                          <td key={option} className="px-4 py-3 text-blue-900 text-sm text-center">
                            <div className="font-bold">{option}</div>
                            <div>{count} {totalVotes > 0 ? <span className="text-xs text-blue-700">({percent}%)</span> : null}</div>
                          </td>
                        );
                      } else {
                        return <td key={"empty-" + idx} className="px-4 py-3" />;
                      }
                    })}
                    <td className="px-4 py-3 text-blue-900 text-center font-bold">{totalVotes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
