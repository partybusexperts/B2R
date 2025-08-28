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

export function Poll({ poll, initialResults }: { poll: PollType; initialResults?: Record<string, number> }) {
  const [results, setResults] = useState<PollResults>({});
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Build list of base URL candidates: env override -> same origin -> localhost fallbacks
  const primaryBase = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) ? process.env.NEXT_PUBLIC_API_BASE : '';
  const sameOrigin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
  const rawCandidates = Array.from(new Set([
    primaryBase,
    sameOrigin,
    '', // same-origin relative
    'http://127.0.0.1:8000',
    'http://localhost:8000'
  ])).filter(b => b !== undefined && b !== null);

  // Normalize candidates so we never produce relative paths like '/127.0.0.1:8000/...' which
  // the browser treats as a path on the current origin (causing 404s).
  const baseCandidates = rawCandidates.map((c) => {
    if (!c) return '';
    let s = String(c).trim();
    // strip accidental leading slashes (e.g. '/127.0.0.1:8000')
    s = s.replace(/^\/+/, '');
    // If it's already a relative-empty marker, keep it
    if (s === '') return '';
    // If candidate already starts with a protocol, keep it
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s)) return s;
    // Otherwise treat it as a host[:port] and prefix http:// (safe default for dev)
    return `http://${s}`;
  });
  const buildUrl = (base: string, path: string) => `${base}${path}`.replace(/([^:]?)\/\//g, '$1/');
  const [activeBase, setActiveBase] = useState<string | null>(null);

  useEffect(() => {
    // If parent passed initialResults, use them immediately and skip remote probing.
    if (initialResults && Object.keys(initialResults).length > 0) {
      setResults(initialResults);
      setInitialLoading(false);
      try {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(`poll_vote_${poll.id}`);
          if (stored) setSelectedOption(stored);
        }
      } catch { /* ignore */ }
      return;
    }

    // Fallback: probe existing base candidates (same as before) to get results.
    let aborted = false;
    const controller = new AbortController();
    (async () => {
      setInitialLoading(true);
      setError(null);
      let success = false;
      const list = activeBase ? [activeBase] : baseCandidates;
      for (const candidate of list) {
        try {
          const url = buildUrl(candidate, `/api/poll/results/${poll.id}`);
          const resp = await fetch(url, { signal: controller.signal });
          if (!resp.ok) throw new Error('bad');
          const data = await resp.json();
              if (!aborted) {
                setResults(data.results || {});
                if (!activeBase) setActiveBase(candidate);
                try {
                  if (typeof window !== 'undefined') {
                    const stored = localStorage.getItem(`poll_vote_${poll.id}`);
                    if (stored) setSelectedOption(stored);
                  }
                } catch { /* ignore */ }
              }
          success = true;
          break;
        } catch { /* try next */ }
      }
      if (!success && !aborted) setError('unavailable');
      if (!aborted) setInitialLoading(false);
    })();
    return () => { aborted = true; controller.abort(); };
  }, [poll.id, voted, activeBase, initialResults]);

  // If the remote results stall for whatever reason, stop showing the perpetual "Loading" state
  // so users can still vote — we'll merge remote results if/when they arrive.
  useEffect(() => {
    if (!initialLoading) return;
    const t = setTimeout(() => {
      // Only flip the loading flag; keep error untouched so code still knows remote status
      setInitialLoading(false);
    }, 1500);
    return () => clearTimeout(t);
  }, [initialLoading]);

  const handleVote = async (option: string) => {
    try {
      setLoading(true);
      setError(null);
  const base = activeBase || baseCandidates[0] || '';
  const resp = await fetch(buildUrl(base, '/api/poll/vote'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poll_id: poll.id, option })
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      // After a successful vote, fetch the latest results and persist the user's selection locally
      try {
        const res2 = await fetch(buildUrl(base, `/api/poll/results/${poll.id}`));
        if (res2.ok) {
          const json = await res2.json();
          setResults(json.results || {});
        }
  } catch { /* ignore */ }
      setVoted(true);
      setSelectedOption(option);
  try { if (typeof window !== 'undefined') localStorage.setItem(`poll_vote_${poll.id}`, option); } catch { /* ignore */ }
  } catch {
      setError('vote');
    } finally {
      setLoading(false);
    }
  };

  const totalVotes = Object.values(results).reduce((a, b) => (Number(a) + Number(b)), 0);
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
      {!initialLoading && voted && (
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
      const url = typeof window !== 'undefined' ? `${window.location.origin}/poll-results#${pollId}` : `https://yourdomain.com/poll-results#${pollId}`;
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
  const [allResults, setAllResults] = useState<Record<string, Record<string, number>>>({});
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch('/api/poll/all');
        if (!res.ok) return;
        const json = await res.json();
        if (!aborted) setAllResults(json || {});
      } catch (e) { /* ignore */ }
    })();
    return () => { aborted = true; };
  }, []);

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
