"use client";
import React, { useState, useEffect } from "react";

const POLL_QUESTIONS = [
  {
    id: "partybus_vs_limo",
    question: "Party Bus vs Limo — which would you pick?",
    options: ["Party Bus", "Limo"]
  },
  {
    id: "event_type",
    question: "What’s your event?",
    options: ["Prom", "Wedding", "Gameday", "Birthday", "Corporate"]
  },
  {
    id: "matters_most",
    question: "What matters most?",
    options: ["Price", "Space", "Lighting", "Sound", "Luggage"]
  },
  {
    id: "partybus_safer",
    question: "True or False: Party buses are safer than limos.",
    options: ["True", "False"]
  },
  {
    id: "rent_partybus_birthday",
    question: "Would you rent a party bus for a birthday?",
    options: ["Yes", "No"]
  },
  {
    id: "important_partybus_feature",
    question: "Which party bus feature is most important?",
    options: ["Sound System", "Lighting", "Bar", "TV Screens"]
  },
  {
    id: "rent_limo_birthday",
    question: "Would you rent a limousine for a birthday?",
    options: ["Yes", "No"]
  },
  {
    id: "favorite_limo_color",
    question: "What’s your favorite limo color?",
    options: ["Black", "White", "Pink", "Silver"]
  },
  {
    id: "limo_best_wedding",
    question: "True or False: Limousines are best for weddings.",
    options: ["True", "False"]
  },
  {
    id: "suv_vs_sedan_airport",
    question: "Do you prefer SUVs or sedans for airport transfers?",
    options: ["SUV", "Sedan"]
  },
  {
    id: "coachbus_feature",
    question: "Which feature matters most on a coach bus?",
    options: ["WiFi", "Reclining Seats", "Restroom", "Outlets"]
  },
  {
    id: "shuttle_concert",
    question: "Have you ever used a shuttle for a concert?",
    options: ["Yes", "No"]
  }
];

type PollType = {
  id: string;
  question: string;
  options: string[];
};

type PollResults = Record<string, number>;

function Poll({ poll }: { poll: PollType }) {
  const [results, setResults] = useState<PollResults>({});
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);


  const API_BASE = "http://127.0.0.1:8000";
  useEffect(() => {
    fetch(`${API_BASE}/api/poll/results/${poll.id}`)
      .then(r => r.json())
      .then(data => setResults(data.results || {}));
  }, [poll.id, voted]);

  const handleVote = async (option: string) => {
    setLoading(true);
    await fetch(`${API_BASE}/api/poll/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ poll_id: poll.id, option })
    });
    setVoted(true);
    setLoading(false);
  };

  const totalVotes = Object.values(results).reduce((a, b) => (Number(a) + Number(b)), 0);

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start border-l-4 border-blue-400 w-full">
      <div className="font-bold mb-2">{poll.question}</div>
      {!voted ? (
        <div className="flex gap-2 flex-wrap">
          {poll.options.map(option => (
            <button
              key={option}
              className="px-2 py-1 text-sm bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition flex items-center mb-1"
              onClick={() => handleVote(option)}
              disabled={loading}
            >
              {option} <span className="ml-1 text-blue-500">→</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="w-full mt-2">
          {poll.options.map(option => {
            const count = Number(results[option] || 0);
            const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            return (
              <div key={option} className="flex items-center mb-1 w-full">
                <span className="w-24 text-blue-900 text-sm font-semibold">{option}</span>
                <div className="flex-1 bg-blue-100 rounded h-4 mx-2">
                  <div
                    className="bg-blue-700 h-4 rounded"
                    style={{ width: totalVotes > 0 ? `${percent}%` : 0 }}
                  />
                </div>
                <span className="text-blue-900 text-xs font-bold min-w-[32px] text-right">
                  {count} {totalVotes > 0 ? `(${percent}%)` : ""}
                </span>
              </div>
            );
          })}
          <div className="text-xs text-blue-700 mt-2">Total votes: {totalVotes}</div>
        </div>
      )}
    </div>
  );
}

export default function PollsSection() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-8 border border-blue-400">
  {/* Removed duplicate 'Limo Industry Polls' header to avoid double rendering */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {POLL_QUESTIONS.map((poll) => (
          <Poll key={poll.id} poll={poll} />
        ))}
      </div>
      <div className="text-gray-500 text-base mt-2 text-center">
        <span className="font-semibold text-blue-900">Click here to see all data from all polls, all-time.</span>
        <br />
        <a href="/polls" className="text-blue-700 hover:underline font-bold text-lg" target="_blank" rel="noopener noreferrer">
          The most complete and comprehensive data on the limo industry in the world
        </a>
      </div>
      <div className="flex justify-center mt-8">
        <a href="/polls" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-xl transition">
          More Limo Polls and even more!
        </a>
      </div>
    </div>
  );
}
