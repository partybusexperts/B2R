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

export function Poll({ poll, initialResults }: { poll: PollType; initialResults?: PollResults }) {
  const [results, setResults] = useState<PollResults>(initialResults || {});
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // Helper: always use relative endpoints so Next.js rewrites/proxy can apply
  const resultsPath = (id: string) => `/api/poll/results/${encodeURIComponent(id)}`;
  const votePath = () => `/api/poll/vote`;

  useEffect(() => {
    let aborted = false;
    const controller = new AbortController();

    (async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const res = await fetch(resultsPath(poll.id), { signal: controller.signal });
        if (!res.ok) throw new Error('unavailable');
        const json = await res.json();
        if (!aborted) setResults(json.results ?? json);
      } catch {
        if (!aborted) setError('unavailable');
      } finally {
        if (!aborted) setInitialLoading(false);
      }
    })();

    // load any locally stored vote
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(`poll_vote_${poll.id}`);
        if (stored) setSelectedOption(stored);
      }
    } catch { /* ignore */ }

    return () => { aborted = true; controller.abort(); };
  }, [poll.id]);

  // If remote results stall, stop showing 'Loading' so users can still vote
  useEffect(() => {
    if (!initialLoading) return;
    const t = setTimeout(() => setInitialLoading(false), 1500);
    return () => clearTimeout(t);
  }, [initialLoading]);

  const handleVote = async (option: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(votePath(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poll_id: poll.id, option }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      // optimistic update: increment local count immediately so UI feels instant
      setResults((prev) => {
        const prevCount = Number(prev[option] || 0);
        return { ...prev, [option]: prevCount + 1 };
      });

      // then try to refresh authoritative counts from server
      try {
        const res2 = await fetch(resultsPath(poll.id));
        if (res2.ok) {
          const json = await res2.json();
          setResults(json.results || {});
        }
      } catch { /* ignore */ }

      setVoted(true);
      setSelectedOption(option);
      try { if (typeof window !== 'undefined') localStorage.setItem(`poll_vote_${poll.id}`, option); } catch { /* ignore localStorage failures */ }
    } catch {
      setError('vote');
    } finally {
      setLoading(false);
    }
  };

  const totalVotes = Object.values(results).reduce((a, b) => a + Number(b), 0);

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start border-l-4 border-blue-400 w-full">
      <div className="font-bold mb-2 text-blue-900">{poll.question}</div>
      {initialLoading && (
        <div className="text-xs text-blue-700 animate-pulse">Loading poll...</div>
      )}
      {!initialLoading && error === 'unavailable' && (
        <div className="text-xs text-red-600">Poll service offline. Votes not available (you can still vote).</div>
      )}

      {!initialLoading && !voted && (
        <div className="flex gap-2 flex-wrap">
          {poll.options.map(option => (
            <button
              key={option}
              className="px-2 py-1 text-sm bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center mb-1"
              onClick={() => handleVote(option)}
              disabled={loading}
            >
              {option} <span className="ml-1 text-blue-500">→</span>
            </button>
          ))}
        </div>
      )}

      {!initialLoading && (voted || selectedOption) && (
        <div className="w-full mt-2">
          {poll.options.map(option => {
            const count = Number(results[option] || 0);
            const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            const isMine = selectedOption === option;
            return (
              <div key={option} className="flex items-center mb-1 w-full">
                <span className="w-24 text-blue-800 text-sm font-semibold flex items-center gap-2">
                  <span>{option}</span>
                  {isMine && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded font-medium">Your vote</span>
                  )}
                </span>
                <div className="flex-1 bg-blue-100 rounded h-4 mx-2">
                  <div
                    className={`h-4 rounded ${isMine ? 'bg-green-600' : 'bg-blue-700'}`}
                    style={{ width: totalVotes > 0 ? `${percent}%` : 0 }}
                  />
                </div>
                <span className="text-blue-800 text-xs font-bold min-w-[42px] text-right">
                  {count} {totalVotes > 0 ? `(${percent}%)` : ''}
                </span>
              </div>
            );
          })}
          <div className="text-xs text-blue-700 mt-2">Total votes: {totalVotes}</div>
        </div>
      )}

      {!initialLoading && error === 'vote' && (
        <div className="text-xs text-red-600 mt-2">Vote failed. Try again.</div>
      )}

      <div className="w-full flex items-center justify-center mt-3">
        <PollShareLink pollId={poll.id} />
      </div>
    </div>
  );
}

function PollShareLink({ pollId }: { pollId: string }) {
  const [copied, setCopied] = useState(false);
  const handleShare = (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    try {
      const url = typeof window !== 'undefined' ? `${window.location.origin}/embed/poll/${encodeURIComponent(pollId)}` : `https://yourdomain.com/embed/poll/${encodeURIComponent(pollId)}`;
      navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };
  return (
    <>
      <a href={`#${pollId}`} onClick={handleShare} className="text-sm text-blue-600 underline hover:text-blue-500">
        Share This Poll On Your Website!
      </a>
      {copied && <span className="text-green-600 text-sm ml-2">Copied!</span>}
    </>
  );
}

export default function PollsSection() {
  const [allResults, setAllResults] = useState<Record<string, Record<string, number>>>( {} );
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch('/api/poll/all');
        if (!res.ok) return;
        const json = await res.json();
        let resultsMap = {};
        if (Array.isArray(json)) {
          // Transform array to map: assume each item has id and votes
          json.forEach(item => {
            resultsMap[item.id] = item.votes;
          });
        } else {
          resultsMap = json || {};
        }
        if (!aborted) setAllResults(resultsMap);
      } catch { /* ignore */ }
    })();
    return () => { aborted = true; };
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-8 border border-blue-400">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {POLL_QUESTIONS.map((poll) => (
          <Poll key={poll.id} poll={poll} initialResults={allResults[poll.id] ?? undefined} />
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
