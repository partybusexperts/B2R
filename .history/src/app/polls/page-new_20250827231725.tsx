"use client";

import React, { useEffect, useState, useCallback } from "react";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";
import { Poll } from "../../components/PollsSection";

interface PollData {
  id: string;
  question: string;
  options: string[];
  votes: Record<string, number>;
}

export default function PollsPage() {
  const [polls, setPolls] = useState<PollData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/poll/all');
      if (!response.ok) throw new Error('Failed to fetch polls');
      const data = await response.json();
      setPolls(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  return (
    <PageLayout>
      <Section className="py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Interactive Polls</h1>
            <p className="text-xl text-gray-600">Vote and see what others think</p>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-pulse text-gray-600">Loading polls...</div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8">
              <div className="text-red-600">Error: {error}</div>
              <button
                onClick={fetchPolls}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          )}
          
          {!loading && !error && polls.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-600">No polls available</div>
              <button
                onClick={fetchPolls}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
          )}

          {!loading && !error && polls.length > 0 && (
            <div className="grid gap-8">
              {polls.map((poll) => (
                <Poll
                  key={poll.id}
                  poll={{
                    id: poll.id,
                    question: poll.question,
                    options: poll.options
                  }}
                  initialResults={poll.votes}
                />
              ))}
            </div>
          )}
        </div>
      </Section>
    </PageLayout>
  );
}
